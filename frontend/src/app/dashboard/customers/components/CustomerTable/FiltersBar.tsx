"use client";

interface FiltersBarProps {
  searchQuery: string;
  statusFilter: string;
  vehicleMakeFilter: string; // ✅ Updated
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onVehicleMakeFilterChange: (make: string) => void; // ✅ Updated
  onResetFilters: () => void;
}

export default function FiltersBar({
  searchQuery,
  statusFilter,
  vehicleMakeFilter, // ✅ Updated
  onSearchChange,
  onStatusFilterChange,
  onVehicleMakeFilterChange, // ✅ Updated
  onResetFilters
}: FiltersBarProps) {
  
  const vehicleMakes = [
    { value: 'all', label: 'All Makes' },
    { value: 'toyota', label: 'Toyota' },
    { value: 'ford', label: 'Ford' },
    { value: 'honda', label: 'Honda' },
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customers..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        
        {/* Vehicle Make Filter */}
        <select
          value={vehicleMakeFilter}
          onChange={(e) => onVehicleMakeFilterChange(e.target.value)} // ✅ Updated
          className="px-4 py-2 border rounded-lg"
        >
          {vehicleMakes.map((make) => (
            <option key={make.value} value={make.value}>
              {make.label}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={onResetFilters}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}