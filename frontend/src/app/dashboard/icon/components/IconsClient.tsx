"use client";
import { useState, useEffect, useCallback } from "react";
import { Image as IconLib, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard";
import IconsTable from "./IconsTable";
import IconsForm from "./IconsForm";
import Pagination from "@/components/ui/Pagination";
import { IIcons } from "../../../../../../common/master-interfaces/IIcons.interface";
import { fetchIcons, deleteIcon } from "@/hooks/useIcons";
import { updateItem } from "@/helper/apiHelper"; // Ensure this is imported

const THEME_COLOR = "var(--primary-gradient)";

export default function IconsClient() {
  const [dataList, setDataList] = useState<IIcons[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<IIcons[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IIcons | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetchIcons(page, 10, search);
      if (res?.data) {
        setDataList(res.data);
        setFilteredDataList(res.data);
        setTotalPages(Math.ceil(res.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      setDataList([]);
      setFilteredDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter logic based on Status Badge selection
  useEffect(() => {
    let filtered = [...dataList];
    if (filterStatus === 'active') {
      filtered = dataList.filter(item => item.isActive);
    } else if (filterStatus === 'inactive') {
      filtered = dataList.filter(item => !item.isActive);
    }
    setFilteredDataList(filtered);
  }, [filterStatus, dataList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1, searchTerm);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchData]);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      
      await updateItem("/icons", id, {
        isActive: newStatus,
        userId: user.id || user._id,
      });
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Failed to update status.");
      fetchData(currentPage, searchTerm);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this icon?")) return;
    try {
      await deleteIcon(id);
      fetchData(currentPage, searchTerm);
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <IconLib size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Icon Gallery</h1>
              <p className="text-blue-100 text-lg">Upload and manage system icons</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingData(null); setShowForm(true); }}
            className="flex items-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> Add Icon
          </button>
        </div>

        {/* Stats Cards with Filter Trigger */}
        <StatsCards
          totalCount={dataList.length}
          activeCount={dataList.filter(d => d.isActive).length}
          inactiveCount={dataList.filter(d => !d.isActive).length}
          onFilterChange={(filter) => setFilterStatus(filter)}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search icons..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! rounded-b-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                System Icon Assets
              </h2>
              <p className="text-sm text-gray-500">Configure and manage icons for use across the platform</p>
            </div>

            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setDisplayView("card")}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "card" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900"}`}
              >
                <Grid3x3 size={16} /><span className="hidden sm:inline text-sm">Grid</span>
              </button>
              <button
                onClick={() => setDisplayView("table")}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "table" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900"}`}
              >
                <List size={16} /><span className="hidden sm:inline text-sm">Table</span>
              </button>
            </div>
          </div>

          {showForm && (
            <IconsForm
              editingData={editingData}
              onClose={() => { setShowForm(false); setEditingData(null); }}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading icons...</p>
            </div>
          ) : (
            <>
              {filterStatus !== 'all' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium uppercase tracking-wider">
                    {filterStatus} Icons ({filteredDataList.length})
                  </span>
                  <button onClick={() => setFilterStatus('all')} className="text-xs text-blue-600 hover:underline font-bold">
                    Clear Filter
                  </button>
                </div>
              )}
              <IconsTable
                data={filteredDataList}
                displayView={displayView}
                onEdit={(item) => {
                  setEditingData(item);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                themeColor={THEME_COLOR}
              />
              {filteredDataList.length > 0 && (
                <div className="mt-6">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchData(page, searchTerm)} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}