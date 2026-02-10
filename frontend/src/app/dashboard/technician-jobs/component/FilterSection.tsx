import React from "react";
import { Search, ChevronDown } from "lucide-react";

const FilterSection = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center w-full">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by job number, technician, customer, or product..."
          className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-48">
          <select className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1.5 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        <div className="relative flex-1 md:w-48">
          <select className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1.5 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer">
            <option>All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
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
