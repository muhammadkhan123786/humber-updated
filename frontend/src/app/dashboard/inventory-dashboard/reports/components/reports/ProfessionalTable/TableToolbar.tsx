// components/reports/ProfessionalTable/TableToolbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Filter, Download, FileText, FileSpreadsheet, FileJson,
  Printer, Copy, RefreshCw, Loader2, LayoutGrid,
} from "lucide-react";
import { TableFilter } from "./types";

interface TableToolbarProps {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onToggleFilters: () => void;
  showFilters: boolean;
  accentColor: string;
  accentLight: string;
  onExport?: (type: "csv" | "excel" | "pdf") => void;
  isExporting: boolean;
  isFetching: boolean;
  onClearAll: () => void;
}

export function TableToolbar({
  total,
  search: propSearch,
  onSearchChange,
  hasActiveFilters,
  onToggleFilters,
  showFilters,
  accentColor,
  accentLight,
  onExport,
  isExporting,
  isFetching,
  onClearAll,
}: TableToolbarProps) {
  const [localSearch, setLocalSearch] = useState(propSearch);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setLocalSearch(propSearch), [propSearch]);

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    onSearchChange(val);
  };

  const handleExportClick = (format: "csv" | "excel" | "pdf") => {
    onExport?.(format);
    setShowExportMenu(false);
  };

  const copyToClipboard = async () => {
    // This would need table data – keep in parent? For simplicity, we'll keep it in main component.
    // We'll move it to main component. Instead, we pass an onCopy handler.
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  return (
    <div
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid #f1f5f9",
        background: "#fafcff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Left: title + fetching indicator */}
        <div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <LayoutGrid size={14} style={{ color: accentColor }} />
            Data Records
            {isFetching && (
              <Loader2 size={13} style={{ color: accentColor, animation: "spin 1s linear infinite" }} />
            )}
          </h3>
          <p style={{ color: "#94a3b8", fontSize: 11, margin: "2px 0 0" }}>{total} records</p>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search input */}
          <div style={{ position: "relative" }}>
            <Search
              size={12}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search server…"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "6px 10px 6px 28px",
                fontSize: 12,
                width: 160,
                outline: "none",
              }}
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={onToggleFilters}
            style={{
              background: showFilters ? accentLight : "#fff",
              border: `1px solid ${showFilters ? accentColor : "#e2e8f0"}`,
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: 11,
              color: showFilters ? accentColor : "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Filter size={11} /> Filters
            {hasActiveFilters && (
              <span
                style={{
                  background: accentColor,
                  color: "#fff",
                  borderRadius: 10,
                  padding: "1px 5px",
                  fontSize: 9,
                }}
              >
                {/** Count handled in parent, just show dot or nothing - here we rely on parent to pass a count? We'll keep simple */}
                ●
              </span>
            )}
          </button>

          {/* Export dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => !isExporting && setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              style={{
                background: `linear-gradient(135deg,${accentColor},${accentColor}CC)`,
                border: "none",
                borderRadius: 10,
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 600,
                color: "#fff",
                cursor: isExporting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                opacity: isExporting ? 0.7 : 1,
              }}
            >
              {isExporting ? (
                <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Download size={11} />
              )}
              {isExporting ? "Exporting…" : "Export"}
            </button>
            {showExportMenu && !isExporting && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #e2e8f0",
                  zIndex: 20,
                  minWidth: 170,
                }}
              >
                <div style={{ padding: "6px 0" }}>
                  {(["csv", "excel", "pdf"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExportClick(fmt)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 14px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        color: "#334155",
                      }}
                    >
                      {fmt === "csv" && <FileText size={12} style={{ color: "#059669" }} />}
                      {fmt === "excel" && <FileSpreadsheet size={12} style={{ color: "#16a34a" }} />}
                      {fmt === "pdf" && <FileJson size={12} style={{ color: "#dc2626" }} />}
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
                  <button
                    onClick={() => { onClearAll(); setShowExportMenu(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "8px 14px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 11,
                      color: "#334155",
                    }}
                  >
                    <RefreshCw size={12} /> Clear all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clear all (outside dropdown) */}
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              style={{
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: 11,
                color: "#ef4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <RefreshCw size={11} /> Clear all
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}