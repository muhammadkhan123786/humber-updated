"use client";
import { useState, useEffect, useCallback } from "react";
import { Briefcase, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
// Import common components
import StatsCards from "@/app/common-form/StatsCard"; 
import BussinessTypeTable from "./BussinessTypeTable";
import BussinessTypeForm from "./BussinessTypeForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem } from "@/helper/apiHelper";
import { IBusinessTypes } from "../../../../../../common/suppliers/IBusiness.types.interface";

const THEME_COLOR = "var(--primary-gradient)";

type BusinessTypeWithId = IBusinessTypes & { _id: string };

export default function BussinessTypeClient() {
  const [dataList, setDataList] = useState<BusinessTypeWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<BusinessTypeWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await getAll<BusinessTypeWithId>("/business-types", {
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
    if (!confirm("Are you sure you want to delete this business type?")) return;
    try {
      await deleteItem("/business-types", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete item.");
    }
  };

  // Calculate stats for the component
  const totalTypes = dataList.length;
  const activeTypes = dataList.filter((d) => d.isActive).length;
  const inactiveTypes = dataList.filter((d) => !d.isActive).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center animate-slideInLeft">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Briefcase size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Business Types</h1>
              <p className="text-blue-100 text-lg">Manage customer type categories</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-blue-600 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> Add Business Type
          </button>
        </div>

        {/* Reusable Stats Cards Component */}
        <StatsCards 
          totalCount={totalTypes}
          activeCount={activeTypes}
          inactiveCount={inactiveTypes}
        />

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search business type name..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! ">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Business Type Categories
              </h2>
              <p className="text-sm text-gray-500">Configure business type categories for registration and ticketing</p>
            </div>

            <div className="flex gap-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-1">
              <button
                onClick={() => setDisplayView("card")}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  displayView === "card"
                    ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
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
                    ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={16} />
                <span className="hidden sm:inline text-sm">Table</span>
              </button>
            </div>
          </div>

          {showForm && (
            <BussinessTypeForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading types...</p>
            </div>
          ) : (
            <>
              <BussinessTypeTable
                data={dataList}
                displayView={displayView}
                onEdit={(item) => {
                  setEditingData(item);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                themeColor={THEME_COLOR}
              />
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