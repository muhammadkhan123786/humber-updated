// components/reports/KPICard.tsx
"use client";

import { TrendingUp, Package, DollarSign, AlertTriangle, Truck, ShoppingCart, Boxes, Activity, Edit3, Clock, CheckCircle, XCircle, Building2, FileText, Award } from "lucide-react";

interface KPI {
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
  icon?: string | React.ReactNode;
}

interface KPICardProps {
  kpi: KPI;
  accent: string;
  accentLight: string;
  delay: number;
}

// Map label keywords to Lucide icons
const getIconComponent = (label: string, fallbackIcon?: string | React.ReactNode): React.ReactNode => {
  if (fallbackIcon) {
    if (typeof fallbackIcon === 'string') return <span style={{ fontSize: 18 }}>{fallbackIcon}</span>;
    return fallbackIcon;
  }

  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('product') || lowerLabel.includes('sku')) return <Package size={18} />;
  if (lowerLabel.includes('stock') || lowerLabel.includes('inventory')) return <Boxes size={18} />;
  if (lowerLabel.includes('value') || lowerLabel.includes('cost')) return <DollarSign size={18} />;
  if (lowerLabel.includes('low') || lowerLabel.includes('critical')) return <AlertTriangle size={18} />;
  if (lowerLabel.includes('incoming')) return <Truck size={18} />;
  if (lowerLabel.includes('outgoing')) return <ShoppingCart size={18} />;
  if (lowerLabel.includes('movement')) return <Activity size={18} />;
  if (lowerLabel.includes('adjustment')) return <Edit3 size={18} />;
  if (lowerLabel.includes('pending')) return <Clock size={18} />;
  if (lowerLabel.includes('completed')) return <CheckCircle size={18} />;
  if (lowerLabel.includes('cancelled')) return <XCircle size={18} />;
  if (lowerLabel.includes('supplier')) return <Building2 size={18} />;
  if (lowerLabel.includes('order')) return <FileText size={18} />;
  if (lowerLabel.includes('rating')) return <Award size={18} />;
  return <TrendingUp size={18} />;
};

// Parse change string like "+12%" or "-3%" into numeric change and up flag
const parseChange = (changeStr?: string): { numericChange?: number; up?: boolean } => {
  if (!changeStr) return {};
  const match = changeStr.match(/([+-]?)(\d+(?:\.\d+)?)%?/);
  if (!match) return {};
  const sign = match[1];
  const num = parseFloat(match[2]);
  const up = sign !== '-';
  return { numericChange: num, up };
};

export function KpiCard({ kpi, accent, accentLight, delay }: KPICardProps) {
  const changeDisplay = kpi.change;
  let isUp = kpi.up;

  if (changeDisplay) {
    const parsed = parseChange(changeDisplay);
    if (parsed.numericChange !== undefined && isUp === undefined) {
      isUp = parsed.up;
    }
  }

  const iconNode = getIconComponent(kpi.label, kpi.icon);
  const displayValue = typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value;

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
            {displayValue}
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
            flexShrink: 0,
            color: accent,
          }}
        >
          {iconNode}
        </div>
      </div>
      {changeDisplay && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: isUp ? "#10b981" : "#ef4444", fontWeight: 700 }}>
            {changeDisplay}
          </span>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>vs previous period</span>
        </div>
      )}
    </div>
  );
}