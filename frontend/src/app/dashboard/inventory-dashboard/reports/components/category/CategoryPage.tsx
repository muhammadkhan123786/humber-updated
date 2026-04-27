
// components/category/CategoryPage.tsx
"use client";

import { useState, useMemo } from "react";
import { Category } from "../../types";
import {
  INVENTORY_DATA,
  PURCHASE_DATA,
  SUPPLIER_DATA,
  FINANCIAL_DATA,
} from "../../data/categories";
import  {ProfessionalTable}  from "../reports/ProfessionalTable";
import { KpiCard } from "../reports/KPICard";
import { ChartCard } from "../reports/ReportChart";
import { useReport } from "@/hooks/useExport";

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  "In Stock": { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  "Low Stock": { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
  "Out of Stock": { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Received: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  Pending: { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
  Partial: { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  Overdue: { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Preferred: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  Active: { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  Over: { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Under: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
};

interface CategoryPageProps {
  cat: Category;
  onBack: () => void;
}

export function CategoryPage({ cat, onBack }: CategoryPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "2024-01-01", end: "2024-06-30" });

  const { data, isLoading, exportFile } = useReport(cat.id, {
  startDate: dateRange.start,
  endDate: dateRange.end,
  search: searchTerm,
});

  // Get data based on category
  const getCategoryData = () => {
    switch (cat.id) {
      case "inventory":
        return INVENTORY_DATA;
      case "purchase":
        return PURCHASE_DATA;
      case "supplier":
        return SUPPLIER_DATA;
      case "financial":
        return FINANCIAL_DATA;
      default:
        return INVENTORY_DATA;
    }
  };

  const categoryData = getCategoryData();
  const currentTab = cat.tabs[activeTab];
  const tabData = categoryData[currentTab.label];

  const switchTab = (index: number) => {
    if (index === activeTab) return;
    setLoading(true);
    setSearchTerm("");
    setTimeout(() => {
      setActiveTab(index);
      setLoading(false);
    }, 300);
  };

  // Filter rows based on search
 const filteredRows = useMemo(() => {
  if (!tabData?.rows) return [];
  return tabData.rows;
}, [tabData]);

  if (!tabData) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px", textAlign: "center" }}>
        <p>No data available for this tab</p>
        <button onClick={onBack} style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Gradient Category Header */}
      <div style={{ background: cat.grad, padding: "22px 28px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <button
              onClick={onBack}
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "none",
                borderRadius: 7,
                padding: "4px 10px",
                color: "#fff",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← Back
            </button>
            {["HOME", "REPORTS", cat.title.toUpperCase()].map((s, i, a) => (
              <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: i === a.length - 1 ? "#fff" : "rgba(255,255,255,0.45)",
                    fontWeight: i === a.length - 1 ? 700 : 500,
                  }}
                >
                  {s}
                </span>
                {i < a.length - 1 && <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>}
              </span>
            ))}
          </div>

          {/* Category title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 22,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                {cat.icon}
              </div>
              <div>
                <h1
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: "-0.4px",
                  }}
                >
                  {cat.title}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "4px 0 0" }}>
                  {cat.desc}
                </p>
              </div>
            </div>

            {/* Global Filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  placeholder="Search data..."
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 10,
                    padding: "8px 12px 8px 34px",
                    fontSize: 12,
                    color: "#fff",
                    outline: "none",
                    width: 180,
                  }}
                />
                <svg
                  style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
                  width="13"
                  height="13"
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <select
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#fff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {cat.tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => switchTab(i)}
                style={{
                  background: activeTab === i ? "#fff" : "rgba(255,255,255,0.1)",
                  color: activeTab === i ? cat.accent : "rgba(255,255,255,0.8)",
                  border: "none",
                  borderRadius: "12px 12px 0 0",
                  padding: "10px 18px",
                  fontSize: 12,
                  fontWeight: activeTab === i ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                {tab.label}
                {activeTab === i && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: cat.accent,
                      display: "inline-block",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px 48px" }}>
        {isLoading  ? (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 100,
                    background: "#f1f5f9",
                    borderRadius: 16,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                height: 300,
                background: "#f1f5f9",
                borderRadius: 20,
                marginBottom: 20,
                animation: "pulse 1.5s infinite",
              }}
            />
            <div
              style={{
                height: 400,
                background: "#f1f5f9",
                borderRadius: 20,
                animation: "pulse 1.5s infinite",
              }}
            />
          </div>
        ) : (
          <div key={`${cat.id}-${activeTab}`} style={{ animation: "fadeInUp 0.35s ease both" }}>
            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 22,
              }}
            >
              {tabData.kpis.map((kpi, i) => (
                <KpiCard key={kpi.label} kpi={kpi} accent={cat.accent} accentLight={cat.accentLight} delay={i * 0.07} />
              ))}
            </div>

            {/* Chart Section */}
            <ChartCard
              title={`${currentTab.label} — Trend Analysis`}
              chartData={tabData.chart}
              chartColors={cat.chartColors}
              marginBottom={20}
            />

            {/* Data Table */}
           <ProfessionalTable
  headers={tabData.headers}
  rows={filteredRows}
  statusStyles={STATUS_STYLES}
  accentColor={cat.accent}
  accentLight={cat.accentLight}
  onExport={(type) => exportFile({ 
    format: type, 
    reportData: {
      headers: tabData.headers,
      rows: filteredRows,
      kpis: tabData.kpis
    }
  })}
/>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}