// components/common/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: string;
  statusStyles?: Record<string, { bg: string; color: string; dot: string }>;
}

export const StatusBadge = ({ status, statusStyles = {} }: StatusBadgeProps) => {
  const defaultStyles: Record<string, { bg: string; color: string; dot: string }> = {
    "In Stock": { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
    "Low Stock": { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
    "Out of Stock": { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
    "Received": { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
    "Pending": { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
    "Partial": { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
    "Overdue": { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
    "Completed": { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
    "Approved": { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
    "Cancelled": { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
    "Preferred": { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
    "Active": { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  };

  const style = { ...defaultStyles[status], ...statusStyles[status] };
  const s = style || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: s.bg,
      color: s.color,
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "600",
      whiteSpace: "nowrap"
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: s.dot,
        display: "inline-block"
      }} />
      {status}
    </span>
  );
};