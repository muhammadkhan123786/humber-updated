"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Settings,
  Plus,
  Search,
  Loader2,
  LayoutGrid,
  Table2,
} from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard";
import PartTable from "./PartTable";
import PartForm from "./PartForm";
import Pagination from "@/components/ui/Pagination";
import AnimatedIcon from "@/app/common-form/AnimatedIcon";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";

const THEME_COLOR = "var(--primary-gradient)";

export default function PartClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [stats, setStats] = useState({ active: 0, inactive: 0 });

  const { data, total, isLoading, deleteItem, updateItem } =
    useFormActions<any>(
      "/mobility-parts",
      "parts",
      "Part",
      currentPage,
      searchTerm,
    );

  useEffect(() => {
    getAll<any>("/mobility-parts", {
      limit: "1000",
      search: searchTerm.trim(),
    }).then((res) => {
      setStats({
        active: res.data?.filter((d: any) => d.isActive).length || 0,
        inactive: res.data?.filter((d: any) => !d.isActive).length || 0,
      });
    });
  }, [data, searchTerm]);

  const filteredDataList = useMemo(() => {
    if (filterStatus === "all") return data;
    return data.filter((d: any) =>
      filterStatus === "active" ? d.isActive : !d.isActive,
    );
  }, [filterStatus, data]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6">
      <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-2xl p-6 md:p-7 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <AnimatedIcon icon={<Settings size={32} />} />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Spare Parts</h1>
            <p className="text-blue-100">Manage parts inventory and costs</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 text-blue-600 bg-white hover:bg-white/90 px-5 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all w-full md:w-auto"
        >
          <Plus size={22} /> Add Part
        </button>
      </div>

      <StatsCards
        totalCount={total}
        activeCount={stats.active}
        inactiveCount={stats.inactive}
        onFilterChange={setFilterStatus}
        labels={{
          total: "Total Parts",
          active: "Active",
          inactive: "Inactive",
        }}
        icons={{ total: <Settings size={24} /> }}
      />

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-300">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or number..."
          className="w-full outline-none text-lg"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]!">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Inventory List
            </h2>
            <p className="text-sm text-gray-500">
              Configure spare parts for maintenance and repairs
            </p>
          </div>

          <div className="flex gap-2 bg-linear-to-r from-blue-50 to-cyan-50 p-1 rounded-lg border border-blue-200 w-full md:w-auto">
            <button
              onClick={() => setDisplayView("card")}
              className={`flex-1 md:flex-none px-3 h-8 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                displayView === "card"
                  ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600 hover:bg-[#10b981]"
              }`}
            >
              <LayoutGrid size={16} /> <span className="text-sm">Grid</span>
            </button>
            <button
              onClick={() => setDisplayView("table")}
              className={`flex-1 md:flex-none px-3 h-8 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                displayView === "table"
                  ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600 hover:bg-[#10b981]"
              }`}
            >
              <Table2 size={16} /> <span className="text-sm">Table</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : (
          <>
            <PartTable
              data={filteredDataList}
              displayView={displayView}
              onEdit={(item) => {
                setEditingData(item);
                setShowForm(true);
              }}
              onDelete={deleteItem}
              onStatusChange={(id, s) =>
                updateItem({ id, payload: { isActive: s } })
              }
              themeColor={THEME_COLOR}
            />
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / 12) || 1}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {showForm && (
        <PartForm
          editingData={editingData}
          onClose={() => setShowForm(false)}
          themeColor={THEME_COLOR}
        />
      )}
    </div>
  );
}
