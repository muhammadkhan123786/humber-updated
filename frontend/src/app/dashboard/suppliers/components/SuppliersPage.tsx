"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Building2,
  Search,
  Edit2,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import SupplierForm from "./SupplierForm";

const dummySuppliers = [
  {
    id: "SUP-001",
    name: "MobilityParts UK Ltd",
    contact: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 20 1234 5678",
    location: "London, UK",
    status: "active",
  },
  {
    id: "SUP-002",
    name: "Electric Mobility Solutions",
    contact: "Emma Williams",
    email: "emma.w@email.com",
    phone: "+44 161 234 5678",
    location: "Manchester, UK",
    status: "active",
  },
];

const SuppliersPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (supplier: any) => {
    setEditData(supplier);
    setView("form");
  };

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc]">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-linear-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                  <Building2 size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Suppliers
                  </h1>
                  <p className="opacity-80">Manage your supplier database</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditData(null);
                  setView("form");
                }}
                className="bg-white text-[#a855f7] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <Plus size={20} /> Add Supplier
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0ea5e9] p-6 rounded-[2rem] text-white shadow-xl flex justify-between items-center relative overflow-hidden group">
                <div>
                  <p className="text-sm font-medium opacity-80">
                    Total Suppliers
                  </p>
                  <h2 className="text-5xl font-bold mt-1 tracking-tighter">
                    2
                  </h2>
                </div>
                <Building2
                  size={48}
                  className="opacity-20 group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="bg-[#10b981] p-6 rounded-[2rem] text-white shadow-xl flex justify-between items-center relative overflow-hidden group">
                <div>
                  <p className="text-sm font-medium opacity-80">Active</p>
                  <h2 className="text-5xl font-bold mt-1 tracking-tighter">
                    2
                  </h2>
                </div>
                <CheckCircle2
                  size={48}
                  className="opacity-20 group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="bg-[#f59e0b] p-6 rounded-[2rem] text-white shadow-xl flex justify-between items-center relative overflow-hidden group">
                <div>
                  <p className="text-sm font-medium opacity-80">Inactive</p>
                  <h2 className="text-5xl font-bold mt-1 tracking-tighter">
                    0
                  </h2>
                </div>
                <AlertCircle
                  size={48}
                  className="opacity-20 group-hover:scale-110 transition-transform"
                />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="relative mb-6">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] px-4">
                      <th className="pb-4 pl-6">Supplier ID</th>
                      <th className="pb-4">Business Name</th>
                      <th className="pb-4">Contact</th>
                      <th className="pb-4 text-center">Status</th>
                      <th className="pb-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummySuppliers.map((sup) => (
                      <tr
                        key={sup.id}
                        className="bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                      >
                        <td className="py-5 pl-6 rounded-l-3xl font-bold text-slate-700">
                          {sup.id}
                        </td>
                        <td className="py-5">
                          <div className="font-bold text-indigo-600">
                            {sup.name}
                          </div>
                          <span className="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded font-black uppercase">
                            Ltd
                          </span>
                        </td>
                        <td className="py-5">
                          <div className="text-sm font-medium text-slate-700">
                            {sup.contact}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail size={12} />
                            {sup.email}
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                            active
                          </span>
                        </td>
                        <td className="py-5 pr-6 rounded-r-3xl text-right">
                          <button
                            onClick={() => handleEdit(sup)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full"
          >
            <SupplierForm editData={editData} onBack={() => setView("list")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuppliersPage;
