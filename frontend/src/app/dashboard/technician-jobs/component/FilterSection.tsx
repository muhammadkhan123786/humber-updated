import React from "react";
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
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
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
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
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
