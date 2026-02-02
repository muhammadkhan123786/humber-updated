"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  Search,
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
  MapPin,
  Calendar,
  Grid3X3,
} from "lucide-react";

import { fetchCustomers, removeCustomer } from "../../../../hooks/useCustomer";
import CustomerCard from "./CustomerCard";
import Pagination from "@/components/ui/Pagination";

type ViewMode = "Grid" | "Table";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadCustomers = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await fetchCustomers(page, 10, searchTerm);
        if (response.success) {
          setCustomers(response.data);
          const totalItems = response.total || 0;
          const limitPerPage = response.limit || 10;
          const calculatedTotalPages = Math.ceil(totalItems / limitPerPage);

          setTotalPages(calculatedTotalPages);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCustomers(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [loadCustomers, refreshTrigger]);

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
            className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-[3px] border-indigo-100 rounded-[1.2rem] outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_10px_25px_rgba(99,102,241,0.1)]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setViewMode("Grid")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              viewMode === "Grid"
                ? "bg-linear-to-r from-[#6366f1] to-[#a855f7] text-white shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)]"
                : "bg-white text-slate-500 border border-slate-100"
            }`}
          >
            <Grid3X3 size={16} strokeWidth={3} />
            <span className="text-sm font-normal font-['Arial'] leading-5 text-center">
              Grid
            </span>
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
                  status={c.isActive ? "Active" : "Inactive"}
                  registeredDate={new Date(c.createdAt).toLocaleDateString()}
                  onEdit={() => handleEdit(c._id)} // Grid Edit Trigger
                  onDelete={() => handleDelete(c._id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-4xl shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
              <div className="h-1.5 w-full bg-linear-to-r from-[#4F46E5] via-[#E11DBC] to-[#FB7185]" />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100">
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Customer ID
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Name
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Type
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Phone
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Address
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Registered
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
                        {/* ID with light purple badge */}
                        <td className="px-6 py-5">
                          <span className="bg-[#EEF2FF] text-[#6366F1] px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            {c._id.slice(-4).toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-purple-100">
                              <User size={18} />
                            </div>
                            <span className=" font-medium text-gray-800">
                              {c.customerType === "corporate"
                                ? c.companyName
                                : c.personId?.firstName}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 w-fit text-white shadow-sm uppercase ${
                              c.customerType === "domestic"
                                ? "bg-linear-to-r from-[#00A3FF] to-[#0066FF]"
                                : c.customerType === "corporate"
                                  ? "bg-linear-to-r from-[#E11DBC] to-[#FB7185]"
                                  : "bg-linear-to-r from-[#00C853] to-[#009624]"
                            }`}
                          >
                            {getTypeIcon(c.customerType)} {c.customerType}
                          </span>
                        </td>

                        {/* Separate Email */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <Mail size={14} className="text-[#3B82F6]" />
                            {c.contactId?.emailId}
                          </div>
                        </td>

                        {/* Separate Phone */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <Phone size={14} className="text-[#A855F7]" />
                            {c.contactId?.mobileNumber}
                          </div>
                        </td>

                        {/* Address with Logo */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <MapPin size={14} className="text-[#10B981]" />
                            <span className="truncate max-w-[150px]">
                              {c.addressId?.address}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1.5 text-white w-fit ${c.isActive ? "bg-[#00D169]" : "bg-slate-300"}`}
                          >
                            <Check size={12} strokeWidth={4} />
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                            <Calendar size={14} />
                            {new Date(c.createdAt).toLocaleDateString("en-GB")}
                          </div>
                        </td>

                        <div className="flex justify-center gap-2 mt-5">
                          <button
                            onClick={() => handleEdit(c._id)}
                            className="group flex items-center gap-2 px-4 py-2 border border-[#EEF2FF] rounded-xl text-slate-700 text-xs font-bold transition-all duration-300 bg-white hover:bg-linear-to-r hover:from-[#2563eb] hover:to-[#0891b2] hover:text-white hover:border-transparent hover:shadow-md active:scale-95"
                          >
                            <SquarePen
                              size={14}
                              className="text-slate-500 group-hover:text-white transition-colors"
                            />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(c._id)}
                            className="group flex items-center gap-2 px-4 py-2 border border-[#EEF2FF] rounded-xl text-slate-700 text-xs font-bold transition-all duration-300 bg-white hover:bg-linear-to-r hover:from-[#e11d48] hover:to-[#db2777] hover:text-white hover:border-transparent hover:shadow-md active:scale-95"
                          >
                            <Trash2
                              size={14}
                              className="text-slate-500 group-hover:text-white transition-colors"
                            />
                            <span>Delete</span>
                          </button>
                        </div>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!isLoading && customers.length > 0 && totalPages > 1 && (
            <div className=" flex justify-end border-t border-slate-100 ">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => loadCustomers(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerManagementList;
