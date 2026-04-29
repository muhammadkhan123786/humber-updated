
"use client";

import { useState, useMemo } from "react";
import { Category } from "../../types";
import { ProfessionalTable } from "../reports/ProfessionalTable/index";
import { KpiCard } from "../reports/KPICard";
import { ChartCard } from "../reports/ReportChart";
import { useModuleReport } from "@/hooks/reports/useExport";

// Keys from MongoDB documents to strip from table headers
const HIDDEN_KEYS = new Set(["_id", "__v", "createdAt", "updatedAt"]);

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
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

  const currentTab = cat.tabs[activeTab];
  const reportName =
    currentTab.reportName ??
    currentTab.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // ── Single hook for data fetch + export ───────────────────────────────────
  const {
   data,
    isLoading,
    isFetching,
    filters,
    setSearch,
    setDateRange,
    setPage,
    setLimit,
    exportFile,
    isExporting,
    setColumnFilter, 
  clearColumnFilters,
  columnFilters,
  } = useModuleReport(cat.id, reportName);

  const apiRows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
 

  const headers = useMemo<string[]>(() => {
    if (apiRows.length === 0) return [];
    return Object.keys(apiRows[0]).filter((k) => !HIDDEN_KEYS.has(k));
  }, [apiRows]);

  const tableRows = useMemo<(string | number)[][]>(
    () =>
      apiRows.map((row: Record<string, any>) =>
        headers.map((h) => row[h] ?? ""),
      ),
    [apiRows, headers],
  );

 
  // ── KPIs from API only ───────────────────────────────────────────────────
  const apiKpis = data?.kpis ?? {};
  const kpisToShow = Object.entries(apiKpis)
  .filter(([key]) => key !== "_id")
  .map(([label, value]) => ({
    label,
    value: String(value),
  }));

  // ── Chart data from API (if available) ────────────────────────────────────
  const chartData = Array.isArray((data as any)?.chart) ? (data as any).chart : []

  console.log("chartData", chartData);
  // ── Tab switching ─────────────────────────────────────────────────────────
  const switchTab = (index: number) => {
    if (index === activeTab) return;
    setActiveTab(index);
    setSearch("");
    setDateRange("", "");
    clearColumnFilters();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* ── Gradient Category Header ─────────────────────────────────────── */}
      <div style={{ background: cat.grad, padding: "22px 28px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
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
              <span
                key={s}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color:
                      i === a.length - 1 ? "#fff" : "rgba(255,255,255,0.45)",
                    fontWeight: i === a.length - 1 ? 700 : 500,
                  }}
                >
                  {s}
                </span>
                {i < a.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
                )}
              </span>
            ))}
          </div>

          {/* Title row */}
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
                  }}
                >
                  {cat.title}
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                    margin: "4px 0 0",
                  }}
                >
                  {cat.desc}
                </p>
              </div>
            </div>

          
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {cat.tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => switchTab(i)}
                style={{
                  background:
                    activeTab === i ? "#fff" : "rgba(255,255,255,0.1)",
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

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div
        style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px 48px" }}
      >
        {isLoading ? (
          // Skeleton
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
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
          <div
            key={`${cat.id}-${activeTab}`}
            style={{ animation: "fadeInUp 0.35s ease both" }}
          >
            {/* KPI Cards */}
            {kpisToShow.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
                  gap: 16,
                  marginBottom: 22,
                }}
              >
                {kpisToShow.map((kpi, i) => (
                  <KpiCard
                    key={kpi.label}
                    kpi={kpi}
                    accent={cat.accent}
                    accentLight={cat.accentLight}
                    delay={i * 0.07}
                  />
                ))}
              </div>
            )}

            {/* Chart – only render if API provided data */}
            {chartData.length > 0 && (
              <ChartCard
                title={`${currentTab.label} — Trend Analysis`}
                chartData={chartData}
                chartColors={cat.chartColors}
                marginBottom={20}
              />
            )}

            {/* Table */}
             <ProfessionalTable
      headers={headers}
      rows={tableRows}
      total={total}
      totalPages={totalPages}
      page={filters.page}
      rowsPerPage={filters.limit}
      onPageChange={setPage}
      onRowsPerPageChange={setLimit}
      search={filters.search}
      onSearchChange={setSearch}
      statusStyles={STATUS_STYLES}
      accentColor={cat.accent}
      accentLight={cat.accentLight}
      isFetching={isFetching}
      columnFilters={columnFilters}
       onClearAllFilters={clearColumnFilters}
      onColumnFilterChange={setColumnFilter} // From Hook
      // onClearFilters={clearColumnFilters}
      dateRange={{ start: filters.startDate ?? "", end: filters.endDate ?? "" }}
      onDateRangeChange={(start, end) => setDateRange(start, end)}
      onExport={(type) =>
        exportFile({
          format: type,
          reportData: {
            headers,
            rows: tableRows,
            kpis: kpisToShow,
          },
        })
      }
      isExporting={isExporting}
      filtersConfig={currentTab.filters}
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
          0%,
          100% {
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
