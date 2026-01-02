"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Tv, Loader2 } from "lucide-react";
import ProductChannelTable from "./ProductChannelTable";
import ProductChannelForm from "./ProductChannelForm";
import { IChannel } from "../../../../../../../common/IChannel.interface"; 

const THEME_COLOR = "#FE6B1D";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product-channels`;

export default function ProductChannelClient() {
  const [dataList, setDataList] = useState<IChannel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IChannel | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (err) { 
      console.error(err); 
      setDataList([]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-[#FE6B1D]"><Tv size={36} /> Product Channels</h1>
          <p className="text-gray-500">Manage channels where your products are sold</p>
        </div>
        <button onClick={() => { setEditingData(null); setShowForm(true); }} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold bg-[#FE6B1D] shadow-lg transition-transform active:scale-95">
          <Plus size={22} /> Add Channel
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
        <Search className="text-gray-400" size={20} />
        <input type="text" placeholder="Search channels..." className="w-full outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {(showForm || editingData) && (
        <ProductChannelForm 
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
        <ProductChannelTable 
          data={dataList} 
          onEdit={(item: IChannel) => setEditingData(item)} 
          onDelete={async (id: string) => {
            if (confirm("Are you sure you want to delete this channel?")) {
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