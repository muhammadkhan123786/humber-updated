"use client";
import { useState, useMemo, useEffect } from "react";
import { Clock, Plus, Search, Loader2, LayoutGrid, Table2 } from "lucide-react";
import StatsCards from "@/app/common-form/StatsCard";
import AvailabilityTable from "./AvailabilityTable";
import AvailabilityForm from "./AvailabilityForm";
import Pagination from "@/components/ui/Pagination";
import { IAvailability } from "../../../../../../common/IAvailibility.interface";
import AnimatedIcon from "@/app/common-form/AnimatedIcon";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";

const THEME_COLOR = "var(--primary-gradient)";
type AvailabilityWithId = IAvailability & { _id: string };

export default function AvailabilityClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<AvailabilityWithId | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "card">("table");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [totalInactiveCount, setTotalInactiveCount] = useState(0);

  const { data, total, isLoading, deleteItem, updateItem } =
    useFormActions<AvailabilityWithId>(
      "/availability",
      "availability",
      "Availability",
      currentPage,
      searchTerm,
    );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allDataRes = await getAll<AvailabilityWithId>("/availability", {
          limit: "1000",
          search: searchTerm.trim(),
        });
        setTotalActiveCount(
          allDataRes.data?.filter((d) => d.isActive).length || 0,
        );
        setTotalInactiveCount(
          allDataRes.data?.filter((d) => !d.isActive).length || 0,
        );
      } catch (err) {
        console.error("Stats Fetch Error:", err);
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

  const handleDelete = (id: string) => deleteItem(id);

  const handleStatusChange = (id: string, newStatus: boolean) => {
    updateItem({ id, payload: { isActive: newStatus } });
  };

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-2xl p-6 md:p-7 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <AnimatedIcon icon={<Clock size={32} className="text-white" />} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Availability</h1>
              <p className="text-blue-100 text-sm md:text-lg">
                Manage time slots and shifts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 text-blue-600 bg-white hover:bg-white/90 px-5 py-2 rounded-lg text-sm h-9 font-semibold shadow-lg transition-all w-full md:w-auto"
          >
            <Plus size={22} /> Add Availability
          </button>
        </div>

        <StatsCards
          totalCount={total}
          activeCount={totalActiveCount}
          inactiveCount={totalInactiveCount}
          onFilterChange={(filter) => setFilterStatus(filter)}
          labels={{
            total: "Total Slots",
            active: "Active Slots",
            inactive: "Inactive Slots",
          }}
          icons={{ total: <Clock size={24} /> }}
        />

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search availability name..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="bg-white p-5 pt-9 border-t-4! border-[#2B7FFF]! ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Time Schedules
              </h2>
              <p className="text-sm text-gray-500">
                Configure operational timings for services
              </p>
            </div>

            <div className="flex gap-2 bg-linear-to-r from-blue-50 to-cyan-50 p-1 rounded-lg border border-blue-200 w-full md:w-auto">
              <button
                onClick={() => setDisplayView("card")}
                className={`flex-1 md:flex-none px-3 h-8 rounded-lg font-bold flex items-center justify-center gap-2 ${displayView === "card" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600"}`}
              >
                <LayoutGrid size={16} /> <span className="text-sm">Grid</span>
              </button>
              <button
                onClick={() => setDisplayView("table")}
                className={`flex-1 md:flex-none px-3 h-8 rounded-lg font-bold flex items-center justify-center gap-2 ${displayView === "table" ? "bg-linear-to-r from-blue-500 to-teal-600 text-white shadow-lg" : "text-gray-600"}`}
              >
                <Table2 size={16} /> <span className="text-sm">Table</span>
              </button>
            </div>
          </div>

          {showForm && (
            <AvailabilityForm
              editingData={editingData}
              onClose={() => setShowForm(false)}
              themeColor={THEME_COLOR}
            />
          )}

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-gray-400">Loading schedules...</p>
            </div>
          ) : (
            <>
              <AvailabilityTable
                data={filteredDataList}
                displayView={displayView}
                onEdit={(item) => {
                  setEditingData(item);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                themeColor={THEME_COLOR}
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
