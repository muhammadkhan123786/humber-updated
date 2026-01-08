"use client";
import { useState, useEffect, useCallback } from "react";
import { GitCompare, Plus, Loader2 } from "lucide-react";

import Pagination from "@/components/ui/Pagination";
import { getAll, deleteItem } from "../../../../../helper/apiHelper";
import { ITicketStatusTransitions } from "../../../../../../../common/Ticket-management-system/ITicket.status.transition.interface";
import TicketTransitionForm from "./TicketTransitionForm";
import TicketTransitionTable from "./TicketTransitionTable";

const THEME_COLOR = "#FE6B1D";

export type PopulatedTransition = ITicketStatusTransitions<
  any,
  { _id: string; label: string; code: string },
  { _id: string; label: string; code: string },
  { _id: string; label: string; code: string },
  { _id: string; label: string; code: string }
> & { _id: string };

export default function TicketTransitionClient() {
  const [dataList, setDataList] = useState<PopulatedTransition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<PopulatedTransition | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(setSearchTerm);
  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);

      const res = await getAll<PopulatedTransition>(
        "/ticket-transition-setup",
        {
          page,
          limit: 10,
          search,
        }
      );
      setDataList(res.data);
      setTotalPages(Math.ceil(res.total / 10) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1, searchTerm);
  }, [searchTerm, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transition rule?")) return;
    try {
      await deleteItem("/ticket-transition-setup", id);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.log(error);
      alert("Failed to delete transition.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold flex items-center gap-3"
              style={{ color: THEME_COLOR }}
            >
              <GitCompare size={36} /> Status Transitions
            </h1>
            <p className="text-gray-500">
              Define how tickets move between statuses based on actions
            </p>
          </div>
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: THEME_COLOR }}
          >
            <Plus size={22} /> Add Transition
          </button>
        </div>

        {showForm && (
          <TicketTransitionForm
            editingData={editingData}
            onClose={() => setShowForm(false)}
            onRefresh={() => fetchData(currentPage, searchTerm)}
            themeColor={THEME_COLOR}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={48} color={THEME_COLOR} />
          </div>
        ) : (
          <>
            <TicketTransitionTable
              data={dataList}
              onEdit={(item) => {
                setEditingData(item);
                setShowForm(true);
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
