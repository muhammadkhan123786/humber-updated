"use client";
import React from "react";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  PauseCircle,
  UserMinus,
  Clock,
  Funnel,
} from "lucide-react";

interface FilterSectionProps {
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (status: string) => void;
  statistics?: any;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  onSearchChange,
  activeTab,
  onTabChange,
  statistics,
}) => {
  const statusFilters = [
    {
      id: "All",
      label: `All (${statistics?.total || 0})`,
      icon: <Users size={16} />,
      activeClass: "bg-blue-600 text-white border-blue-600",
      inactiveClass: "text-blue-600 border-blue-200 bg-blue-50",
    },
    {
      id: "Approved",
      label: `Approved (${statistics?.APPROVED || 0})`,
      icon: <CheckCircle2 size={16} />,
      activeClass: "bg-emerald-500 text-white border-emerald-500",
      inactiveClass: "text-emerald-600 border-emerald-200 bg-emerald-50",
    },
    {
      id: "Pending",
      label: `Pending (${statistics?.PENDING || 0})`,
      icon: <Clock size={16} />,
      activeClass: "bg-amber-500 text-white border-amber-500",
      inactiveClass: "text-amber-600 border-amber-200 bg-amber-50",
    },
    {
      id: "Rejected",
      label: `Rejected (${statistics?.REJECTED || 0})`,
      icon: <XCircle size={16} />,
      activeClass: "bg-red-500 text-white border-red-500",
      inactiveClass: "text-red-600 border-red-200 bg-red-50",
    },
    {
      id: "In-Active",
      label: `Inactive (${statistics?.["IN-ACTIVE"] || 0})`,
      icon: <PauseCircle size={16} />,
      activeClass: "bg-slate-500 text-white border-slate-500",
      inactiveClass: "text-slate-600 border-slate-200 bg-slate-50",
    },
    {
      id: "Terminated",
      label: `Terminated (${statistics?.TERMINATED || 0})`,
      icon: <UserMinus size={16} />,
      activeClass: "bg-orange-600 text-white border-orange-600",
      inactiveClass: "text-orange-700 border-orange-200 bg-orange-50",
    },
  ];

  return (
    <div className="w-full py-1">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search riders by name, email, or ID..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <button className="flex hover:bg-gray-100 items-center gap-2 px-6 py-3 rounded-xl font-medium border border-gray-200 transition-colors">
            <Funnel size={20} /> Filter
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-gray-500 font-semibold text-sm mr-2">
            Filter by Status:
          </span>
          <div className="flex flex-wrap gap-3">
            {statusFilters.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all active:scale-95 ${
                  activeTab === tab.id ? tab.activeClass : tab.inactiveClass
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
