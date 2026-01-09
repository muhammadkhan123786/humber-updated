"use client";
import { useState, useEffect } from "react";
import { Truck, Plus, Search, Loader2 } from "lucide-react";
import VenderTable from "./VenderTable";
import VenderForm from "./VenderForm";
import Pagination from "@/components/ui/Pagination";
import { fetchVenders, deleteVender } from "@/hooks/useVender";
import { VenderDto } from "../../../../../../common/DTOs/vender.dto";

const THEME_COLOR = "#FE6B1D";

export default function VenderClient() {
  const [dataList, setDataList] = useState<(VenderDto & { _id: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<
    (VenderDto & { _id: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res: any = await fetchVenders(page, 10, search);
      const data: any[] = res.data || [];
      const total: number = res.total || 0;

      setDataList(data);
      setTotalPages(Math.ceil(total / 10) || 1);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Fetch Error:", err); // TypeScript error ignored
      setDataList([]); // fallback empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteVender(id);
      fetchData(currentPage, searchTerm);
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (item: VenderDto & { _id: string }) => {
    setEditingData(item);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold flex items-center gap-3"
              style={{ color: THEME_COLOR }}
            >
              <Truck size={36} /> Vendor Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage suppliers, vendors and their financial profiles
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
            <Plus size={22} /> Add Vendor
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by business name or contact..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(showForm || editingData) && (
          <VenderForm
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
            <p className="text-gray-400 font-medium">Fetching vendors...</p>
          </div>
        ) : (
          <>
            <VenderTable
              data={dataList}
              onEdit={handleEdit}
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
