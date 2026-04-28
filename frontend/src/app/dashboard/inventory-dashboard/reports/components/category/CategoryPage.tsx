// // components/category/CategoryPage.tsx
// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { Category } from "../../types";
// import {
//   INVENTORY_DATA,
//   PURCHASE_DATA,
//   SUPPLIER_DATA,
//   FINANCIAL_DATA,
// } from "../../data/categories";
// import { ProfessionalTable } from "../reports/ProfessionalTable";
// import { KpiCard } from "../reports/KPICard";
// import { ChartCard } from "../reports/ReportChart";
// import { useReport } from "@/hooks/reports/useExport";

// // Map category ID + tab label → backend report name
// const TAB_TO_REPORT: Record<string, Record<string, string>> = {
//   inventory: {
//     "Stock Summary": "stock-summary",
//     "Low Stock": "low-stock",
//     "Valuation": "valuation",
//     "Movement": "movement",
//   },
//   purchase: {
//     "Purchase Orders": "purchase-orders",
//     "Goods Received": "goods-received",
//     "Summary": "summary",
//   },
//   supplier: {
//     "Supplier History": "supplier-history",
//     "Performance": "performance",
//     "Price History": "price-history",
//   },
//   financial: {
//     "Cost Analysis": "cost-analysis",
//     "Profit & Loss": "profit-loss",
//     "Budget vs Actual": "budget-vs-actual",
//   },
// };

// const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
//   "In Stock": { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
//   "Low Stock": { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
//   "Out of Stock": { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
//   Received: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
//   Pending: { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
//   Partial: { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
//   Overdue: { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
//   Preferred: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
//   Active: { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
//   Over: { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
//   Under: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
// };

// interface CategoryPageProps {
//   cat: Category;
//   onBack: () => void;
// }

// export function CategoryPage({ cat, onBack }: CategoryPageProps) {
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });

//   const currentTab = cat.tabs[activeTab];
//   const reportName = TAB_TO_REPORT[cat.id]?.[currentTab.label] || "stock-summary";

//   // Fetch data for the current tab only (reportName changes when tab changes)
//   const { data, isLoading, exportFile } = useReport(cat.id, {
//     startDate: dateRange.start,
//     endDate: dateRange.end,
//     search: searchTerm,
//     reportName, // 👈 this triggers the correct endpoint
//   });

//   // Fallback static data for chart (unchanged)
//   const getCategoryData = () => {
//     switch (cat.id) {
//       case "inventory": return INVENTORY_DATA;
//       case "purchase": return PURCHASE_DATA;
//       case "supplier": return SUPPLIER_DATA;
//       case "financial": return FINANCIAL_DATA;
//       default: return INVENTORY_DATA;
//     }
//   };
//   const categoryData = getCategoryData();
//   const staticTabData = categoryData[currentTab.label];

//   // Prepare table rows from API response
//   const rowsData = data?.rows || [];
//   const headers = rowsData.length > 0
//     ? Object.keys(rowsData[0]).filter(k => k !== "_id" && k !== "createdAt" && k !== "__v")
//     : [];
//   const tableRows = rowsData.map((row: any) => headers.map(h => row[h]));

//   // KPIs from API (fallback to static if empty)
//   const apiKpis = data?.kpis || {};
//   const hasApiKpis = Object.keys(apiKpis).length > 0;
//   const kpisToShow = hasApiKpis
//     ? Object.entries(apiKpis).map(([label, value]) => ({ label, value }))
//     : staticTabData?.kpis || [];

//   // Chart data – keep static for now (you can later use data?.chart if API provides)
//   const chartData = staticTabData?.chart || { labels: [], datasets: [] };

//   // Reset page when tab changes? Not needed because we don't paginate yet.
//   // If you want server pagination later, add page/limit state and pass to useReport.

