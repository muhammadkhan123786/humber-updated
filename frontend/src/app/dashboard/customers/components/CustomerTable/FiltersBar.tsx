// app/dashboard/customers/components/CustomerTable/FiltersBar.tsx
import { Search, Filter, Car, Download, RefreshCw } from 'lucide-react';

interface FiltersBarProps {
  searchQuery: string;
  statusFilter: string;
  vehicleTypeFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onVehicleTypeFilterChange: (value: string) => void;
  onResetFilters?: () => void; // ✅ New prop
}

export default function FiltersBar({
  searchQuery,
  statusFilter,
  vehicleTypeFilter,
  onSearchChange,
  onStatusFilterChange,
  onVehicleTypeFilterChange,
  onResetFilters
}: FiltersBarProps) {
  
  // Check if any filter is active
  const isFilterActive = 
    searchQuery || 
    statusFilter !== 'all' || 
    vehicleTypeFilter !== 'all';
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers by name, email, vehicle number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#FE6B1D] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#FE6B1D] focus:border-transparent"
              value={vehicleTypeFilter}
              onChange={(e) => onVehicleTypeFilterChange(e.target.value)}
            >
              <option value="all">All Vehicles</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
            </select>
            <Car className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* ✅ Reset Filters Button - Only show when filters are active */}
          {isFilterActive && onResetFilters && (
            <button 
              onClick={onResetFilters}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              title="Reset all filters"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}

          {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            Export
          </button> */}
        </div>
      </div>
    </div>
  );
}