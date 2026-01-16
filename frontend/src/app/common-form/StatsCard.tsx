"use client";
import React from "react";
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
}

const StatsCards: React.FC<StatsCardsProps> = ({
    totalCount,
    activeCount,
    inactiveCount,
    labels = {
        total: "Total Business Types",
        active: "Active Types",
        inactive: "Inactive Types",
    },
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Card */}
            <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col  gap-2">
                        <Users size={32} className="text-white/90" />
                        <div className="text-4xl font-black">{totalCount}</div>
                        <p className="text-blue-50 text-sm">{labels.total}</p>
                    </div>
                    <div className="">

                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                            Total
                        </span>
                    </div>
                </div>
            </div>

            {/* Active Card */}
            <div className="bg-linear-to-br from-green-400 to-emerald-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <Shield size={32} className="text-white/90" />
                        <div className="text-4xl font-black">{activeCount}</div>
                        <p className="text-green-50 text-sm">{labels.active}</p>
                    </div>
                    <div className="">

                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                            Active
                        </span>
                    </div>
                </div>
            </div>
            {/* Inactive Card */}
            <div className="bg-linear-to-br from-pink-400 to-purple-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <Building2 size={32} className="text-white/90" />
                        <div className="text-4xl font-black">{inactiveCount}</div>
                        <p className="text-pink-50 text-sm">{labels.inactive}</p>
                    </div>
                    <div className="">
                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                            Inactive
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;