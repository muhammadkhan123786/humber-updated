"use client";

import { useState, useEffect } from "react";
import { Ruler, Plus, Search, Loader2 } from "lucide-react";
import SizeTable from "./SizeTable";
import SizeForm from "./SizeForm";
import Pagination from "@/components/ui/Pagination";
import { ISize } from "../../../../../../../common/ISize.interface";
import { fetchSizes, deleteSize } from "@/hooks/useSize";

const THEME_COLOR = "#FE6B1D";

export default function SizeClient() {
  const [dataList, setDataList] = useState<ISize[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<ISize | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetchSizes(page, 10, search);
      if (res?.data) {
        setDataList(res.data);
        setTotalPages(Math.ceil(res.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;
    try {
      await deleteSize(id);
      fetchData(currentPage, searchTerm);
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold flex items-center gap-3"
              style={{ color: THEME_COLOR }}
            >
              <Ruler size={36} /> Size Configuration
            </h1>
            <p className="text-gray-500 mt-1">Manage product sizing variants</p>
          </div>

          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95"
            style={{ backgroundColor: THEME_COLOR }}
          >
            <Plus size={22} /> Add Size
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sizes..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(showForm || editingData) && (
          <SizeForm
            editingData={editingData}
            onClose={() => {
              setShowForm(false);
              setEditingData(null);
            }}
            onRefresh={() => fetchData(currentPage, searchTerm)}
            themeColor={THEME_COLOR}
          />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Loader2
              className="animate-spin"
              style={{ color: THEME_COLOR }}
              size={48}
            />
            <p className="text-gray-400 font-medium">Loading sizes...</p>
          </div>
        ) : (
          <>
            <SizeTable
              data={dataList}
              onEdit={(item) => {
                setEditingData(item);
                setShowForm(false);
              }}
              onDelete={handleDelete}
              themeColor={THEME_COLOR}
            />
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchData(page, searchTerm)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