//   const switchTab = (index: number) => {
//     if (index === activeTab) return;
//     setActiveTab(index);
//     setSearchTerm("");
//     setDateRange({ start: "", end: "" });
//     // No need to manually reset data – React Query will refetch because reportName changed
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
//       {/* Gradient Category Header (unchanged) */}
//       <div style={{ background: cat.grad, padding: "22px 28px 0" }}>
//         <div style={{ maxWidth: 1400, margin: "0 auto" }}>
//           {/* Breadcrumb */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//             <button
//               onClick={onBack}
//               style={{
//                 background: "rgba(255,255,255,0.18)",
//                 border: "none",
//                 borderRadius: 7,
//                 padding: "4px 10px",
//                 color: "#fff",
//                 fontSize: 12,
//                 cursor: "pointer",
//                 fontWeight: 600,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4,
//               }}
//             >
//               ← Back
//             </button>
//             {["HOME", "REPORTS", cat.title.toUpperCase()].map((s, i, a) => (
//               <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <span
//                   style={{
//                     fontSize: 11,
//                     color: i === a.length - 1 ? "#fff" : "rgba(255,255,255,0.45)",
//                     fontWeight: i === a.length - 1 ? 700 : 500,
//                   }}
//                 >
//                   {s}
//                 </span>
//                 {i < a.length - 1 && <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>}
//               </span>
//             ))}
//           </div>

//           {/* Category title row */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               gap: 16,
//               marginBottom: 22,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <div
//                 style={{
//                   width: 54,
//                   height: 54,
//                   background: "rgba(255,255,255,0.18)",
//                   borderRadius: 16,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 26,
//                   backdropFilter: "blur(12px)",
//                   border: "1px solid rgba(255,255,255,0.25)",
//                 }}
//               >
//                 {cat.icon}
//               </div>
//               <div>
//                 <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>
//                   {cat.title}
//                 </h1>
//                 <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "4px 0 0" }}>
//                   {cat.desc}
//                 </p>
//               </div>
//             </div>

