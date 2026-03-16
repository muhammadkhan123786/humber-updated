"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, Loader2, LayoutGrid, Table2, Plus, Zap } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard";
import EventActionTable from "./EventActionTable";
import EventActionForm from "./EventActionForm";
import Pagination from "@/components/ui/Pagination";
import AnimatedIcon from "@/app/common-form/AnimatedIcon";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";

const THEME_COLOR = "var(--primary-gradient)";

export interface IEventActionData {
  _id: string;
  eventKey: string;
  name: string;
  description: string;
  module?: string;
  variables?: { key: string; description: string }[];
  isActive: boolean;
  isDefault: boolean;
  userId: string;
}

export default function EventActionClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<IEventActionData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [totalInactiveCount, setTotalInactiveCount] = useState(0);

  const { data, total, isLoading, deleteItem, updateItem } =
    useFormActions<IEventActionData>(
      "/event-action",
      "event-actions",
      "Event Action",
      currentPage,
      searchTerm,
    );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAll<IEventActionData>("/event-action", {
          limit: "1000",
          search: searchTerm.trim(),
        });
        setTotalActiveCount(res.data?.filter((d) => d.isActive).length || 0);
        setTotalInactiveCount(res.data?.filter((d) => !d.isActive).length || 0);
      } catch (err) {
        console.error("Stats Error:", err);
      }
    };
    fetchStats();
  }, [data, searchTerm]);

  const filteredDataList = useMemo(() => {
    if (filterStatus === "all") return data;
    return data.filter((d) =>
      filterStatus === "active" ? d.isActive : !d.isActive,
    );
  }, [filterStatus, data]);

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-2xl p-6 md:p-7 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <AnimatedIcon icon={<Zap size={32} className="text-white" />} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Event Actions</h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Manage your system event triggers and notifications
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 text-indigo-600 bg-white hover:bg-white/90 px-5 py-2 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            <Plus size={22} /> Add Event
          </button>
        </div>

        <StatsCards
          totalCount={total}
          activeCount={totalActiveCount}
          inactiveCount={totalInactiveCount}
          onFilterChange={(filter) => setFilterStatus(filter as any)}
          labels={{
            total: "Total Events",
            active: "Active Events",
            inactive: "Inactive",
          }}
          icons={{ total: <Zap size={24} /> }}
        />

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-300 transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by key, name or description..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#6366f1]! ">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Event List
              </h2>
              <p className="text-sm text-gray-500">
                Configure event behavior and active status
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

          {showForm && (
            <EventActionForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              themeColor={THEME_COLOR}
            />
          )}

          {isLoading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">
                Loading events...
              </p>
            </div>
          ) : (
            <>
              <EventActionTable
                data={filteredDataList}
                displayView={displayView}
                onEdit={(item: IEventActionData) => {
                  setEditingData(item);
                  setShowForm(true);
                }}
                onDelete={(id: string) => deleteItem(id)}
                onStatusChange={(id: string, status: boolean) =>
                  updateItem({ id, payload: { isActive: status } })
                }
              />
              {filteredDataList.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
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
