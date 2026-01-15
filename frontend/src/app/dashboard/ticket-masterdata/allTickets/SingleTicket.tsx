"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Added for back navigation
import {
  User,
  Package,
  ClipboardList,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

const SingleTicket = () => {
  const router = useRouter(); // Initialize router

  const tabs = [
    "Issue Details",
    "Coverage",
    "Parts",
    "Invoice",
    "Activity Log",
  ];

  return (
    <div className="p-8 bg-[#F8F9FF] min-h-screen font-sans text-gray-900">
      {/* 1. Header Section */}
      <div className="flex items-center gap-4 mb-8">
        {/* Back Button Action */}
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">T-2026-002</h1>
            <span className="px-3 py-1 bg-[#00A3FF] text-white text-xs font-bold rounded-full uppercase">
              open
            </span>
            <span className="px-3 py-1 bg-[#FFB800] text-white text-xs font-bold rounded-full uppercase">
              medium
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} /> Created: 09/01/2026, 05:00:00
          </p>
        </div>
      </div>

      {/* 2. Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Customer Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold">
            <User size={20} className="text-gray-400" />
            <span>Customer</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Mary Johnson</h3>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Mail size={14} /> mary.j@email.com
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Phone size={14} /> 555-0102
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2 pt-2">
              <MapPin size={14} /> 456 Oak Ave, Springfield, IL 62702
            </p>
          </div>
        </div>

        {/* Product Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold">
            <Package size={20} className="text-gray-400" />
            <span>Product</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gray-900 font-bold">Drive Scout</p>
              <p className="text-gray-400 text-xs font-medium uppercase">
                Model Name
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <p className="text-gray-600">
                <span className="text-gray-400">Make:</span> Drive Medical
              </p>
              <p className="text-gray-600">
                <span className="text-gray-400">Model:</span> Scout Compact
              </p>
              <p className="text-gray-600">
                <span className="text-gray-400">S/N:</span> DM-SC-2024-045
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Info Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold">
            <ClipboardList size={20} className="text-gray-400" />
            <span>Ticket Info</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Source:</span>
              <span className="text-gray-900 font-bold">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-gray-900 font-bold">On-Site</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Urgency:</span>
              <span className="text-gray-900 font-bold ">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coverage:</span>
              <span className="text-gray-500 italic">Not Set</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-xl w-fit">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              index === 0
                ? "bg-white text-[#6366F1] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 min-h-[200px]">
          <p className="text-gray-600 leading-relaxed">
            Front wheel making grinding noise when turning left. Customer
            reports it happens more frequently when the battery is under 50%
            charge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleTicket;
