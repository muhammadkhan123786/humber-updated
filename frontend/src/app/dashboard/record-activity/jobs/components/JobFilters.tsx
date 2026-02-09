"use client";

import React from "react";
import { Search, ChevronDown, Filter } from "lucide-react";

const JobFilters = () => {
  return (
    <div className="w-full relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Top Gradient Border Line */}
      <div className="w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500" />

      <div className="p-6 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input Container */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by job, ticket, or technician..."
            className="w-full h-12 pl-12 pr-4 bg-gray-100 border-2 border-orange-50 rounded-xl focus:outline-none focus:border-orange-200 text-sm transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative w-full md:w-48">
          <select
            className="w-full h-12 pl-10 pr-10 bg-white border-2 border-orange-50 rounded-xl appearance-none focus:outline-none focus:border-orange-200 text-sm font-medium text-indigo-950 cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>
              Status
            </option>
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="progress">In Progress</option>
            <option value="hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Filter Icon (Left) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
            <Filter size={18} />
          </div>

          {/* Chevron Icon (Right) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
