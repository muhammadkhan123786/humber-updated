"use client";
import React, { useState, useEffect } from "react";
import {
  Phone,
  Download,
  Search,
  Filter,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import CallLogForm from "./CallLogForm";
import { useCallLogs } from "../../../../../hooks/useCallLogsHook";

interface CallLogHeaderProps {
  onSuccess: () => void;
  editingData: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

const CallLogHeader = ({
  onSuccess,
  editingData,
  isOpen,
  setIsOpen,
  onClose,
  onFilterChange,
}: CallLogHeaderProps) => {
  const { dropdowns } = useCallLogs();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCallType, setSelectedCallType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: searchTerm,
        status: selectedStatus,
        callType: selectedCallType,
        date: selectedDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    selectedStatus,
    selectedCallType,
    selectedDate,
    onFilterChange,
  ]);

  const handleAddNew = () => {
    setIsOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedCallType("all");
    setSelectedDate("");
  };

  return (
    <>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Call Log Management
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              View and manage all customer call records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm text-sm font-medium">
              <Download size={18} className="text-gray-500" />
              Export
            </button>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-medium text-sm shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              <Phone size={14} fill="currentColor" />
              Log New Call
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4F46E5]">
              <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                <Filter size={18} />
              </div>
              <span className="text-gray-800 font-bold">Filters</span>
            </div>
            {(searchTerm ||
              selectedStatus !== "all" ||
              selectedCallType !== "all" ||
              selectedDate) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer, ID, phone..."
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-10 py-2 text-sm transition-all outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-medium text-gray-600 outline-none appearance-none cursor-pointer hover:bg-white focus:bg-white focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10 transition-all"
              >
                <option value="all">All Status</option>
                {dropdowns.callStatuses.map((status: any) => (
                  <option key={status._id} value={status._id}>
                    {status.callStatus}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F46E5] pointer-events-none"
                size={18}
              />
            </div>

            <div className="relative">
              <select
                value={selectedCallType}
                onChange={(e) => setSelectedCallType(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-medium text-gray-600 outline-none appearance-none cursor-pointer hover:bg-white focus:bg-white focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10 transition-all"
              >
                <option value="all">All Call Types</option>
                {dropdowns.callTypes.map((type: any) => (
                  <option key={type._id} value={type._id}>
                    {type.callTypeName}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>

            <div className="relative">
              <CalendarIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-3 py-2 text-sm font-medium text-gray-600 outline-none cursor-pointer hover:bg-white focus:bg-white focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10 transition-all appearance-none"
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <CallLogForm
              onClose={onClose}
              editingData={editingData}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CallLogHeader;
