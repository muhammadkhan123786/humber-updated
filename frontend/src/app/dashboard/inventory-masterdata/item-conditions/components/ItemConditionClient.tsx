"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Search, Plus, ClipboardCheck, Loader2, LayoutGrid, LayoutList } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard";
import ItemConditionTable from "./ItemConditionTable";
import ItemConditionForm from "./ItemConditionForm";
import Pagination from "@/components/ui/Pagination";
import { IItemsConditions } from "../../../../../../../common/IItems.conditions.interface";

const THEME_COLOR = "var(--primary-gradient)";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/items-conditions`;

type ItemConditionWithId = IItemsConditions & { _id: string };

export default function ItemConditionClient() {
  const [dataList, setDataList] = useState<ItemConditionWithId[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<ItemConditionWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<ItemConditionWithId | null>(null);
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
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: savedUser.id || savedUser._id,
          search: search.trim(),
          page: page.toString(),
          limit: "10"
        }
      });
      
      setDataList(res.data.data || []);
      setFilteredDataList(res.data.data || []);
      setTotalPages(Math.ceil((res.data.total || 0) / 10) || 1);
      setCurrentPage(page);
      
      // Fetch ALL data without pagination to get accurate active/inactive counts
      const allDataRes = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: savedUser.id || savedUser._id,
          search: search.trim(),
          limit: "1000"
        }
      });
      
      // Track total counts across ALL data
      setTotalCount(res.data.total || 0);
      setTotalActiveCount(allDataRes.data.data?.filter((d: ItemConditionWithId) => d.isActive).length || 0);
      setTotalInactiveCount(allDataRes.data.data?.filter((d: ItemConditionWithId) => !d.isActive).length || 0);
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
      setFilteredDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter data based on status when filterStatus changes
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
    if (!confirm("Are you sure you want to delete this condition?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete item.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      
      await axios.put(`${API_URL}/${id}`, {
        isActive: newStatus,
        userId: user.id || user._id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state immediately
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Failed to update status.");
      // Revert the change by refreshing
      fetchData(currentPage, searchTerm);
    }
  };

  // Calculate stats for the component
  const totalConditions = totalCount;
  const activeConditions = totalActiveCount;
  const inactiveConditions = totalInactiveCount;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slideInLeft">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <ClipboardCheck size={32} className="text-white" />
            </div>
            <div className="flex-1 md:flex-none">
              <h1 className="text-3xl md:text-4xl font-bold">Item Conditions</h1>
              <p className="text-blue-100 text-sm md:text-lg">Manage conditions like New, Used or Refurbished</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            <Plus size={22} /> Add Condition
          </button>
        </div>

        {/* Reusable Stats Cards Component with Filter */}
        <StatsCards 
          totalCount={totalConditions}
          activeCount={activeConditions}
          inactiveCount={inactiveConditions}
          onFilterChange={(filter) => setFilterStatus(filter)}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search condition name..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Item Conditions
              </h2>
              <p className="text-sm text-gray-500">Configure item conditions for inventory management</p>
            </div>

            <div className="flex gap-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-1 w-full md:w-auto">
              <button
                onClick={() => setDisplayView("card")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  displayView === "card"
                    ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid size={16} />
                <span className="text-sm">Grid</span>
              </button>
              <button
                onClick={() => setDisplayView("table")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  displayView === "table"
                    ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutList size={16} />
                <span className="text-sm">Table</span>
              </button>
            </div>
          </div>

          {showForm && (
            <ItemConditionForm
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
              <p className="mt-4 text-gray-400 font-medium">Loading conditions...</p>
            </div>
          ) : (
            <>
              {/* Filter Status Display */}
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
              <ItemConditionTable
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