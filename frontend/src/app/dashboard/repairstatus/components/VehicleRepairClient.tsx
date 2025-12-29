"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Wrench, Plus, Search } from "lucide-react";
import RepairTable from "./RepairTable";
import RepairForm from "./RepairForm";
import Pagination from "./Pagination"; // Reusing your pagination
import { IRepairStatus } from "../types";

const THEME_COLOR = "#FE6B1D";
const API_URL = "http://localhost:4000/api/repairstatus";

export default function VehicleRepairClient() {
  const [statuses, setStatuses] = useState<IRepairStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<IRepairStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStatuses = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || savedUser._id;

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, page, limit: 10, search }
      });

      if (res.data && Array.isArray(res.data.data)) {
        setStatuses(res.data.data);
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
      } else {
        setStatuses([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const base64Url = token!.split('.')[1];
      const payloadData = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: payloadData.userId }
      });
      fetchStatuses(currentPage, searchTerm);
    } catch (err: any) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: THEME_COLOR }}>
              <Wrench size={36} /> Repair Statuses
            </h1>
            <p className="text-gray-500 mt-1">Manage repair workflow stages</p>
          </div>
          <button onClick={() => { setEditingStatus(null); setShowForm(true); }} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg" style={{ backgroundColor: THEME_COLOR }}>
            <Plus size={22} /> Add Status
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input type="text" placeholder="Search statuses..." className="w-full outline-none text-gray-700 bg-transparent text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {(showForm || editingStatus) && (
          <RepairForm editingStatus={editingStatus} onClose={() => { setShowForm(false); setEditingStatus(null); }} onRefresh={() => fetchStatuses(currentPage, searchTerm)} themeColor={THEME_COLOR} apiUrl={API_URL} />
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20 animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        ) : (
          <>
            <RepairTable data={statuses} onEdit={setEditingStatus} onDelete={handleDelete} themeColor={THEME_COLOR} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchStatuses(page, searchTerm)} />
          </>
        )}
      </div>
    </div>
  );
}