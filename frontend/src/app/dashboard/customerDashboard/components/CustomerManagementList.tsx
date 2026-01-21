"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  Search,
  LayoutGrid,
  List,
  SquarePen,
  Trash2,
  User,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  Check,
  Loader2,
} from "lucide-react";

import { fetchCustomers, removeCustomer } from "../../../../hooks/useCustomer";
import CustomerCard from "./CustomerCard";

type ViewMode = "Grid" | "Table";

// 1. Props interface define karein
interface CustomerManagementListProps {
  onEdit: (id: string) => void;
  refreshTrigger?: number;
}

const CustomerManagementList = ({
  onEdit,
  refreshTrigger,
}: CustomerManagementListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("Grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustomers(1, 50, searchTerm);
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCustomers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [loadCustomers, refreshTrigger]);

  // 2. handleEdit ab parent function call karega
  const handleEdit = (id: string) => {
    onEdit(id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    setIsDeleting(id);
    try {
      const response = await removeCustomer(id);
      if (response.success) {
        setCustomers((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(response.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getTypeStyles = (type: string) => {
    const t = type?.toLowerCase();
    if (t === "corporate" || t === "company") return "bg-[#E11DBC] text-white";
    if (t === "government") return "bg-[#00C853] text-white";
    return "bg-[#00A3FF] text-white";
  };

  const getTypeIcon = (type: string) => {
    const t = type?.toLowerCase();
    if (t === "corporate" || t === "company") return <Building2 size={14} />;
    if (t === "government") return <ShieldCheck size={14} />;
    return <User size={14} />;
  };

  return (
    <div className="space-y-8 mt-10 px-4 md:px-0">
      {/* Search and Toggle UI (Same as before) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-3/4">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border border-slate-100 rounded-[1.2rem] outline-none focus:ring-4 ring-indigo-500/5 font-medium text-slate-500 shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setViewMode("Grid")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              viewMode === "Grid"
                ? "bg-[#7C3AED] text-white shadow-lg"
                : "text-slate-500"
            }`}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode("Table")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              viewMode === "Table"
                ? "bg-[#7C3AED] text-white shadow-lg"
                : "text-slate-500"
            }`}
          >
            <List size={16} /> Table
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : (
        <>
          {viewMode === "Grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customers.map((c) => (
                <CustomerCard
                  key={c._id}
                  id={c._id.slice(-5).toUpperCase()}
                  name={
                    c.customerType === "corporate"
                      ? c.companyName
                      : c.personId?.firstName
                  }
                  type={
                    c.customerType === "corporate" ? "Company" : "Individual"
                  }
                  email={c.contactId?.emailId}
                  phone={c.contactId?.mobileNumber}
                  address={c.addressId?.address}
                  status="Active"
                  registeredDate={new Date(c.createdAt).toLocaleDateString()}
                  onEdit={() => handleEdit(c._id)} // Grid Edit Trigger
                  onDelete={() => handleDelete(c._id)}
                />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-4xl shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
              <div className="h-1.5 w-full bg-linear-to-r from-[#4F46E5] via-[#E11DBC] to-[#FB7185]" />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100">
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Name
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Type
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Contact
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Address
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {customers.map((c) => (
                      <tr
                        key={c._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-5 font-bold text-indigo-500 text-[10px] uppercase">
                          {c._id.slice(-5)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
                              {(c.customerType === "corporate"
                                ? c.companyName[0]
                                : c.personId?.firstName[0]
                              )?.toUpperCase()}
                            </div>
                            <span className="text-sm font-extrabold text-slate-700 uppercase">
                              {c.customerType === "corporate"
                                ? c.companyName
                                : c.personId?.firstName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 w-fit uppercase ${getTypeStyles(c.customerType)}`}
                          >
                            {getTypeIcon(c.customerType)} {c.customerType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[11px] font-bold text-slate-500">
                            <div className="flex items-center gap-1">
                              <Mail size={12} className="text-blue-400" />{" "}
                              {c.contactId?.emailId}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone size={12} className="text-pink-400" />{" "}
                              {c.contactId?.mobileNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-slate-500">
                          <span className="truncate block max-w-[150px]">
                            {c.addressId?.address}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1.5 text-white ${c.isActive ? "bg-[#00D169]" : "bg-slate-300"}`}
                          >
                            <Check size={12} strokeWidth={4} />{" "}
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(c._id)} // Table Edit Trigger
                              className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                              <SquarePen size={16} />
                            </button>
                            <button
                              disabled={isDeleting === c._id}
                              onClick={() => handleDelete(c._id)}
                              className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                              {isDeleting === c._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerManagementList;
