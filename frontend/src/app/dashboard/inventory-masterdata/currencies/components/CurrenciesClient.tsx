"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, Plus, Search, Loader2 } from "lucide-react";
import CurrenciesTable from "./CurrenciesTable";
import CurrenciesForm from "./CurrenciesForm";
import Pagination from "@/components/ui/Pagination"; 

const THEME_COLOR = "#FE6B1D";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/currencies`;

export default function CurrenciesClient() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Data logic
  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || savedUser._id;

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          userId, 
          page, 
          limit: 10, 
          search 
        }
      });

      if (res.data && res.data.data) {
        setDataList(res.data.data);
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) { 
        console.error("Fetch Error:", err);
        setDataList([]); 
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm]);

  // 2. Delete logic
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this currency?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(currentPage, searchTerm);
    } catch (err) { 
      alert("Delete failed"); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: THEME_COLOR }}>
              <DollarSign size={36} /> Currencies
            </h1>
            <p className="text-gray-500 mt-1">Manage global currencies and exchange rates for your services</p>
          </div>
          <button 
            onClick={() => { setEditingData(null); setShowForm(true); }} 
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95" 
            style={{ backgroundColor: THEME_COLOR }}
          >
            <Plus size={22} /> Add Currency
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by currency name or symbol..." 
            className="w-full outline-none text-lg" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* Modal Form Rendering */}
        {(showForm || editingData) && (
          <CurrenciesForm 
            editingData={editingData} 
            onClose={() => { setShowForm(false); setEditingData(null); }} 
            onRefresh={() => fetchData(currentPage, searchTerm)} 
            themeColor={THEME_COLOR} 
            apiUrl={API_URL} 
          />
        )}

        {/* Main Content Area */}
        {loading ? (
           <div className="flex flex-col justify-center items-center py-20 gap-3">
              <Loader2 className="animate-spin text-orange-500" size={48} />
              <p className="text-gray-400 font-medium">Loading currencies...</p>
           </div>
        ) : (
          <>
            <CurrenciesTable 
              data={dataList} 
              onEdit={(item) => { setEditingData(item); setShowForm(false); }} 
              onDelete={handleDelete} 
              themeColor={THEME_COLOR} 
            />
            
            <div className="mt-6">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => fetchData(page, searchTerm)} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}