"use client";

import { useState, useEffect, useCallback } from "react";
import { Image as IconLib, Plus, Search, Loader2, Grid3x3, List } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard"; 
import IconsTable from "./IconsTable";
import IconsForm from "./IconsForm";
import Pagination from "@/components/ui/Pagination";
import { IIcons } from "../../../../../../common/master-interfaces/IIcons.interface";
import { fetchIcons, deleteIcon } from "@/hooks/useIcons"; // Adjust path

const THEME_COLOR = "#2563EB"; // Blue Theme

export default function IconsClient() {
  const [dataList, setDataList] = useState<IIcons[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IIcons | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetchIcons(page, 10, search);
      if (res?.data) {
        setDataList(res.data);
        setTotalPages(Math.ceil(res.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteIcon(id);
      fetchData(currentPage, searchTerm);
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <IconLib size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Icon Gallery</h1>
              <p className="opacity-80">Upload and manage system icons</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingData(null); setShowForm(true); }}
            className="flex items-center gap-2 text-blue-700 bg-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={22} /> Add Icon
          </button>
        </div>

        <StatsCards 
          totalCount={dataList.length}
          activeCount={dataList.filter(d => d.isActive).length}
          inactiveCount={dataList.filter(d => !d.isActive).length}
        />

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search icons..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4 border-blue-600 rounded-b-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Icons</h2>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setDisplayView("card")} className={`p-2 rounded-lg ${displayView === "card" ? "bg-blue-600 text-white" : "text-gray-500"}`}><Grid3x3 size={20}/></button>
              <button onClick={() => setDisplayView("table")} className={`p-2 rounded-lg ${displayView === "table" ? "bg-blue-600 text-white" : "text-gray-500"}`}><List size={20}/></button>
            </div>
          </div>

          {(showForm || editingData) && (
            <IconsForm
              editingData={editingData}
              onClose={() => { setShowForm(false); setEditingData(null); }}
              onRefresh={() => fetchData(currentPage, searchTerm)}
              themeColor={THEME_COLOR}
            />
          )}

          {loading ? (
             <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
          ) : (
            <>
              <IconsTable
                data={dataList}
                displayView={displayView}
                onEdit={setEditingData}
                onDelete={handleDelete}
                themeColor={THEME_COLOR}
              />
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={fetchData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}