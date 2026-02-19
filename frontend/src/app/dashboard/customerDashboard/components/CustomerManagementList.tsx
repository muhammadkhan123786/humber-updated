"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  X,
} from "lucide-react";
import { fetchCustomers, removeCustomer } from "../../../../hooks/useCustomer";
import CustomerCard from "./CustomerCard";
import Pagination from "@/components/ui/Pagination";

type ViewMode = "Grid" | "Table";

interface CustomerManagementListProps {
  onEdit: (id: string) => void;
  refreshTrigger?: number;
  onDataChange: () => void;
}

const CustomerManagementList = ({
  onEdit,
  refreshTrigger,
  onDataChange,
}: CustomerManagementListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("Grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const loadAllCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustomers(1, 100, "");

      if (response.success) {
        setAllCustomers(response.data);
        setTotalItems(response.total || 0);

        applyFilter("", response.data, 1);
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply client-side filtering
  const applyFilter = (
    search: string,
    data: any[] = allCustomers,
    page: number = currentPage,
  ) => {
    let filtered = [...data];

    if (search) {
      const query = search.toLowerCase();
      filtered = data.filter((c) => {
        const name =
          c.customerType === "corporate"
            ? c.companyName?.toLowerCase() || ""
            : `${c.personId?.firstName || ""} ${c.personId?.lastName || ""}`.toLowerCase();

        const email = c.contactId?.emailId?.toLowerCase() || "";
        const phone = c.contactId?.mobileNumber || "";

        return (
          name.includes(query) || email.includes(query) || phone.includes(query)
        );
      });
    }

    setFilteredCustomers(filtered);
    setTotalItems(filtered.length);
    const calculatedTotalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(calculatedTotalPages);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
    setCustomers(paginatedData);
  };

  const [customers, setCustomers] = useState<any[]>([]);
  useEffect(() => {
    loadAllCustomers();
  }, [refreshTrigger, loadAllCustomers]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log("🔎 Searching for:", value);
      setCurrentPage(1);
      applyFilter(value, allCustomers, 1);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    applyFilter("", allCustomers, 1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredCustomers.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
    setCustomers(paginatedData);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        const updatedAll = allCustomers.filter((c) => c._id !== id);
        setAllCustomers(updatedAll);
        applyFilter(searchTerm, updatedAll, currentPage);
        if (onDataChange) onDataChange();
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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-3/4">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"
            size={18}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border-[3px] border-indigo-100 rounded-[1.2rem] outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_10px_25px_rgba(99,102,241,0.1)]"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setViewMode("Grid")}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2
    ${
      viewMode === "Grid"
        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-purple-700"
        : "bg-white text-slate-500 border border-slate-100"
    }`}
          >
            <Grid3X3 size={16} strokeWidth={3} />
            <span className="text-sm font-medium font-['Arial'] leading-5 text-center">
              Grid
            </span>
          </button>

          <button
            onClick={() => setViewMode("Table")}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2
    ${
      viewMode === "Table"
        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-purple-700"
        : "bg-white text-slate-500 border border-slate-100"
    }`}
          >
            <List size={16} strokeWidth={3} />
            <span className="text-sm font-medium font-['Arial'] leading-5 text-center">
              Table
            </span>
          </button>
        </div>
      </div>

      {searchTerm && (
        <div className="text-sm text-gray-600 px-2">
          Showing results for:{" "}
          <span className="font-semibold">{searchTerm}</span> (
          {customers.length} of {totalItems} customers)
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-indigo-100">
          <p className="text-gray-500 text-lg">No customers found</p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
            >
              Clear search
            </button>
          )}
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
                  city={c.addressId?.city || "N/A"}
                  zipCode={c.addressId?.zipCode || "N/A"}
                  status={c.isActive ? "Active" : "Inactive"}
                  registeredDate={new Date(c.createdAt).toLocaleDateString()}
                  onEdit={() => handleEdit(c._id)}
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

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <Mail size={14} className="text-[#3B82F6]" />
                            {c.contactId?.emailId}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <Phone size={14} className="text-[#A855F7]" />
                            {c.contactId?.mobileNumber}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <MapPin size={14} className="text-[#10B981]" />
                            <span className="truncate max-w-[150px]">
                              {c.addressId?.address}
                            </span>
                          </div>
                        </td>

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
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(c._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-[#EEF2FF] rounded-xl text-slate-700 text-xs font-bold transition-all duration-300 bg-white hover:bg-linear-to-r hover:from-[#2563eb] hover:to-[#0891b2] hover:text-white hover:border-transparent hover:shadow-md active:scale-95 group/btn"
                            >
                              <SquarePen
                                size={14}
                                className="text-slate-500 group-hover/btn:text-white transition-colors"
                              />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDelete(c._id)}
                              disabled={isDeleting === c._id}
                              className={`flex items-center gap-2 px-4 py-2 border border-[#EEF2FF] rounded-xl text-slate-700 text-xs font-bold transition-all duration-300 bg-white hover:bg-linear-to-r hover:from-[#e11d48] hover:to-[#db2777] hover:text-white hover:border-transparent hover:shadow-md active:scale-95 group/del ${
                                isDeleting === c._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isDeleting === c._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2
                                  size={14}
                                  className="text-slate-500 group-hover/del:text-white transition-colors"
                                />
                              )}
                              <span>
                                {isDeleting === c._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>
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

          {!isLoading && customers.length > 0 && totalPages > 1 && (
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerManagementList;
