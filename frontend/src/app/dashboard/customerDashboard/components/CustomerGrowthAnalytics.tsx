"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LayoutDashboard, Calendar } from "lucide-react";

type ViewType = "Daily" | "Weekly" | "Monthly" | "Custom";

interface DataPoint {
  name: string;
  individual: number;
  corporate: number;
  total: number;
}

const dataMap: Record<Exclude<ViewType, "Custom">, DataPoint[]> = {
  Daily: [
    { name: "Mon", individual: 12, corporate: 5, total: 17 },
    { name: "Tue", individual: 15, corporate: 7, total: 22 },
    { name: "Wed", individual: 18, corporate: 6, total: 24 },
    { name: "Thu", individual: 14, corporate: 8, total: 22 },
    { name: "Fri", individual: 20, corporate: 10, total: 30 },
    { name: "Sat", individual: 10, corporate: 4, total: 14 },
    { name: "Sun", individual: 8, corporate: 3, total: 11 },
  ],
  Weekly: [
    { name: "Week 1", individual: 85, corporate: 35, total: 120 },
    { name: "Week 2", individual: 92, corporate: 40, total: 132 },
    { name: "Week 3", individual: 78, corporate: 32, total: 110 },
    { name: "Week 4", individual: 105, corporate: 45, total: 150 },
  ],
  Monthly: [
    { name: "Jan", individual: 400, corporate: 150, total: 550 },
    { name: "Feb", individual: 450, corporate: 180, total: 630 },
    { name: "Mar", individual: 380, corporate: 160, total: 540 },
  ],
};

const customData: DataPoint[] = [
  { name: "Period 1", individual: 150, corporate: 60, total: 210 },
  { name: "Period 2", individual: 170, corporate: 75, total: 245 },
  { name: "Period 3", individual: 160, corporate: 70, total: 230 },
  { name: "Period 4", individual: 190, corporate: 85, total: 275 },
];

const CustomerGrowthAnalytics: React.FC = () => {
  const [view, setView] = useState<ViewType>("Daily");

  const activeData = view === "Custom" ? customData : dataMap[view];

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-50 mt-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="text-[#7C3AED]" size={24} />
            <h2 className="text-2xl font-black text-[#7C3AED] tracking-tight">
              Customer Growth Analytics
            </h2>
          </div>
          <p className="text-slate-400 font-bold text-xs tracking-wide">
            Track customer acquisition trends
          </p>
        </div>

        {/* View Switcher Tabs - matches picture exactly */}
        <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
          {(["Daily", "Weekly", "Monthly", "Custom"] as ViewType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${
                  view === type
                    ? "bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg translate-y-[-2px]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type === "Custom" && <Calendar size={14} />}
                {type}
              </button>
            ),
          )}
        </div>
      </div>

      <AnimatePresence>
        {view === "Custom" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-3xl border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 uppercase">
                From:
              </span>
              <div className="relative">
                <input
                  type="date"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 uppercase">
                To:
              </span>
              <div className="relative">
                <input
                  type="date"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20"
                />
              </div>
            </div>
            <button className="bg-[#4F46E5] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md hover:bg-[#4338CA] transition-colors">
              Apply Filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[350px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCorp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    padding: "15px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4F46E5"
                  strokeWidth={4}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="individual"
                  stroke="#7C3AED"
                  strokeWidth={4}
                  fill="url(#colorInd)"
                />
                <Area
                  type="monotone"
                  dataKey="corporate"
                  stroke="#F97316"
                  strokeWidth={4}
                  fill="url(#colorCorp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-8 mt-12 border-t border-slate-50 pt-8">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
          <span className="text-xs font-black text-slate-600">
            Individual Customers
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-[#F97316]" />
          <span className="text-xs font-black text-slate-600">
            Corporate Customers
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
          <span className="text-xs font-black text-slate-600">
            Total Customers
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerGrowthAnalytics;
