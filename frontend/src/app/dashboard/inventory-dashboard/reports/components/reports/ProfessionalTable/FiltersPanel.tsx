// components/reports/ProfessionalTable/FiltersPanel.tsx
"use client";

import React from "react";
import { Calendar, X } from "lucide-react";
import { TableFilter } from "./types";

interface FiltersPanelProps {
  dateRange: { start: string; end: string };
  onDateRangeChange: (start: string, end: string) => void;
  filtersConfig: TableFilter[];
  columnFilters: Record<string, string>;
  onColumnFilterChange: (field: string, value: string) => void;
  onClearFilters: () => void;
}

export function FiltersPanel({
  dateRange,
  onDateRangeChange,
  filtersConfig,
  columnFilters,
  onColumnFilterChange,
  onClearFilters,
}: FiltersPanelProps) {
  return (
    <div
      style={{
        marginTop: 14,
        paddingTop: 14,
        borderTop: "1px solid #f1f5f9",
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        alignItems: "flex-end",
      }}
    >
      {/* Date range */}
      <div style={{ minWidth: 180 }}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#64748b",
            display: "block",
            marginBottom: 5,
            textTransform: "uppercase",
          }}
        >
          Date range
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={12} style={{ color: "#94a3b8" }} />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange(e.target.value, dateRange.end)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "5px 8px",
              fontSize: 11,
              outline: "none",
            }}
          />
          <span style={{ fontSize: 11, color: "#94a3b8" }}>–</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange(dateRange.start, e.target.value)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "5px 8px",
              fontSize: 11,
              outline: "none",
            }}
          />
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => onDateRangeChange("", "")}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic column filters */}
      {filtersConfig.map((filter, idx) => (
        <div key={idx} style={{ minWidth: 180 }}>
          <label
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#64748b",
              display: "block",
              marginBottom: 5,
              textTransform: "uppercase",
            }}
          >
            {filter.label}
          </label>
          <input
            type={filter.type === "date" ? "date" : "text"}
            value={columnFilters[filter.field] || ""}
            onChange={(e) => onColumnFilterChange(filter.field, e.target.value)}
            placeholder={`Search ${filter.label}`}
            style={{
              padding: "7px 10px",
              fontSize: 12,
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              width: "100%",
              outline: "none",
            }}
          />
        </div>
      ))}

      <button
        onClick={onClearFilters}
        style={{
          padding: "8px 12px",
          fontSize: 11,
          borderRadius: 10,
          border: "1px solid #ef4444",
          color: "#ef4444",
          background: "#fff",
          cursor: "pointer",
          height: 36,
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}