//             {/* Global Filters */}
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               <div style={{ position: "relative" }}>
//                 <input
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search data..."
//                   style={{
//                     background: "rgba(255,255,255,0.15)",
//                     border: "1px solid rgba(255,255,255,0.25)",
//                     borderRadius: 10,
//                     padding: "8px 12px 8px 34px",
//                     fontSize: 12,
//                     color: "#fff",
//                     outline: "none",
//                     width: 180,
//                   }}
//                 />
//                 <svg
//                   style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
//                   width="13"
//                   height="13"
//                   fill="none"
//                   stroke="rgba(255,255,255,0.6)"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle cx="11" cy="11" r="8" />
//                   <path d="m21 21-4.35-4.35" />
//                 </svg>
//               </div>
//               <select
//                 style={{
//                   background: "rgba(255,255,255,0.15)",
//                   border: "1px solid rgba(255,255,255,0.25)",
//                   borderRadius: 10,
//                   padding: "8px 12px",
//                   fontSize: 12,
//                   color: "#fff",
//                   cursor: "pointer",
//                   outline: "none",
//                 }}
//               >
//                 <option>Last 6 Months</option>
//                 <option>Last 30 Days</option>
//                 <option>This Year</option>
//               </select>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
//             {cat.tabs.map((tab, i) => (
//               <button
//                 key={tab.label}
//                 onClick={() => switchTab(i)}
//                 style={{
//                   background: activeTab === i ? "#fff" : "rgba(255,255,255,0.1)",
//                   color: activeTab === i ? cat.accent : "rgba(255,255,255,0.8)",
//                   border: "none",
//                   borderRadius: "12px 12px 0 0",
//                   padding: "10px 18px",
//                   fontSize: 12,
//                   fontWeight: activeTab === i ? 700 : 500,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   whiteSpace: "nowrap",
//                   transition: "all 0.2s",
//                 }}
//               >
//                 <span style={{ fontSize: 14 }}>{tab.icon}</span>
//                 {tab.label}
//                 {activeTab === i && (
//                   <span
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: cat.accent,
//                       display: "inline-block",
//                     }}
//                   />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px 48px" }}>
//         {isLoading ? (
//           <div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//                 gap: 16,
//                 marginBottom: 20,
//               }}
//             >
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   style={{
//                     height: 100,
//                     background: "#f1f5f9",
//                     borderRadius: 16,
//                     animation: "pulse 1.5s infinite",
//                   }}
//                 />
//               ))}
//             </div>
//             <div
//               style={{
//                 height: 300,
//                 background: "#f1f5f9",
//                 borderRadius: 20,
//                 marginBottom: 20,
//                 animation: "pulse 1.5s infinite",
//               }}
//             />
//             <div
//               style={{
//                 height: 400,
//                 background: "#f1f5f9",
//                 borderRadius: 20,
//                 animation: "pulse 1.5s infinite",
//               }}
//             />
//           </div>
//         ) : (
//           <div key={`${cat.id}-${activeTab}`} style={{ animation: "fadeInUp 0.35s ease both" }}>
//             {/* KPI Cards */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//                 gap: 16,
//                 marginBottom: 22,
//               }}
//             >
//               {kpisToShow.map((kpi, i) => (
//                 <KpiCard
//                   key={kpi.label}
//                   kpi={kpi}
//                   accent={cat.accent}
//                   accentLight={cat.accentLight}
//                   delay={i * 0.07}
//                 />
//               ))}
//             </div>

//             {/* Chart Section (static) */}
//             <ChartCard
//               title={`${currentTab.label} — Trend Analysis`}
//               chartData={chartData}
//               chartColors={cat.chartColors}
//               marginBottom={20}
//             />

//             {/* Data Table – now using API rows */}
//             <ProfessionalTable
//               headers={headers.length ? headers : staticTabData?.headers || []}
//               rows={tableRows.length ? tableRows : staticTabData?.rows || []}
//               statusStyles={STATUS_STYLES}
//               accentColor={cat.accent}
//               accentLight={cat.accentLight}
//               onExport={(type) =>
//                 exportFile({
//                   format: type,
//                   reportData: {
//                     headers: headers.length ? headers : staticTabData?.headers || [],
//                     rows: tableRows.length ? tableRows : staticTabData?.rows || [],
//                     kpis: kpisToShow,
//                   },
//                 })
//               }
//             />
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(14px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }




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
import { ProfessionalTable } from "../reports/ProfessionalTable";
import { KpiCard }            from "../reports/KPICard";
import { ChartCard }          from "../reports/ReportChart";
import { useModuleReport }    from "@/hooks/reports/useExport"; 

// Keys from MongoDB documents to strip from table headers
const HIDDEN_KEYS = new Set(["_id", "__v", "createdAt", "updatedAt"]);

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  "In Stock":     { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  "Low Stock":    { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
  "Out of Stock": { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Received:       { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  Pending:        { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
  Partial:        { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  Overdue:        { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Preferred:      { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  Active:         { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  Over:           { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Under:          { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
};

interface CategoryPageProps {
  cat:    Category;
  onBack: () => void;
}

export function CategoryPage({ cat, onBack }: CategoryPageProps) {
  const [activeTab, setActiveTab] = useState(0);

  const currentTab = cat.tabs[activeTab];

  // Derive reportName: use explicit tab.reportName if set, otherwise slug the label
  const reportName = currentTab.reportName
    ?? currentTab.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // ── Single hook for data fetch + export ───────────────────────────────────
  const {
    data,
    isLoading,
    isFetching,
    filters,
    setSearch,
    setDateRange,
    exportFile,
    isExporting,
  } = useModuleReport(cat.id, reportName);

  // ── Static fallback data (chart + empty-state) ────────────────────────────
  const getStaticData = () => {
    switch (cat.id) {
      case "inventory": return INVENTORY_DATA;
      case "purchase":  return PURCHASE_DATA;
      case "supplier":  return SUPPLIER_DATA;
      case "financial": return FINANCIAL_DATA;
      default:          return INVENTORY_DATA;
    }
  };
  const staticTabData = getStaticData()[currentTab.label];

  // ── Shape API rows → [headers, tableRows] ─────────────────────────────────
  const apiRows = data?.rows ?? [];

  const headers = useMemo<string[]>(() => {
    if (apiRows.length === 0) return staticTabData?.headers ?? [];
    return Object.keys(apiRows[0]).filter(k => !HIDDEN_KEYS.has(k));
  }, [apiRows, staticTabData]);

  const tableRows = useMemo<(string | number)[][]>(
    () => apiRows.map((row: Record<string, any>) => headers.map(h => row[h] ?? "")),
    [apiRows, headers]
  );

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpisToShow = useMemo(() => {
    const apiKpis = data?.kpis ?? {};
    if (Object.keys(apiKpis).length > 0) {
      return Object.entries(apiKpis).map(([label, value]) => ({
        label,
        value: String(value),
      }));
    }
    return staticTabData?.kpis ?? [];
  }, [data?.kpis, staticTabData]);

  // Chart stays static for now (replace data?.chart when API provides it)
  const chartData = staticTabData?.chart ?? { labels: [], datasets: [] };

  // ── Tab switching ─────────────────────────────────────────────────────────
  const switchTab = (index: number) => {
    if (index === activeTab) return;
    setActiveTab(index);
    // Reset filters for the new tab
    setSearch("");
    setDateRange("", "");
  };

  // ── Active headers / rows (fall back to static when API returns nothing) ──
  const displayHeaders = tableRows.length ? headers : staticTabData?.headers ?? [];
  const displayRows    = tableRows.length ? tableRows : staticTabData?.rows   ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* ── Gradient Category Header ─────────────────────────────────────── */}
      <div style={{ background: cat.grad, padding: "22px 28px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <button
              onClick={onBack}
              style={{
                background: "rgba(255,255,255,0.18)", border: "none",
                borderRadius: 7, padding: "4px 10px", color: "#fff",
                fontSize: 12, cursor: "pointer", fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              ← Back
            </button>
            {["HOME", "REPORTS", cat.title.toUpperCase()].map((s, i, a) => (
              <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 11,
                  color: i === a.length - 1 ? "#fff" : "rgba(255,255,255,0.45)",
                  fontWeight: i === a.length - 1 ? 700 : 500,
                }}>
                  {s}
                </span>
                {i < a.length - 1 && <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>}
              </span>
            ))}
          </div>

          {/* Title row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: 22,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 54, height: 54, background: "rgba(255,255,255,0.18)",
                borderRadius: 16, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 26, backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}>
                {cat.icon}
              </div>
              <div>
                <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>
                  {cat.title}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "4px 0 0" }}>
                  {cat.desc}
                </p>
              </div>
            </div>

            {/* Search — calls backend via the hook */}
            <div style={{ position: "relative" }}>
              <input
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search data…"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 10, padding: "8px 12px 8px 34px",
                  fontSize: 12, color: "#fff", outline: "none", width: 180,
                }}
              />
              <svg
                style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
                width="13" height="13" fill="none"
                stroke="rgba(255,255,255,0.6)" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {cat.tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => switchTab(i)}
                style={{
                  background:   activeTab === i ? "#fff" : "rgba(255,255,255,0.1)",
                  color:        activeTab === i ? cat.accent : "rgba(255,255,255,0.8)",
                  border:       "none",
                  borderRadius: "12px 12px 0 0",
                  padding:      "10px 18px",
                  fontSize:     12,
                  fontWeight:   activeTab === i ? 700 : 500,
                  cursor:       "pointer",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          6,
                  whiteSpace:   "nowrap",
                  transition:   "all 0.2s",
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                {tab.label}
                {activeTab === i && (
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: cat.accent, display: "inline-block",
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px 48px" }}>
        {isLoading ? (
          // Skeleton
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
              gap: 16, marginBottom: 20,
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  height: 100, background: "#f1f5f9",
                  borderRadius: 16, animation: "pulse 1.5s infinite",
                }} />
              ))}
            </div>
            <div style={{ height: 300, background: "#f1f5f9", borderRadius: 20, marginBottom: 20, animation: "pulse 1.5s infinite" }} />
            <div style={{ height: 400, background: "#f1f5f9", borderRadius: 20, animation: "pulse 1.5s infinite" }} />
          </div>
        ) : (
          <div key={`${cat.id}-${activeTab}`} style={{ animation: "fadeInUp 0.35s ease both" }}>

            {/* KPI Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
              gap: 16, marginBottom: 22,
            }}>
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

            {/* Chart */}
            <ChartCard
              title={`${currentTab.label} — Trend Analysis`}
              chartData={chartData}
              chartColors={cat.chartColors}
              marginBottom={20}
            />

            {/* Table — search + date range are controlled from this hook */}
            <ProfessionalTable
              headers={displayHeaders}
              rows={displayRows}
              statusStyles={STATUS_STYLES}
              accentColor={cat.accent}
              accentLight={cat.accentLight}
              isFetching={isFetching}
              // Date range: controlled — table UI → hook → backend
              dateRange={{ start: filters.startDate ?? "", end: filters.endDate ?? "" }}
              onDateRangeChange={(start: any, end: any) => setDateRange(start, end)}
              // Export: all three formats go to the backend
              onExport={(type) =>
                exportFile({
                  format: type,
                  reportData: {
                    headers: displayHeaders,
                    rows:    displayRows,
                    kpis:    kpisToShow,
                  },
                })
              }
              isExporting={isExporting}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}