"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { CarFront, Plus, Search } from "lucide-react";
import ModalTable from "./ModalTable";
import ModalForm from "./ModalForm";
import Pagination from "./Pagination";
import { IVehicleModel } from "../types";

const THEME_COLOR = "#FE6B1D";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/vechilemodel`;

export default function VehicleModalClient() {
  const [models, setModels] = useState<IVehicleModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<IVehicleModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchModels = async (page = 1, search = "") => {
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
        setModels(res.data.data);
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchModels(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this model?")) return;
    try {
      const token = localStorage.getItem("token");
      const base64Url = token!.split('.')[1];
      const payloadData = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: payloadData.userId }
      });
      fetchModels(currentPage, searchTerm);
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: THEME_COLOR }}>
            <CarFront size={36} /> Vehicle Models
          </h1>
          <button onClick={() => { setEditingModel(null); setShowForm(true); }} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold" style={{ backgroundColor: THEME_COLOR }}>
            <Plus size={22} /> Add Model
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input className="w-full outline-none text-lg" placeholder="Search models..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {showForm || editingModel ? (
          <ModalForm editingModel={editingModel} onClose={() => { setShowForm(false); setEditingModel(null); }} onRefresh={() => fetchModels(currentPage, searchTerm)} themeColor={THEME_COLOR} apiUrl={API_URL} />
        ) : null}

        {loading ? <div className="text-center py-20 animate-spin">🌀</div> : (
          <>
            <ModalTable data={models} onEdit={setEditingModel} onDelete={handleDelete} themeColor={THEME_COLOR} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchModels(page, searchTerm)} />
          </>
        )}
      </div>
    </div>
  );
}
