"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { LayoutDashboard, Calendar, Loader2 } from "lucide-react";
import { getAlls } from "../../../../helper/apiHelper";

type ViewType = "Daily" | "Weekly" | "Monthly" | "Custom";

interface ApiDataPoint {
  period: string;
  total: number;
  domestic: number;
  corporate: number;
}

const CustomerGrowthAnalytics: React.FC = () => {
  const [view, setView] = useState<ViewType>("Daily");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const fetchChartData = useCallback(
    async (filter: string, from?: string, to?: string) => {
      setLoading(true);
      try {
        let url = `/customers/summary?filter=${filter.toLowerCase()}`;
        if (filter === "Custom" && from && to) {
          url = `/customers/summary?from=${from}&to=${to}`;
        }

        const response: any = await getAlls(url);

        const chartArray = Array.isArray(response)
          ? response
          : response?.data || [];

        const formattedData = chartArray.map((item: ApiDataPoint) => ({
          name: formatPeriod(item.period, filter),
          individual: item.domestic,
          corporate: item.corporate,
          total: item.total,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const formatPeriod = (period: string, filter: string) => {
    if (filter === "Daily" || filter === "Custom") {
      return new Date(period).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });
    }
    return period; // Weekly/Monthly ke liye API format hi sahi hai
  };

  useEffect(() => {
    if (view !== "Custom") {
      fetchChartData(view);
    }
  }, [view, fetchChartData]);

  const handleCustomFilter = () => {
    if (dateRange.from && dateRange.to) {
      fetchChartData("Custom", dateRange.from, dateRange.to);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-50 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="text-[#7C3AED]" size={24} />
            <h2 className="text-2xl font-black text-[#7C3AED] tracking-tight">
              Customer Growth Analytics
            </h2>
          </div>
          <p className="text-slate-400 font-bold text-xs tracking-wide uppercase">
            {loading ? "Updating Trends..." : "Real-time acquisition data"}
          </p>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100 overflow-x-auto">
          {(["Daily", "Weekly", "Monthly", "Custom"] as ViewType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  view === type
                    ? "bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg"
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
            className="flex flex-wrap items-center gap-6 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 uppercase">
                From:
              </span>
              <input
                type="date"
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 uppercase">
                To:
              </span>
              <input
                type="date"
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none"
              />
            </div>
            <button
              onClick={handleCustomFilter}
              className="bg-[#4F46E5] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md hover:scale-105 transition-transform"
            >
              Apply Filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[350px] w-full relative">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl">
            <Loader2 className="animate-spin text-[#4F46E5]" size={40} />
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="individual"
              stroke="#7C3AED"
              strokeWidth={4}
              fill="url(#colorInd)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="corporate"
              stroke="#F97316"
              strokeWidth={4}
              fill="url(#colorCorp)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-8 mt-12 border-t border-slate-50 pt-8">
        {[
          { color: "#7C3AED", label: "Individual (Domestic)" },
          { color: "#F97316", label: "Corporate" },
          { color: "#4F46E5", label: "Total Growth" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerGrowthAnalytics;
