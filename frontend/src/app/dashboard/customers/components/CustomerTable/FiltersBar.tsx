"use client";

import { Search, RotateCcw } from 'lucide-react';

interface FiltersBarProps {
    searchQuery: string;
    statusFilter: string;
    onSearchChange: (query: string) => void;
    onStatusFilterChange: (status: string) => void;
    onResetFilters: () => void;
}

export default function FiltersBar({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
    onResetFilters
}: FiltersBarProps) {
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name, email or city..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D]/20 focus:border-[#FE6B1D] transition-all"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D]/20 focus:border-[#FE6B1D] bg-white text-gray-700 font-medium"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                </select>

                {/* Reset Button */}
                <button
                    onClick={onResetFilters}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all font-medium"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>
            </div>
        </div>
    );
}