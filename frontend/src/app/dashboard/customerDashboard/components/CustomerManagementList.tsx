"use client";

import React, { useState } from "react";
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
  MapPin,
  Calendar,
  Check,
} from "lucide-react";
import CustomerCard, { CustomerType } from "./CustomerCard";

type ViewMode = "Grid" | "Table";

interface CustomerData {
  id: string;
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  address: string;
  status: "Active";
  registeredDate: string;
}

const customers: CustomerData[] = [
  {
    id: "C001",
    name: "John Smith",
    type: "Individual",
    email: "john.smith@email.com",
    phone: "555-0101",
    address: "123 Main St, Springfield, IL 62701",
    status: "Active",
    registeredDate: "15/01/2024",
  },
  {
    id: "C002",
    name: "Mary Johnson",
    type: "Company",
    email: "mary.j@email.com",
    phone: "555-0102",
    address: "456 Oak Ave, Springfield, IL 62702",
    status: "Active",
    registeredDate: "20/02/2024",
  },
  {
    id: "C003",
    name: "Robert Williams",
    type: "Government",
    email: "r.williams@email.com",
    phone: "555-0103",
    address: "789 Elm Street, Springfield, IL 62703",
    status: "Active",
    registeredDate: "10/03/2024",
  },
];

const CustomerManagementList = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("Grid");
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeStyles = (type: CustomerType) => {
    switch (type) {
      case "Individual":
        return "bg-[#00A3FF] text-white";
      case "Company":
        return "bg-[#E11DBC] text-white";
      case "Government":
        return "bg-[#00C853] text-white";
    }
  };

  const getTypeIcon = (type: CustomerType) => {
    switch (type) {
      case "Individual":
        return <User size={14} />;
      case "Company":
        return <Building2 size={14} />;
      case "Government":
        return <ShieldCheck size={14} />;
    }
  };

  return (
    <div className="space-y-8 mt-10 px-4 md:px-0">
      {/* Search and Toggle Header */}
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
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode("Table")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              viewMode === "Table"
                ? "bg-[#7C3AED] text-white shadow-lg"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <List size={16} /> Table
          </button>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === "Grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} {...customer} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          {/* Decorative Header Border matching your image */}
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
                    Contact Info
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
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                        {customer.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-md">
                          <User size={20} />
                        </div>
                        <span className="text-sm font-extrabold text-slate-700">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 w-fit shadow-sm ${getTypeStyles(
                          customer.type
                        )}`}
                      >
                        {getTypeIcon(customer.type)} {customer.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Mail size={12} className="text-blue-400" />{" "}
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Phone size={12} className="text-pink-400" />{" "}
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 max-w-[200px]">
                        <MapPin
                          size={12}
                          className="text-emerald-400 shrink-0"
                        />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-[#00D169] text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1.5">
                        <Check size={12} strokeWidth={4} /> Active
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Calendar size={14} /> {customer.registeredDate}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                          <SquarePen size={14} /> Edit
                        </button>
                        <button className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">
                          <Trash2 size={14} /> Delete
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
    </div>
  );
};

export default CustomerManagementList;
