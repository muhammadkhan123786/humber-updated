"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Database, Loader2 } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard";
import ProductSourceTable from "./ProductSourceTable";
import ProductSourceForm from "./ProductSourceForm";
import { IProductSource } from "../../../../../../../common/IProduct.source.interface";

const THEME_COLOR = "#FE6B1D";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product-source`;

export default function ProductSourceClient() {
  const [dataList, setDataList] = useState<IProductSource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IProductSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [totalInactiveCount, setTotalInactiveCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: savedUser.id || savedUser._id, search: searchTerm }
      });
      setDataList(res.data.data || []);
      
      // Track stats
      setTotalCount(res.data.data?.length || 0);
      setTotalActiveCount(res.data.data?.filter((d: IProductSource) => d.isActive).length || 0);
      setTotalInactiveCount(res.data.data?.filter((d: IProductSource) => !d.isActive).length || 0);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-[#FE6B1D]">
            <Database size={36} /> Product Sources
          </h1>
          <p className="text-gray-500">Manage where your products are coming from</p>
        </div>
        <button 
          onClick={() => { setEditingData(null); setShowForm(true); }} 
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold bg-[#FE6B1D] shadow-lg transition-transform active:scale-95"
        >
          <Plus size={22} /> Add Source
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by source name..." 
          className="w-full outline-none" 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Stats Cards */}
      <StatsCards 
        totalCount={totalCount}
        activeCount={totalActiveCount}
        inactiveCount={totalInactiveCount}
      />

      {(showForm || editingData) && (
        <ProductSourceForm 
          editingData={editingData} 
          onClose={() => { setShowForm(false); setEditingData(null); }} 
          onRefresh={fetchData} 
          themeColor={THEME_COLOR} 
          apiUrl={API_URL} 
        />
      )}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-orange-500" size={48} /></div>
      ) : (
        <ProductSourceTable 
          data={dataList} 
          onEdit={setEditingData} 
          onDelete={async (id) => {
            if (confirm("Delete this source?")) {
              await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
              fetchData();
            }
          }} 
          themeColor={THEME_COLOR} 
        />
      )}
    </div>
  );
}