"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { getAlls } from "../../../../helper/apiHelper";

type ViewType = "Daily" | "Weekly" | "Monthly" | "Custom";

const CustomerGrowthAnalytics: React.FC = () => {
  const [view, setView] = useState<ViewType>("Weekly");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const COLORS = {
    individual: "#6366f1",
    corporate: "#ff7d1a",
    total: "#9366ff",
  };

  const fetchChartData = useCallback(
    async (filter: string, from?: string, to?: string) => {
      setLoading(true);
      try {
        let url = `/customers/summary?filter=${filter.toLowerCase()}`;
        if (filter === "Custom" && from && to)
          url = `/customers/summary?from=${from}&to=${to}`;

        const response: any = await getAlls(url);
        const chartArray = Array.isArray(response)
          ? response
          : response?.data || [];

        setData(
          chartArray.map((item: any) => ({
            name: formatPeriod(item.period, filter),
            individual: item.domestic,
            corporate: item.corporate,
            total: item.total,
          })),
        );
      } catch (error) {
        console.error("Error:", error);
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
    return period;
  };

  useEffect(() => {
    if (view !== "Custom") fetchChartData(view);
  }, [view, fetchChartData]);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-50 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 px-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {/* PUBLIC IMAGE ICON */}
            <img
              src="/graph.PNG"
              alt="Graph Icon"
              className="w-[18px] h-[18px]"
            />

            <h2 className="text-xl font-bold text-[#8b5cf6] tracking-tight">
              Customer Growth Analytics
            </h2>
          </div>

          <p className="text-slate-500 text-sm font-medium">
            Track customer acquisition trends
          </p>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
          {(["Daily", "Weekly", "Monthly", "Custom"] as ViewType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  view === type
                    ? "bg-[#8b5cf6] text-white shadow-lg shadow-purple-200"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                {type}
              </button>
            ),
          )}
        </div>
      </div>

      {/* GRAPH CONTAINER - FIXED MARGINS TO SHOW ALL TEXT */}
      <div className="h-[420px] w-full relative p-6 bg-white rounded-4xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-slate-50/50">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-4xl">
            <Loader2 className="animate-spin text-[#6366f1]" size={40} />
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.individual}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.individual}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorCorp" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.corporate}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.corporate}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.total} stopOpacity={0} />
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
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              dy={15}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                padding: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="individual"
              stroke={COLORS.individual}
              strokeWidth={3}
              fill="url(#colorInd)"
            />
            <Area
              type="monotone"
              dataKey="corporate"
              stroke={COLORS.corporate}
              strokeWidth={3}
              fill="url(#colorCorp)"
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke={COLORS.total}
              strokeWidth={3}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CENTERED LEGEND */}
      <div className="flex justify-center flex-wrap items-center gap-8 mt-8">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.individual }}
          />
          <span className="text-sm font-semibold text-[#6366f1]">
            Individual Customers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.corporate }}
          />
          <span className="text-sm font-semibold text-[#ff7d1a]">
            Corporate Customers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.total }}
          />
          <span className="text-sm font-semibold text-[#9366ff]">
            Total Customers
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerGrowthAnalytics;
