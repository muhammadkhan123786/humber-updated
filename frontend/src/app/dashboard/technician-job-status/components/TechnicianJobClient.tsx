"use client";
import { useState, useEffect, useCallback } from "react";
import { Activity, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard"; 
import TechnicianJobTable from "./TechnicianJobTable";
import TechnicianJobForm from "./TechnicianJobForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem, updateItem } from "@/helper/apiHelper";
import { ITechnicianJobStatus } from "../../../../../../common/technician-jobs/ITechnician.activity.status.interface";
import { handleOptimisticStatusUpdate } from "@/app/common-form/formUtils";

const THEME_COLOR = "var(--primary-gradient)";
type StatusWithId = ITechnicianJobStatus & { _id: string };

export default function TechnicianJobClient() {
  const [dataList, setDataList] = useState<StatusWithId[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<StatusWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<StatusWithId | null>(null);
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
      const res = await getAll<StatusWithId>("/technician-job-status", {
        page: page.toString(),
        limit: "12",
        search: search.trim(),
      });
      setDataList(res.data || []);
      setFilteredDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 12) || 1);
      setCurrentPage(page);
      
      const allDataRes = await getAll<StatusWithId>("/technician-job-status", {
        limit: "1000",
        search: search.trim(),
      });
      
      setTotalCount(res.total || 0);
      setTotalActiveCount(allDataRes.data?.filter((d) => d.isActive).length || 0);
      setTotalInactiveCount(allDataRes.data?.filter((d) => !d.isActive).length || 0);
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') setFilteredDataList(dataList);
    else setFilteredDataList(dataList.filter((d) => filterStatus === 'active' ? d.isActive : !d.isActive));
  }, [filterStatus, dataList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(1, searchTerm), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this status?")) return;
    try {
      await deleteItem("/technician-job-status", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      alert("Failed to delete status.");
    }
  };

  const handleStatusChange = (id: string, newStatus: boolean) => {
    handleOptimisticStatusUpdate(id, newStatus, "/technician-job-status", setDataList, setTotalActiveCount, setTotalInactiveCount, updateItem);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Activity size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Technician Job Status</h1>
              <p className="text-blue-100 text-sm md:text-lg">Manage statuses for technician workflows</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingData(null); setShowForm(true); }}
            className="flex items-center justify-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            <Plus size={22} /> Add Status
          </button>
        </div>

        <StatsCards 
          totalCount={totalCount}
          activeCount={totalActiveCount}
          inactiveCount={totalInactiveCount}
          onFilterChange={(filter) => setFilterStatus(filter)}
        />

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search status name..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]!">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Status List
            </h2>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setDisplayView("card")} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${displayView === "card" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600"}`}><Grid3x3 size={16} /> Grid</button>
              <button onClick={() => setDisplayView("table")} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${displayView === "table" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600"}`}><List size={16} /> Table</button>
            </div>
          </div>

          {showForm && (
            <TechnicianJobForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
            />
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            <>
              <TechnicianJobTable
                data={filteredDataList}
                displayView={displayView}
                onEdit={(item) => { setEditingData(item); setShowForm(true); }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                themeColor={THEME_COLOR}
              />
              {filteredDataList.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => fetchData(page, searchTerm)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}