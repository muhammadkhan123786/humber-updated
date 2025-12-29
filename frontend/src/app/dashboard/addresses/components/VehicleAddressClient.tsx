"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapPinned, Search, RefreshCw } from "lucide-react";
import AddressTable from "./AddressTable";
import Pagination from "./Paginaion"; 

const THEME_COLOR = "#FE6B1D";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/addresses`;

export default function VehicleAddressClient() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1, search = "") => {

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || savedUser._id;

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, page, limit: 10, search }
      });
      console.log("Full Response from Backend:", res.data);

      if (res.data && res.data.data) {
        setDataList(res.data.data);
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
        console.log(res.data.data,"Address data");
      }
    } catch (err) { 
        console.error("Address Fetch Error:", err);
        setDataList([]); 
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(currentPage, searchTerm);
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: THEME_COLOR }}>
              <MapPinned size={36} /> Address Management
            </h1>
            <p className="text-gray-500 mt-1">Review and manage registered user addresses</p>
          </div>
          <button 
            onClick={() => fetchData(currentPage, searchTerm)} 
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by street name or zip code..." 
            className="w-full outline-none text-lg" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center py-20 gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="text-gray-400">Loading addresses...</p>
           </div>
        ) : (
          <>
            <AddressTable 
              data={dataList} 
              onEdit={(item) => alert("Edit functionality can be added here if needed.")} 
              onDelete={handleDelete} 
              themeColor={THEME_COLOR} 
            />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => fetchData(page, searchTerm)} 
            />
          </>
        )}
      </div>
    </div>
  );
}