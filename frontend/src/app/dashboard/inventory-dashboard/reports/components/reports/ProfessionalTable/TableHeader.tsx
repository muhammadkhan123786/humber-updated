// components/reports/ProfessionalTable/TableHeader.tsx
"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  headers: string[];
  visibleColumns: boolean[];
  sortConfig: { key: number; direction: "asc" | "desc" } | null;
  onSort: (colIndex: number) => void;
  compactView: boolean;
  selectAllChecked: boolean;
  onSelectAll: () => void;
}

export function TableHeader({
  headers,
  visibleColumns,
  sortConfig,
  onSort,
  compactView,
  selectAllChecked,
  onSelectAll,
}: TableHeaderProps) {
  return (
    <thead>
      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
        <th style={{ padding: compactView ? "8px 12px" : "10px 16px", width: 30 }}>
          <input
            type="checkbox"
            checked={selectAllChecked}
            onChange={onSelectAll}
            style={{ accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </th>
        {headers.map(
          (h, idx) =>
            visibleColumns[idx] && (
              <th
                key={idx}
                onClick={() => onSort(idx)}
                style={{
                  padding: compactView ? "8px 12px" : "10px 16px",
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {h}
                  <ArrowUpDown size={10} style={{ opacity: sortConfig?.key === idx ? 1 : 0.3 }} />
                </div>
              </th>
            )
        )}
      </tr>
    </thead>
  );
}