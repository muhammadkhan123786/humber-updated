"use client";
import { useState, useEffect, useCallback } from "react";
import { Tag, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import TicketStatusTable from "./TicketStatusTable";
import TicketStatusForm from "./TicketStatusForm";
import StatsCards from "@/app/common-form/StatsCard";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem, updateItem } from "@/helper/apiHelper";
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";
import { handleOptimisticStatusUpdate } from "@/app/common-form/formUtils";

const THEME_COLOR = "var(--primary-gradient)"; // Matches Business Type

type TicketStatusWithId = ITicketStatus & { _id: string };

export default function TicketStatusClient() {
  const [dataList, setDataList] = useState<TicketStatusWithId[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<TicketStatusWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<TicketStatusWithId | null>(null);
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
      const res = await getAll<TicketStatusWithId>("/ticket-status", {
        page: page.toString(),
        limit: "12",
        search: search.trim(),
      });
      const allDataRes = await getAll<TicketStatusWithId>("/ticket-status", {
        limit: "1000",
        search: search.trim(),
      });
      setDataList(res.data || []);
      setFilteredDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 12) || 1);
      setCurrentPage(page);
      setTotalCount(res.total || 0);
      setTotalActiveCount(allDataRes.data?.filter(d => d.isActive).length || 0);
      setTotalInactiveCount(allDataRes.data?.filter(d => !d.isActive).length || 0);
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1, searchTerm);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchData]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredDataList(dataList);
    } else {
      setFilteredDataList(dataList.filter((d) => (filterStatus === 'active' ? d.isActive : !d.isActive)));
    }
  }, [filterStatus, dataList]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteItem("/ticket-status", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  const handleStatusChange = (id: string, newStatus: boolean) => {
  handleOptimisticStatusUpdate(
    id,
    newStatus,
    "/ticket-status", 
    setDataList,
    setTotalActiveCount,
    setTotalInactiveCount,
    updateItem
  );
};

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Tag size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Ticket Statuses</h1>
              <p className="text-orange-50 text-lg">Manage workflow stages</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingData(null); setShowForm(true); }}
            className="flex items-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={22} /> Add Status
          </button>
        </div>

        <StatsCards
          totalCount={totalCount}
          activeCount={totalActiveCount}
          inactiveCount={totalInactiveCount}
          onFilterChange={setFilterStatus}
        />

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search status..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]!">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent">Workflow Stages</h2>
              <p className="text-sm text-gray-500">Define the lifecycle of support tickets</p>
            </div>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setDisplayView("card")} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${displayView === "card" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"}`}><Grid3x3 size={16} /> Card</button>
              <button onClick={() => setDisplayView("table")} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${displayView === "table" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"}`}><List size={16} /> Table</button>
            </div>
          </div>

          {showForm && (
            <TicketStatusForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20"><Loader2 className="animate-spin text-orange-500" size={48} /></div>
          ) : (
            <>
              <TicketStatusTable
                data={filteredDataList}
                displayView={displayView}
                onEdit={(item) => { setEditingData(item); setShowForm(true); }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                themeColor={THEME_COLOR}
              />
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => fetchData(p, searchTerm)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}