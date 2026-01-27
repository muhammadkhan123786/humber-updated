"use client";
import { useState, useEffect, useCallback } from "react";
import { Box, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
// Import common components
import StatsCards from "@/app/common-form/StatsCard"; 
import WareHouseTable from "./WareHouseTable";
import WareHouseForm from "./WareHouseStatusForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem, updateItem } from "@/helper/apiHelper";
import { IWarehouseStatus } from "../../../../../../../common/IWarehouse.status.interface";
import { handleOptimisticStatusUpdate } from "@/app/common-form/formUtils";
import AnimatedIcon from "@/app/common-form/AnimatedIcon";

const THEME_COLOR = "var(--primary-gradient)";

type WarehouseStatusWithId = IWarehouseStatus & { _id: string };

export default function WareHouseClient() {
  const [dataList, setDataList] = useState<WarehouseStatusWithId[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<WarehouseStatusWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<WarehouseStatusWithId | null>(null);
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
      const res = await getAll<WarehouseStatusWithId>("/warehouse-status", {
        page: page.toString(),
        limit: "12",
        search: search.trim(),
      });
      
      setDataList(res.data || []);
      setFilteredDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 12) || 1);
      setCurrentPage(page);
      
      // Fetch ALL data for accurate stats
      const allDataRes = await getAll<WarehouseStatusWithId>("/warehouse-status", {
        limit: "1000",
        search: search.trim(),
      });
      
      setTotalCount(res.total || 0);
      setTotalActiveCount(allDataRes.data?.filter((d) => d.isActive).length || 0);
      setTotalInactiveCount(allDataRes.data?.filter((d) => !d.isActive).length || 0);
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
      setFilteredDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter logic
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
    if (!confirm("Are you sure you want to delete this status?")) return;
    try {
      await deleteItem("/warehouse-status", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete item.");
    }
  };

 const handleStatusChange = (id: string, newStatus: boolean) => {
  // Same efficient pattern: Instant UI toggle, background sync.
  handleOptimisticStatusUpdate(
    id,
    newStatus,
    "/warehouse-status", 
    setDataList,
    setTotalActiveCount,
    setTotalInactiveCount,
    updateItem
  );
};

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header - Matching Business Type Gradient */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-2xl p-6 md:p-7 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slideInLeft">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <AnimatedIcon icon={<Box size={32} className="text-white" />} />
            <div className="flex-1 md:flex-none">
              <h1 className="text-3xl md:text-4xl font-bold">Warehouse Status</h1>
              <p className="text-blue-100 text-sm md:text-lg">Manage inventory status labels</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 text-blue-600 bg-white px-5 py-2 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            <Plus size={22} /> Add Status
          </button>
        </div>

        {/* Stats Cards */}
        <StatsCards 
          totalCount={totalCount}
          activeCount={totalActiveCount}
          inactiveCount={totalInactiveCount}
          onFilterChange={(filter) => setFilterStatus(filter)}
          labels={{
            total: "Total Warehouse Statuses",
            active: "Active Statuses",
            inactive: "Inactive Statuses"
          }}
          icons={{
            total: <Box size={24} />,
          }}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search warehouse status..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Status Records
              </h2>
              <p className="text-sm text-gray-500">Configure status levels for warehouse and inventory management</p>
            </div>

            {/* View Switcher */}
            <div className="flex gap-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-1 w-full md:w-auto">
              <button
                onClick={() => setDisplayView("card")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  displayView === "card"
                    ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 size={16} />
                <span className=" text-sm">Grid</span>
              </button>
              <button
                onClick={() => setDisplayView("table")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  displayView === "table"
                    ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={16} />
                <span className="text-sm">Table</span>
              </button>
            </div>
          </div>

          {showForm && (
            <WareHouseForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading statuses...</p>
            </div>
          ) : (
            <>
              {filterStatus !== 'all' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">
                    Showing {filterStatus === 'active' ? 'Active' : 'Inactive'} Statuses ({filteredDataList.length})
                  </span>
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
              
              <WareHouseTable
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