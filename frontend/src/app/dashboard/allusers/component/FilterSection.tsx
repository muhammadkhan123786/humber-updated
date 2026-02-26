"use client";

import React, { useState } from "react";
import { Search, Download, ChevronDown } from "lucide-react";

export default function FilterSection() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
  });

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 my-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="relative flex-1 min-w-[300px]">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, username, or email..."
          className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-600"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[130px]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">InActive</option>
            <option value="locked">Locked</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[130px]"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="technician">Technician</option>
            <option value="viewer">Viewer</option>
            <option value="customer">Customer</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-500 hover:text-white transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}
