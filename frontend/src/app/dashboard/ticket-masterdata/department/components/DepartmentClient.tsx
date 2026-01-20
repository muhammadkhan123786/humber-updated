"use client";
import { useState, useEffect, useCallback } from "react";
import { Building2, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard"; 
import DepartmentTable from "./DepartmentTable";
import DepartmentForm from "./DepartmentForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem, updateItem } from "@/helper/apiHelper";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

const THEME_COLOR = "var(--primary-gradient)";
const API_URL = "/departments";

type DepartmentWithId = IDepartments & { _id: string };

export default function DepartmentClient() {
  const [dataList, setDataList] = useState<DepartmentWithId[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<DepartmentWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<DepartmentWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      
      const res = await getAll<DepartmentWithId>(API_URL, {
        page: page.toString(),
        limit: "10",
        search: search.trim(),
        userId: user.id || user._id,
      });

      setDataList(res.data || []);
      setFilteredDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 10) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
      setFilteredDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter data based on status when filterStatus changes (Updated to match BusinessType logic)
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredDataList(dataList);
    } else if (filterStatus === 'active') {
      setFilteredDataList(dataList.filter((d) => d.isActive));
    } else if (filterStatus === 'inactive') {
      setFilteredDataList(dataList.filter((d) => !d.isActive));
    }
  }, [filterStatus, dataList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1, searchTerm);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteItem(API_URL, id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete department.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      await updateItem(API_URL, id, {
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

  const totalCount = dataList.length;
  const activeCount = dataList.filter((d) => d.isActive).length;
  const inactiveCount = dataList.filter((d) => !d.isActive).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Departments</h1>
              <p className="text-blue-100 text-lg">Organize your team into functional units</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingData(null); setShowForm(true); }}
            className="flex items-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> Add Department
          </button>
        </div>

        {/* Reusable Stats Cards Component with Filter */}
        <StatsCards 
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          onFilterChange={(filter) => setFilterStatus(filter)}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search department name..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! ">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Department Management
              </h2>
              <p className="text-sm text-gray-500">Configure departments for ticketing and internal workflow</p>
            </div>

            <div className="flex gap-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-1">
              <button 
                onClick={() => setDisplayView("card")} 
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "card" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900"}`}
              >
                <Grid3x3 size={16} /> <span className="hidden sm:inline text-sm">Grid</span>
              </button>
              <button 
                onClick={() => setDisplayView("table")} 
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "table" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900"}`}
              >
                <List size={16} /> <span className="hidden sm:inline text-sm">Table</span>
              </button>
            </div>
          </div>

          {showForm && (
            <DepartmentForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
              apiUrl={API_URL}
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading departments...</p>
            </div>
          ) : (
            <>
              {/* Filter Status Display (Newly added to match BusinessTypeClient) */}
              {filterStatus !== 'all' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">
                    Showing {filterStatus === 'active' ? 'Active' : 'Inactive'} Items ({filteredDataList.length})
                  </span>
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              <DepartmentTable
                data={filteredDataList}
                displayView={displayView}
                onEdit={(item: any) => { setEditingData(item); setShowForm(true); }}
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