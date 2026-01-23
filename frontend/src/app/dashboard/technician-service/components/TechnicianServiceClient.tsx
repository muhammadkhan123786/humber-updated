"use client";
import { useState, useEffect, useCallback } from "react";
import { Settings, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard"; 
import TechnicianServiceTable from "./TechnicianServiceTable";
import TechnicianServiceForm from "./TechnicianServiceForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem, updateItem } from "@/helper/apiHelper";
import { ITechnicianServiceType } from "../../../../../../common/master-interfaces/IService.type.interface";

const THEME_COLOR = "var(--primary-gradient)";
type ServiceTypeWithId = ITechnicianServiceType & { _id: string };

export default function TechnicianServiceClient() {
  const [dataList, setDataList] = useState<ServiceTypeWithId[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<ServiceTypeWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<ServiceTypeWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [totalInactiveCount, setTotalInactiveCount] = useState(0);

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await getAll<ServiceTypeWithId>("/technician-service-types", {
        page: page.toString(),
        limit: "10",
        search: search.trim(),
      });
      setDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 10) || 1);
      setCurrentPage(page);
      setTotalCount(res.total || 0);

      const allRes = await getAll<ServiceTypeWithId>("/technician-service-types", { limit: "1000", search: search.trim() });
      setTotalActiveCount(allRes.data?.filter(d => d.isActive).length || 0);
      setTotalInactiveCount(allRes.data?.filter(d => !d.isActive).length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setFilteredDataList(filterStatus === 'all' ? dataList : dataList.filter(d => filterStatus === 'active' ? d.isActive : !d.isActive));
  }, [filterStatus, dataList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(1, searchTerm), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await deleteItem("/technician-service-types", id);
    fetchData(currentPage, searchTerm);
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
  setDataList((prevList) =>
    prevList.map((item) =>
      item._id === id ? { ...item, isActive: newStatus } : item
    )
  );
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    await updateItem("/technician-service-types", id, { 
      isActive: newStatus, 
      userId: user.id || user._id 
    });
    if (newStatus) {
      setTotalActiveCount((prev) => prev + 1);
      setTotalInactiveCount((prev) => prev - 1);
    } else {
      setTotalActiveCount((prev) => prev - 1);
      setTotalInactiveCount((prev) => prev + 1);
    }
  } catch (error) {
    console.error("Status update failed:", error);
    alert("Failed to update status. Rolling back...");
    
    setDataList((prevList) =>
      prevList.map((item) =>
        item._id === id ? { ...item, isActive: !newStatus } : item
      )
    );
  }
};

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur"><Settings size={32} /></div>
            <div>
              <h1 className="text-3xl font-bold">Technician Service Types</h1>
              <p className="text-blue-100">Manage technician service categories</p>
            </div>
          </div>
          <button onClick={() => { setEditingData(null); setShowForm(true); }} className="bg-white flex justify-center items-center gap-2 text-blue-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all">
            <Plus size={22} /> Add Service Type
          </button>
        </div>

        <StatsCards totalCount={totalCount} activeCount={totalActiveCount} inactiveCount={totalInactiveCount} onFilterChange={setFilterStatus} />

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300">
          <Search className="text-gray-400" size={20} />
          <input type="text" placeholder="Search service types..." className="w-full outline-none text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4 border-[#2B7FFF]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Service Types</h2>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setDisplayView("card")} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${displayView === "card" ? "bg-blue-500 text-white" : "text-gray-600"}`}><Grid3x3 size={16} /> Grid</button>
              <button onClick={() => setDisplayView("table")} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${displayView === "table" ? "bg-blue-500 text-white" : "text-gray-600"}`}><List size={16} /> Table</button>
            </div>
          </div>

          {showForm && <TechnicianServiceForm editingData={editingData} onClose={() => setShowForm(false)} onRefresh={() => fetchData(currentPage, searchTerm)} themeColor={THEME_COLOR} />}

          {loading ? (
            <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /><p className="mt-4 text-gray-400">Loading...</p></div>
          ) : (
            <>
              <TechnicianServiceTable data={filteredDataList} displayView={displayView} onEdit={(item) => { setEditingData(item); setShowForm(true); }} onDelete={handleDelete} onStatusChange={handleStatusChange} themeColor={THEME_COLOR} />
              {filteredDataList.length > 0 && <div className="mt-6"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchData(page, searchTerm)} /></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}