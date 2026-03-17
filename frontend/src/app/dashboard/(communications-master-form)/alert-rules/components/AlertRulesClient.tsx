"use client";
import { useState } from "react";
import { Plus, Settings, Bell, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AlertRuleForm } from "./AlertRuleForm";
import { AlertRuleTable } from "./AlertRuleTable";

const exampleRules = [
  "Alert when spare parts < 5 units",
  "Alert when repair exceeds SLA (48 hours)",
  "Alert when warranty expires in 30 days",
  "Alert on high priority job creation",
  "Alert when job awaiting parts > 24 hours",
];

const configuredRules = [
  {
    id: "E-1",
    name: "Low Stock Alert - Critical",
    module: {
      name: "Inventory",
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    trigger: "Stock Level Below Threshold",
    threshold: "5 units",
    role: "Warehouse Manager",
    channels: ["Email", "SMS"],
    status: "Active",
  },
  {
    id: "E-2",
    name: "Repair SLA Breach",
    module: {
      name: "Repair",
      color: "bg-orange-50 text-orange-700 border-orange-100",
    },
    trigger: "Job Duration Exceeds SLA",
    threshold: "48 hours",
    role: "Service Manager",
    channels: ["Email", "WhatsApp"],
    status: "Active",
  },
  {
    id: "E-3",
    name: "Warranty Expiry Reminder",
    module: {
      name: "Service",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    trigger: "Warranty Expires Within",
    threshold: "30 days",
    role: "Customer Service",
    channels: ["Email"],
    status: "Active",
  },
];

export default function AlertRulesClient() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className=" mx-auto p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Alert Rules Configuration
          </h1>
          <p className="text-gray-800 ">
            Configure and manage alert triggers and conditions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold bg-linear-to-r from-purple-500 to-red-500 text-white shadow-lg active:scale-95 transition-all"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Create New Rule"}
        </button>
      </div>

      <div className=" rounded-4xl border border-slate-100  shadow-2xl shadow-slate-100/50">
        <AnimatePresence>
          {showForm && (
            <AlertRuleForm
              onCancel={() => setShowForm(false)}
              modules={["Repair", "Inventory", "Service"]}
              channels={["Email", "SMS", "WhatsApp"]}
            />
          )}
        </AnimatePresence>

        <div className="space-y-6 bg-linear-to-br from-white to-purple-50 rounded-2xl border border-slate-200 p-6 md:p-7 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Settings size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Example Alert Rules
            </h2>
          </div>
          <div className="grid gap-3 ">
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
      </div>

      <AlertRuleTable data={configuredRules} />
    </div>
  );
}
