"use client";

import React from "react";
import {
  User,
  Clock,
  Settings,
  Package,
  CheckCircle,
  Eye,
  RefreshCw,
  Receipt,
} from "lucide-react";

const JobDetailCard = () => {
  return (
    <div className="w-full relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
      {/* Top Gradient Border Line */}
      <div className="w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500" />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Header: Job ID, Badges, and Technician */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 leading-none">
                  JOB-001
                </h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                  TKT-2024-001
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                  Service & Repair
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> completed
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <User size={16} />
                <span>John Smith</span>
              </div>
            </div>

            {/* Timeline Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs">Assigned</p>
                <p className="text-indigo-950 text-sm font-bold">
                  15/01/2024, 08:00:00
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-xs">Started</p>
                <p className="text-indigo-950 text-sm font-bold">
                  15/01/2024, 09:30:00
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-xs">Completed</p>
                <p className="text-indigo-950 text-sm font-bold">
                  15/01/2024, 14:45:00
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Settings size={16} className="text-blue-600" />
                  <span className="text-xs">Service Activities</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">3</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Package size={16} className="text-purple-600" />
                  <span className="text-xs">Parts Changed</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">2</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-xs">Inspection</span>
                </div>
                <div className="text-2xl font-bold text-green-600">5/5</div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock size={16} />
              <span>
                Total Duration: <strong>5h 15m</strong>
              </span>
            </div>

            {/* Cost Breakdown Section */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                <Receipt size={18} className="text-emerald-600" />
                <span>Cost Breakdown</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parts Cost:</span>
                  <span className="text-gray-900 font-bold">£263.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Labour Cost:</span>
                  <span className="text-gray-900 font-bold">£187.50</span>
                </div>
                <div className="pt-3 border-t-2 border-emerald-200 flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-sm">
                    Total Bill:
                  </span>
                  <span className="text-emerald-600 text-2xl font-bold">
                    £451.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-32">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 px-4 bg-white border border-indigo-100 rounded-xl text-indigo-950 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
              <Eye size={16} /> View
            </button>
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 px-4 bg-white/50 border border-indigo-100 rounded-xl text-indigo-950 text-sm font-medium opacity-60 cursor-not-allowed">
              <RefreshCw size={16} /> Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailCard;
