// components/dashboard/DashboardPage.tsx
import { useDashboard } from "@/hooks/reports/useDashboard";
import { CategoryCard } from "./CategoryCard";
import { DashboardCharts } from "./DashboardCharts";
import { Category } from "../../types";
import { QUICK_STATS as FALLBACK_QUICK_STATS } from "../../constants/categories";
import { Loader2 } from "lucide-react";

interface DashboardPageProps {
  onNavigate: (cat: Category) => void;
  filtered: any[];
}

export function DashboardPage({ onNavigate, filtered }: DashboardPageProps) {
  const { quickStats, pieData, monthlyChart, isLoading } = useDashboard();

  // Convert quickStats object to array (if it's an object with keys)
  const quickStatsArray = quickStats
    ? Object.values(quickStats)
    : FALLBACK_QUICK_STATS;

  const fallbackPieData = [
    { name: "In Stock", value: 4829 },
    { name: "Low Stock", value: 210 },
    { name: "Out of Stock", value: 38 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto py-7 px-7 pb-12">
      {/* Category Cards (unchanged) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Report Categories</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {filtered.length} categories · Click to explore
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              delay={i * 0.08}
              onClick={() => onNavigate(cat)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-10 mb-10">
        <h2 className="text-base font-bold text-slate-900 mb-3.5">Quick Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickStatsArray.map((s: any) => (
            <div
              key={s.label}
              className="rounded-xl p-3.5 shadow-sm border transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              style={{ background: s.bg || "#fff", borderColor: s.bg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${s.color || "#059669"}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 text-white"
                  style={{ background: s.color || "#059669" }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 leading-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-slate-400 my-0.5">{s.label}</div>
                  <div
                    className={`text-[11px] font-bold ${
                      s.up ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {s.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts
        pieData={pieData || fallbackPieData}
        monthlyChart={monthlyChart || []}
      />
    </div>
  );
}