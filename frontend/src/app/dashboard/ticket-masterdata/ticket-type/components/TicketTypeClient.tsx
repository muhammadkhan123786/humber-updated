"use client";
import { useState, useEffect } from "react";
import { Layers, Plus, Search, Loader2 } from "lucide-react";
import TicketTypeTable, { IPopulatedTicketType } from "./TicketTypeTable";
import TicketTypeForm from "./TicketTypeForm";
import { getAlls, deleteItem } from "@/helper/apiHelper";

const THEME_COLOR = "#FE6B1D";
const API_URL = "/ticket-types";

export default function TicketTypeClient() {
  const [dataList, setDataList] = useState<IPopulatedTicketType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IPopulatedTicketType | null>(null);
  const [loading, setLoading] = useState(true);

const fetchData = async () => {
  try {
    setLoading(true);

    const userStr = localStorage.getItem("user");
    const savedUser = JSON.parse(userStr || "{}");

    const res = await getAlls<IPopulatedTicketType>(API_URL, {
      userId: savedUser.id || savedUser._id,
      search: searchTerm,
     
    });

    // ✅ res.data is already IPopulatedTicketType[]
    setDataList(Array.isArray(res.data) ? res.data : []);
    console.log("Ticket Types:", res.data);

  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    setLoading(false);
  }
};




  useEffect(() => { 
    fetchData(); 
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ticket type?")) {
      try {
        await deleteItem(API_URL, id);
        fetchData();
      } catch (err: any) {
        alert(err.message || "Delete failed");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-[#FE6B1D]">
            <Layers size={36} /> Ticket Types
          </h1>
          <p className="text-gray-500 italic">Categorize tickets by technical domains</p>
        </div>
        <button 
          onClick={() => { setEditingData(null); setShowForm(true); }} 
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold bg-[#FE6B1D] shadow-lg active:scale-95 transition-all"
        >
          <Plus size={22} /> New Type
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search types..." 
          className="w-full outline-none text-gray-700" 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {(showForm || editingData) && (
        <TicketTypeForm 
          editingData={editingData} 
          onClose={() => { setShowForm(false); setEditingData(null); }} 
          onRefresh={fetchData} 
          themeColor={THEME_COLOR} 
          apiUrl={API_URL} 
        />
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      ) : (
        <TicketTypeTable 
          data={dataList} 
          onEdit={(item: IPopulatedTicketType) => setEditingData(item)} 
          onDelete={handleDelete} 
          themeColor={THEME_COLOR} 
        />
      )}
    </div>
  );
}