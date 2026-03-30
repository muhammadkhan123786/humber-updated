"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Settings, Bell, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { getAll, deleteItem } from "@/helper/apiHelper";
import { AlertRuleForm } from "./AlertRuleForm";
import { AlertRuleTable } from "./AlertRuleTable";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";

const exampleRules = [
  "Alert when spare parts < 5 units",
  "Alert when repair exceeds SLA (48 hours)",
  "Alert when warranty expires in 30 days",
  "Alert on high priority job creation",
  "Alert when job awaiting parts > 24 hours",
];

export default function AlertRulesClient() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRules, setTotalRules] = useState(0);

  const PAGE_LIMIT = 10;

  const fetchData = useCallback(async () => {
    try {
      const [c, t, e, r] = await Promise.all([
        getAll<any>("/channels?filter=all", { requiredUserId: "false" }),
        getAll<any>("/notification-templates?filter=all"),
        getAll<any>("/event-action?filter=all", { requiredUserId: "false" }),
        getAll<any>(
          `/notification-rules?page=${currentPage}&limit=${PAGE_LIMIT}`,
        ),
      ]);

      setChannels(c.data || []);
      setTemplates(t.data || []);
      setEvents(e.data || []);
      setRules(r.data || []);
      setTotalRules(r.total || r.data.length || 0);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load configuration data");
    }
  }, [currentPage]);
  useEffect(() => {
    const fetchWrapper = async () => {
      await fetchData();
    };
    fetchWrapper();
  }, [fetchData]);
  const handleEdit = (rule: any) => {
    setEditData(rule);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      try {
        await deleteItem("/notification-rules", id);
        toast.success("Rule deleted successfully");
        fetchData();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete rule");
      }
    }
  };

  const totalPages = Math.ceil(totalRules / PAGE_LIMIT) || 1;

  return (
    <div className="mx-auto p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Alert Rules Configuration
          </h1>
          <p className="text-gray-800">
            Configure and manage alert triggers and conditions
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditData(null);
          }}
          className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold bg-linear-to-r from-purple-500 to-red-500 text-white shadow-lg active:scale-95 transition-all"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Create New Rule"}
        </button>
      </div>

      <div className="rounded-4xl border border-slate-100 shadow-2xl shadow-slate-100/50">
        <AnimatePresence mode="wait">
          {showForm && (
            <AlertRuleForm
              editData={editData}
              onCancel={() => {
                setShowForm(false);
                setEditData(null);
              }}
              channels={channels}
              templates={templates}
              events={events}
              refresh={fetchData}
            />
          )}
        </AnimatePresence>

        {!showForm && (
          <div className="space-y-6 bg-linear-to-br from-white to-purple-50 rounded-2xl border border-slate-200 p-6 md:p-7 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Settings size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Example Alert Rules
              </h2>
            </div>
            <div className="grid gap-3">
              {exampleRules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all"
                >
                  <Bell size={16} className="text-purple-600" />
                  <p className="text-slate-700 font-medium text-sm flex-1">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertRuleTable
        data={rules}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalRules > PAGE_LIMIT && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
