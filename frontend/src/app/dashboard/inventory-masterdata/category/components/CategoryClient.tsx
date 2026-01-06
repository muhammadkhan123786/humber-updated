"use client";
import { useState, useEffect } from "react";
import { Layers, Plus, Search, Loader2 } from "lucide-react";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import Pagination from "@/components/ui/Pagination";
import { ICategory } from "../../../../../../../common/ICategory.interface";
import { fetchCategories, deleteCategory } from "@/hooks/useCategory";
const THEME_COLOR = "#FE6B1D";

export default function CategoryClient() {
  const [dataList, setDataList] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });

  const loadData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetchCategories(page, 10, search);

      if (res && res.data) {
        setDataList(res.data);
        setPagination({
          current: page,
          total: Math.ceil(res.total / 10) || 1,
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      loadData(pagination.current, searchTerm);
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
              <Layers size={36} /> Categories
            </h1>
            <p className="text-gray-500 mt-1">
              Manage parent and nested categories
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
            <Plus size={22} /> Add Category
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showForm && (
          <CategoryForm
            editingData={editingData}
            allCategories={dataList}
            onClose={() => {
              setShowForm(false);
              setEditingData(null);
            }}
            onRefresh={() => loadData(pagination.current, searchTerm)}
            themeColor={THEME_COLOR}
          />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <p className="text-gray-400 font-medium">Loading categories...</p>
          </div>
        ) : (
          <>
            <CategoryTable
              data={dataList}
              onEdit={(item: ICategory) => {
                setEditingData(item);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              themeColor={THEME_COLOR}
            />
            <div className="mt-6">
              <Pagination
                currentPage={pagination.current}
                totalPages={pagination.total}
                onPageChange={(p) => loadData(p, searchTerm)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
