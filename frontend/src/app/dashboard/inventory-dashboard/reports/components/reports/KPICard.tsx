// // components/reports/KPICard.tsx
// "use client";

// import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";

// interface KPI {
//   title: string;
//   value: string | number;
//   change?: number;
//   icon: React.ReactNode;
//   color: string;
//   gradient: string;
// }

// interface KPICardProps {
//   kpi: KPI;
// }

// const colorStyles = {
//   blue: "from-blue-50 to-blue-100 border-blue-200",
//   emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
//   amber: "from-amber-50 to-amber-100 border-amber-200",
//   purple: "from-purple-50 to-purple-100 border-purple-200",
//   indigo: "from-indigo-50 to-indigo-100 border-indigo-200",
//   orange: "from-orange-50 to-orange-100 border-orange-200",
//   red: "from-red-50 to-red-100 border-red-200",
//   rose: "from-rose-50 to-rose-100 border-rose-200",
//   green: "from-green-50 to-green-100 border-green-200",
//   pink: "from-pink-50 to-pink-100 border-pink-200",
// };

// const iconColorStyles = {
//   blue: "text-blue-600",
//   emerald: "text-emerald-600",
//   amber: "text-amber-600",
//   purple: "text-purple-600",
//   indigo: "text-indigo-600",
//   orange: "text-orange-600",
//   red: "text-red-600",
//   rose: "text-rose-600",
//   green: "text-green-600",
//   pink: "text-pink-600",
// };

// export default function KPICard({ kpi }: KPICardProps) {
//   const isPositiveChange = kpi.change && kpi.change > 0;
//   const isNegativeChange = kpi.change && kpi.change < 0;

//   return (
//     <div className={`bg-gradient-to-br ${colorStyles[kpi.color as keyof typeof colorStyles]} rounded-xl border p-5 hover:shadow-lg transition-all duration-300 group`}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm text-slate-600 mb-1 font-medium">{kpi.title}</p>
//           <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
//           {kpi.change !== undefined && (
//             <div className="flex items-center gap-1 mt-2">
//               {isPositiveChange && <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
//               {isNegativeChange && <TrendingDown className="h-3.5 w-3.5 text-red-600" />}
//               <span className={`text-xs font-semibold ${isPositiveChange ? 'text-emerald-600' : isNegativeChange ? 'text-red-600' : 'text-slate-500'}`}>
//                 {Math.abs(kpi.change)}% from last period
//               </span>
//             </div>
//           )}
//         </div>
//         <div className={`p-3 rounded-xl bg-white shadow-md group-hover:scale-110 transition-transform duration-300 ${iconColorStyles[kpi.color as keyof typeof iconColorStyles]}`}>
//           {kpi.icon}
//         </div>
//       </div>
//     </div>
//   );
// }



// components/reports/KpiCard.tsx
"use client";

import { KPI } from "../../types";

interface KpiCardProps {
  kpi: KPI;
  accent: string;
  accentLight: string;
  delay: number;
}

export function KpiCard({ kpi, accent, accentLight, delay }: KpiCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "18px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9",
        transition: "all 0.2s",
        cursor: "pointer",
        animation: "fadeInUp 0.3s ease both",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${accent}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 10,
              fontWeight: 700,
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            {kpi.label}
          </p>
          <p
            style={{
              color: "#0f172a",
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}
          >
            {kpi.value}
          </p>
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            background: accentLight,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {kpi.icon}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, color: kpi.up ? "#10b981" : "#ef4444", fontWeight: 700 }}>
          {kpi.change}
        </span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>vs previous period</span>
      </div>
    </div>
  );
}