"use client";
import { useState, useEffect, useCallback } from "react";
import { Handshake, Plus, Search, Loader2 } from "lucide-react";
import PricingAgreementTable from "./PricingAgreementTable";
import PricingAgreementForm from "./PricingAgreementForm";
import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem } from "@/helper/apiHelper";
import { IPricingAgreement } from "../../../../../../common/suppliers/IPricing.agreement.interface";

const THEME_COLOR = "var(--primary-gradient)";

type PricingAgreementWithId = IPricingAgreement & { _id: string };

export default function PricingAgreementClient() {
  const [dataList, setDataList] = useState<PricingAgreementWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<PricingAgreementWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await getAll<PricingAgreementWithId>("/pricing-agreement", {
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
    if (!confirm("Are you sure you want to delete this pricing agreement?")) return;
    try {
      await deleteItem("/pricing-agreement", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
           <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <Handshake size={36} style={{ color: "var(--primary-solid)" }} />
              <span style={{ 
                background: "var(--primary-gradient)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent" 
              }}>
                Pricing Agreements
              </span>
            </h1>
            <p className="text-gray-500">
              Manage contract pricing terms with your suppliers
            </p>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
            style={{ background: THEME_COLOR }}
          >
            <Plus size={22} /> Add Agreement
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search pricing agreements..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showForm && (
          <PricingAgreementForm
            editingData={editingData}
            onClose={() => setShowForm(false)}
            onRefresh={() => fetchData(currentPage, searchTerm)}
            themeColor={THEME_COLOR}
          />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="animate-spin" style={{ color: THEME_COLOR }} size={48} />
            <p className="mt-4 text-gray-400 font-medium">Loading agreements...</p>
          </div>
        ) : (
          <>
            <PricingAgreementTable
              data={dataList}
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
  );
}