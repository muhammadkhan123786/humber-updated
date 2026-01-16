"use client";
import { useState, useEffect, useCallback } from "react";
import { Layers, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
// Import common components
import StatsCards from "@/app/common-form/StatsCard"; 
import SubServicesTable from "./SubServicesTable";
import SubServicesForm from "./SubServicesForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem } from "@/helper/apiHelper";
import { ISubServicesInterface } from "../../../../../../common/ISubServices.interface";

const THEME_COLOR = "var(--primary-gradient)";

// Type definition ensuring _id exists
type SubServiceWithId = ISubServicesInterface & { _id: string };

export default function SubServicesVehicleClient() {
  const [dataList, setDataList] = useState<SubServiceWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<SubServiceWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      // Using the same apiHelper pattern as BusinessType
      const res = await getAll<SubServiceWithId>("/sub-services", {
        page: page.toString(),
        limit: "10",
        search: search.trim(),
      });
      
      setDataList(res.data || []);
      setTotalPages(Math.ceil(res.total / 10) || 1);
      setCurrentPage(page);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-service?")) return;
    try {
      await deleteItem("/sub-services", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete sub-service.");
    }
  };

  // Calculate stats for the StatsCards component
  const totalCount = dataList.length;
  const activeCount = dataList.filter((d) => d.isActive).length;
  const inactiveCount = dataList.filter((d) => !d.isActive).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header - Gradient matching BusinessType style */}
        <div className="bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Layers size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Sub-Services</h1>
              <p className="text-orange-100 text-lg">Manage detailed services for master categories</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-orange-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> Add Sub-Service
          </button>
        </div>

        {/* Stats Section */}
        <StatsCards 
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-orange-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sub-service name..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-white p-5 pt-9 border-t-4! border-[#FE6B1D]! shadow-sm rounded-b-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Service Catalog
              </h2>
              <p className="text-sm text-gray-500">Configure pricing and notes for specific service offerings</p>
            </div>

            {/* View Switcher (Grid/Table) */}
            <div className="flex gap-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-1">
              <button
                onClick={() => setDisplayView("card")}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  displayView === "card"
                    ? "bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 size={16} />
                <span className="hidden sm:inline text-sm">Grid</span>
              </button>
              <button
                onClick={() => setDisplayView("table")}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  displayView === "table"
                    ? "bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={16} />
                <span className="hidden sm:inline text-sm">Table</span>
              </button>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <SubServicesForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor="#FE6B1D"
              apiUrl="/sub-services"
            />
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-orange-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading sub-services...</p>
            </div>
          ) : (
            <>
              <SubServicesTable
                data={dataList}
                displayView={displayView}
                onEdit={(item) => {
                  setEditingData(item);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                themeColor="#FE6B1D"
              />
              
              {/* Pagination */}
              {dataList.length > 0 && (
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