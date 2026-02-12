"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
}

const FilterSection = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: FilterSectionProps) => {
  const [dbStatuses, setDbStatuses] = useState<any[]>([]);
  const [dbPriorities, setDbPriorities] = useState<any[]>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    const fetchFilters = async () => {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const statusRes = await fetch(
          `${API_BASE_URL}/technician-job-status?filter=all`,
          {
            headers,
          },
        );
        const statusData = await statusRes.json();
        setDbStatuses(
          Array.isArray(statusData) ? statusData : statusData.data || [],
        );
        const priorityRes = await fetch(
          `${API_BASE_URL}/service-request-prioprity-level?filter=all`,
          { headers },
        );
        const priorityData = await priorityRes.json();
        setDbPriorities(
          Array.isArray(priorityData) ? priorityData : priorityData.data || [],
        );
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, [API_BASE_URL]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center w-full">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by job number, technician, customer, or product..."
          className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1.5 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            {dbStatuses.map((s: any) => (
              <option key={s._id} value={s.technicianJobStatus}>
                {s.technicianJobStatus}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        <div className="relative flex-1 md:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1.5 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
          >
            <option value="All Priorities">All Priorities</option>
            {dbPriorities.map((p: any) => (
              <option key={p._id} value={p.serviceRequestPrioprity}>
                {p.serviceRequestPrioprity}
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

export default FilterSection;
