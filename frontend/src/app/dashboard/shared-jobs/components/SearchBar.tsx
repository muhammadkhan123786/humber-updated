"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

const SharedJobsFilter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: FilterSectionProps) => {
  const statuses = ["All Statuses", "PENDING", "IN_PROGRESS", "ON_HOLD", "COMPLETED"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center w-full">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by job ID, notes, or admin notes..."
          className="block w-full pl-10 pr-3 py-2 bg-[#f3f4f6] border border-transparent rounded-lg placeholder:text-[#6b7280] text-sm focus:outline-none focus:border focus:border-[#14b8a6] focus:ring-[3px] focus:ring-[#14b8a6]/50 transition-all outline-none"
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500  transition-all cursor-pointer"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedJobsFilter;
