"use client";
import { useState, useEffect } from "react";
import { Ruler, Plus, Search, Loader2 } from "lucide-react";
import UnitsTable from "./UnitsTable";
import UnitsForm from "./UnitsForm";
import Pagination from "@/components/ui/Pagination";
import { IUnit } from "../../../../../../../common/IUnit.interface";
import { fetchUnits, deleteUnit } from "@/hooks/useUnits";

const THEME_COLOR = "#FE6B1D";

export default function UnitsClient() {
  const [dataList, setDataList] = useState<IUnit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetchUnits(page, 10, search);
      if (res?.data) {
        setDataList(res.data);
        setTotalPages(Math.ceil(res.total / 10) || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      console.log(err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold flex items-center gap-3"
              style={{ color: THEME_COLOR }}
            >
              <Ruler size={36} /> Unit Measurement
            </h1>
            <p className="text-gray-500 mt-1">
              Manage product units and scaling
            </p>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95"
            style={{ backgroundColor: THEME_COLOR }}
          >
            <Plus size={22} /> Add Unit
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search units..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(showForm || editingData) && (
          <UnitsForm
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
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-400 font-medium">Loading units...</p>
          </div>
        ) : (
          <>
            <UnitsTable
              data={dataList}
              onEdit={(item) => {
                setEditingData(item);
                setShowForm(false);
              }}
              onDelete={async (id) => {
                if (confirm("Delete unit?")) {
                  await deleteUnit(id);
                  fetchData(currentPage, searchTerm);
                }
              }}
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
