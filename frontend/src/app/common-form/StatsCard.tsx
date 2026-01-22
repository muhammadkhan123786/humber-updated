"use client";
import React, { useState } from "react";
import { Users, Shield, Building2 } from "lucide-react";

interface StatsCardsProps {
    totalCount: number;
    activeCount: number;
    inactiveCount: number;
    labels?: {
        total?: string;
        active?: string;
        inactive?: string;
    };
    onFilterChange?: (filter: 'all' | 'active' | 'inactive') => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({
    totalCount,
    activeCount,
    inactiveCount,
    labels = {
        total: "Total Types",
        active: "Active Types",
        inactive: "Inactive Types",
    },
    onFilterChange,
}) => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const handleFilterClick = (filter: 'all' | 'active' | 'inactive') => {
        setActiveFilter(filter);
        onFilterChange?.(filter);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Card */}
            <div 
                onClick={() => handleFilterClick('all')}
                className={`rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer transform ${
                    activeFilter === 'all' 
                        ? 'bg-linear-to-br from-blue-500 to-blue-700 ' 
                        : 'bg-linear-to-br from-blue-400 to-blue-600'
                }`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <Users size={32} className="text-white/90" />
                        <div className="text-4xl font-black">{totalCount}</div>
                        <p className="text-blue-50 text-sm">{labels.total}</p>
                    </div>
                    <div>
                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                            Total
                        </span>
                    </div>
                </div>
                {activeFilter === 'all' && (
                    <div className="mt-3 text-xs text-blue-100">✓ Filtered</div>
                )}
            </div>

            {/* Active Card */}
            <div 
                onClick={() => handleFilterClick('active')}
                className={`rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer transform ${
                    activeFilter === 'active' 
                        ? 'bg-linear-to-br from-green-500 to-emerald-700 ring-4 ring-green-300' 
                        : 'bg-linear-to-br from-green-400 to-emerald-600'
                }`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <Shield size={32} className="text-white/90" />
                        <div className="text-4xl font-black">{activeCount}</div>
                        <p className="text-green-50 text-sm">{labels.active}</p>
                    </div>
                    <div>
                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                            Active
                        </span>
                    </div>
                </div>
                {activeFilter === 'active' && (
                    <div className="mt-3 text-xs text-green-100">✓ Filtered</div>
                )}
            </div>

            {/* Inactive Card */}
            <div 
                onClick={() => handleFilterClick('inactive')}
                className={`rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer transform ${
                    activeFilter === 'inactive' 
                        ? 'bg-linear-to-br from-pink-500 to-purple-700 ring-4 ring-pink-300' 
                        : 'bg-linear-to-br from-pink-400 to-purple-600'
                }`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <Building2 size={32} className="text-white/90" />
                        <div className="text-4xl font-black">{inactiveCount}</div>
                        <p className="text-pink-50 text-sm">{labels.inactive}</p>
                    </div>
                    <div>
                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                            Inactive
                        </span>
                    </div>
                </div>
                {activeFilter === 'inactive' && (
                    <div className="mt-3 text-xs text-pink-100">✓ Filtered</div>
                )}
            </div>
        </div>
    );
};

export default StatsCards;