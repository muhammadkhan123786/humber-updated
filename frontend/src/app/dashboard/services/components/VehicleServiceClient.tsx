"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Plus, Search } from "lucide-react";
import ServicesTable from "./ServicesTable";
import ServicesForm from "./ServicesForm";
import Pagination from "../../vehiclebrands/components/Pagination"; 
import { IServiceType } from "../types";

const THEME_COLOR = "#FE6B1D";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/service-types-master`;

export default function VehicleServicesClient() {
  const [services, setServices] = useState<IServiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<IServiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || savedUser._id;

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, page, limit: 10, search }
      });

      if (res.data && res.data.data) {
        setServices(res.data.data);
        console.log(res.data.data,"res data");
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchServices(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service type?")) return;
    try {
      const token = localStorage.getItem("token");
      const base64Url = token!.split('.')[1];
      const payloadData = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: payloadData.userId }
      });
      fetchServices(currentPage, searchTerm);
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: THEME_COLOR }}>
              <Settings size={36} /> Service Types
            </h1>
            <p className="text-gray-500 mt-1">Configure master service categories</p>
          </div>
          <button onClick={() => { setEditingService(null); setShowForm(true); }} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg" style={{ backgroundColor: THEME_COLOR }}>
            <Plus size={22} /> Add Service
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input type="text" placeholder="Search services..." className="w-full outline-none text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {(showForm || editingService) && (
          <ServicesForm editingService={editingService} onClose={() => { setShowForm(false); setEditingService(null); }} onRefresh={() => fetchServices(currentPage, searchTerm)} themeColor={THEME_COLOR} apiUrl={API_URL} />
        )}

        {loading ? <div className="text-center py-20 animate-pulse text-orange-500 font-bold">Loading...</div> : (
          <>
            <ServicesTable data={services} onEdit={setEditingService} onDelete={handleDelete} themeColor={THEME_COLOR} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchServices(page, searchTerm)} />
          </>
        )}
      </div>
    </div>
  );
}