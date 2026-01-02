"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Coins, Plus, Search, Loader2 } from "lucide-react";
import CurrenciesTable from "./CurrenciesTable";
import CurrenciesForm from "./CurrenciesForm";
import Pagination from "@/components/ui/Pagination"; 
import { ICurrency } from "../../../../../../../common/ICurrency.interface";

const THEME_COLOR = "#FE6B1D";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/currencies`;

export default function CurrenciesClient() {
  const [dataList, setDataList] = useState<ICurrency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<ICurrency | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: savedUser.id || savedUser._id, page, limit: 10, search }
      });
      if (res.data) {
        setDataList(res.data.data || []);
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(1, searchTerm); 
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-[#FE6B1D]">
              <Coins size={36} /> Currencies
            </h1>
            <p className="text-gray-500 mt-1">Manage global currencies and exchange rates</p>
          </div>
          <button 
            onClick={() => { setEditingData(null); setShowForm(true); }} 
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold bg-[#FE6B1D] shadow-lg active:scale-95 transition-all"
          >
            <Plus size={22} /> Add Currency
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by currency name or symbol..." 
            className="w-full outline-none" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {(showForm || editingData) && (
          <CurrenciesForm 
            editingData={editingData} 
            onClose={() => { setShowForm(false); setEditingData(null); }} 
            onRefresh={() => fetchData(currentPage, searchTerm)} 
            themeColor={THEME_COLOR} 
            apiUrl={API_URL} 
          />
        )}

        {loading ? (
          <div className="py-20 flex justify-center items-center flex-col gap-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-400 animate-pulse">Fetching latest data...</p>
          </div>
        ) : (
          <>
            <CurrenciesTable 
              data={dataList} 
              onEdit={(item) => setEditingData(item)} 
              onDelete={async (id) => {
                if (confirm("Are you sure you want to delete this currency?")) {
                  await axios.delete(`${API_URL}/${id}`, { 
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
                  });
                  fetchData(currentPage, searchTerm);
                }
              }} 
              themeColor={THEME_COLOR} 
            />
            <div className="mt-6">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(p) => fetchData(p, searchTerm)} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}