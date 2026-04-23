// import { useState, useEffect, useMemo } from 'react';
// import { Category } from '../../types';
// import { CategoryData } from '../../types';
// import { dataService } from '../../services/dataService';
// import { KpiCard } from './KpiCard';
// import { CategoryTabs } from './CategoryTabs';
// import { ChartSection } from './ChartSection';
// import { DataTable } from './DataTable';
// import { Skeleton } from '../../components/common/Skeleton';

// interface CategoryPageProps {
//   cat: Category;
//   onBack: () => void;
// }

// export function CategoryPage({ cat, onBack }: CategoryPageProps) {
//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [catData, setCatData] = useState<CategoryData | null>(null);
  
//   useEffect(() => {
//     setLoading(true);
//     dataService.getCategoryData(cat.id).then((data) => {
//       setCatData(data);
//       setLoading(false);
//     });
//   }, [cat.id]);
  
//   const chartKeys = useMemo(() => {
//     if (!catData) return [];
//     return Object.keys(catData.chart[0]).filter(k => k !== "name");
//   }, [catData]);
  
//   if (!catData && loading) {
//     return (
//       <div className="min-h-screen bg-slate-50">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-5 px-7">
//           <div className="max-w-[1400px] mx-auto">
//             <Skeleton height={40} radius={8} className="mb-4" />
//             <Skeleton height={80} radius={12} />
//           </div>
//         </div>
//         <div className="max-w-[1400px] mx-auto py-6 px-7">
//           <div className="grid grid-cols-4 gap-4 mb-5">
//             {[1, 2, 3, 4].map(i => <Skeleton key={i} height={100} />)}
//           </div>
//           <Skeleton height={300} radius={18} />
//           <div className="mt-5"><Skeleton height={280} radius={18} /></div>
//         </div>
//       </div>
//     );
//   }
  
//   if (!catData) return null;
  
//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Gradient Category Header */}
//       <div className="pt-5 px-7 pb-0" style={{ background: cat.grad }}>
//         <div className="max-w-[1400px] mx-auto">
//           {/* Breadcrumb */}
//           <div className="flex items-center gap-2 mb-3.5">
//             <button
//               onClick={onBack}
//               className="bg-white/20 border-none rounded-md py-1 px-2.5 text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
//             >
//               ← Back
//             </button>
//             {["HOME", "REPORTS", cat.title.toUpperCase()].map((s, i, a) => (
//               <span key={s} className="flex items-center gap-2">
//                 <span className={`text-[11px] ${i === a.length - 1 ? "text-white font-bold" : "text-white/45"}`}>
//                   {s}
//                 </span>
//                 {i < a.length - 1 && <span className="text-white/30">›</span>}
//               </span>
//             ))}
//           </div>
          
//           {/* Category title row */}
//           <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
//             <div className="flex items-center gap-3.5">
//               <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/25">
//                 {cat.icon}
//               </div>
//               <div>
//                 <h1 className="text-white text-2xl font-extrabold tracking-tight">{cat.title}</h1>
//                 <p className="text-white/65 text-xs mt-1">{cat.desc}</p>
//               </div>
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               <select className="bg-white/15 border border-white/25 rounded-xl py-2 px-3 text-xs text-white cursor-pointer outline-none">
//                 <option>Last 6 Months</option>
//                 <option>Last 30 Days</option>
//                 <option>This Year</option>
//               </select>
//               <select className="bg-white/15 border border-white/25 rounded-xl py-2 px-3 text-xs text-white cursor-pointer outline-none">
//                 <option>All Products</option>
//                 <option>Electronics</option>
//                 <option>Furniture</option>
//               </select>
//             </div>
//           </div>
          
//           {/* Tabs */}
//           <CategoryTabs
//             tabs={cat.tabs}
//             activeTab={activeTab}
//             accent={cat.accent}
//             accentLight={cat.accentLight}
//             accentBorder={cat.accentBorder}
//             onTabChange={(i) => { setActiveTab(i); }}
//           />
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="max-w-[1400px] mx-auto py-6 px-7 pb-12">
//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
//           {catData.kpis.map((kpi, i) => (
//             <KpiCard
//               key={kpi.label}
//               kpi={kpi}
//               accent={cat.accent}
//               accentLight={cat.accentLight}
//               delay={i * 0.07}
//             />
//           ))}
//         </div>
        
//         {/* Chart Section */}
//         <ChartSection
//           cat={cat}
//           activeTab={activeTab}
//           chartData={catData.chart}
//           chartKeys={chartKeys}
//         />
        
//         {/* Data Table */}
//         <DataTable
//           headers={catData.headers}
//           rows={catData.rows}
//           accent={cat.accent}
//           accentLight={cat.accentLight}
//           accentBorder={cat.accentBorder}
//           grad={cat.grad}
//           activeTabLabel={cat.tabs[activeTab].label}
//         />
//       </div>
//     </div>
//   );
// }


// src/components/category/CategoryPage.tsx - Update to use InventoryPage for inventory category

// import { CategoryPage as GenericCategoryPage } from './CategoryPageGeneric';
// import InventoryPage  from '../inventory/InventoryPage';
// import { Category } from '../../types';

// interface CategoryPageProps {
//   cat: Category;
//   onBack: () => void;
// }

// export function CategoryPage({ cat, onBack }: CategoryPageProps) {
//   // Use specialized InventoryPage for inventory category
//   if (cat.id === 'inventory') {
//     return <InventoryPage cat={cat} onBack={onBack} />;
//   }
  
//   // Use generic page for other categories
//   // return <GenericCategoryPage cat={cat} onBack={onBack} />;
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
import  {ProfessionalTable}  from "../reports/ProfessionalTable";
import { KpiCard } from "../reports/KPICard";
import { ChartCard } from "../reports/ReportChart";

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
    if (!searchTerm) return tabData.rows;
    return tabData.rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tabData?.rows, searchTerm]);

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
        {loading ? (
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