"use client";
import { useState, useEffect, useCallback } from "react";
import { Map, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import ServiceZoneTable from "./ServiceZoneTable";
import ServiceZoneForm from "./ServicesZoneForm";
import Pagination from "./Pagination"; 
import StatsCards from "@/app/common-form/StatsCard";
import { IServicesZones } from "../../../../../../common/service.zones.interface"; // Adjust path as needed
import { updateItem, getAll, deleteItem } from "@/helper/apiHelper";
import { handleOptimisticStatusUpdate } from "@/app/common-form/formUtils";

const THEME_COLOR = "var(--primary-gradient)";
const API_URL = "/services-zones";

export default function ServiceZoneClient() {
  const [dataList, setDataList] = useState<IServicesZones[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<IServicesZones[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IServicesZones | null>(null);
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
      const res = await getAll<IServicesZones>("/services-zones", {
        page: page.toString(),
        limit: "12",
        search: search.trim(),
      });
      setDataList(res.data || []);
      setFilteredDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 12) || 1);
      setCurrentPage(page);

      // Fetch ALL data without pagination to get accurate active/inactive counts
      const allDataRes = await getAll<IServicesZones>("/services-zones", {
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

  // Reactive Stats Filtering
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

const handleStatusChange = (id: string, newStatus: boolean) => {
  // Generic function call jo status update ko smooth aur flicker-free banaye ga
  handleOptimisticStatusUpdate(
    id,
    newStatus,
    API_URL, // Aapka constant API endpoint
    setDataList,
    setTotalActiveCount,
    setTotalInactiveCount,
    updateItem
  );
};

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;
    try {
      await deleteItem(API_URL, id);
      fetchData(currentPage, searchTerm);
    } catch (err) { alert("Delete failed"); }
  };

  const statsTotal = totalCount;
  const statsActive = totalActiveCount;
  const statsInactive = totalInactiveCount;

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Map size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Service Zones</h1>
              <p className="text-orange-50 text-lg">Manage geographical areas where your services are available</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingData(null); setShowForm(true); }}
            className="flex items-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> Add Zone
          </button>
        </div>

        {/* Stats Cards with filter trigger */}
        <StatsCards 
            totalCount={statsTotal} 
            activeCount={statsActive} 
            inactiveCount={statsInactive} 
            onFilterChange={(f) => setFilterStatus(f)}
            labels={{
              total: "Total Zones",
              active: "Active Zones",
              inactive: "Inactive Zones"
            }}
            icons={{
              total: <Map size={24} />,
            }}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-orange-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input type="text" placeholder="Search zone name..." className="w-full outline-none text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! rounded-b-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Zone Categories
              </h2>
              <p className="text-sm text-gray-500 font-medium">Configure operational territories and defaults</p>
            </div>

            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
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

          {(showForm || editingData) && (
            <ServiceZoneForm 
                editingData={editingData} 
                onClose={() => { setShowForm(false); setEditingData(null); }} 
                onRefresh={() => fetchData(currentPage, searchTerm)} 
                themeColor={THEME_COLOR} 
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-orange-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading zones...</p>
            </div>
          ) : (
            <>
              {filterStatus !== 'all' && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-orange-700 font-bold uppercase">
                    {filterStatus} Zones ({filteredDataList.length})
                  </span>
                  <button onClick={() => setFilterStatus('all')} className="text-xs text-orange-600 hover:underline font-bold">Clear</button>
                </div>
              )}
              <ServiceZoneTable 
                data={filteredDataList} 
                displayView={displayView} 
                onEdit={(item) => { setEditingData(item); setShowForm(true); }} 
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