"use client";
import React from "react";
import { Search, ChevronDown, Filter } from "lucide-react";

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  statuses: any[];
}

const JobFilters: React.FC<JobFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statuses,
}) => {
  return (
    <div className="w-full relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="w-full h-1 bg-linear-to-r from-orange-500 to-pink-500" />

      <div className="p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Job ID..."
            className="w-full h-12 pl-12 pr-4 bg-gray-100 border-2 border-orange-50 rounded-xl focus:outline-none focus:border-orange-200 text-sm transition-all"
          />
        </div>

        <div className="relative w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-12 pl-10 pr-10 bg-white border-2 border-orange-50 rounded-xl appearance-none focus:outline-none focus:border-orange-200 text-sm font-medium text-indigo-950 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {statuses.map((status) => (
              <option key={status._id} value={status._id}>
                {status.name || status.technicianJobStatus}
              </option>
            ))}
          </select>

          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
            <Filter size={18} />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
