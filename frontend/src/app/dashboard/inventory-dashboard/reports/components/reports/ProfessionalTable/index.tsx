// components/reports/ProfessionalTable/index.tsx
"use client";

import React, { useState, useMemo} from "react";
import { LayoutGrid } from "lucide-react";
import { ProfessionalTableProps } from "./types";
import { TableToolbar } from "./TableToolbar";
import { FiltersPanel } from "./FiltersPanel";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";

// Helper: page button style (used inside pagination)
// Already defined in TablePagination component

export function ProfessionalTable({
  headers = [],
  rows = [],
  total = 0,
  totalPages = 1,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  search: propSearch,
  onSearchChange,
  columnFilters = {},
  onColumnFilterChange,
  onClearAllFilters,
  statusStyles = {},
  accentColor = "#059669",
  accentLight = "#ecfdf5",
  dateRange = { start: "", end: "" },
  onDateRangeChange,
  onExport,
  isExporting = false,
  isFetching = false,
  filtersConfig = [],
  
}: ProfessionalTableProps) {
  // Local UI state
  const [visibleColumns, setVisibleColumns] = useState<boolean[]>(() => headers.map(() => true));
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: number; direction: "asc" | "desc" } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Sorting
  const sortedRows = useMemo(() => {
    if (!sortConfig || !rows.length) return rows;
    return [...rows].sort((a, b) => {
      const aNum = parseFloat(String(a[sortConfig.key]).replace(/[^0-9.-]/g, ""));
      const bNum = parseFloat(String(b[sortConfig.key]).replace(/[^0-9.-]/g, ""));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }
      const aStr = String(a[sortConfig.key] ?? "").toLowerCase();
      const bStr = String(b[sortConfig.key] ?? "").toLowerCase();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const handleSort = (colIndex: number) => {
    setSortConfig((prev) => ({
      key: colIndex,
      direction: prev?.key === colIndex && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Row selection
  const toggleRow = (i: number) => {
    const next = new Set(selectedRows);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelectedRows(next);
  };

  const selectAll = () => {
    if (selectedRows.size === sortedRows.length && sortedRows.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedRows.map((_, i) => i)));
    }
  };

  const selectAllChecked = sortedRows.length > 0 && selectedRows.size === sortedRows.length;

  // Filters
  const hasActiveFilters =
    propSearch !== "" ||
    Object.keys(columnFilters).length > 0 ||
    dateRange.start !== "" ||
    dateRange.end !== "";

  const handleClearAll = () => {
    onSearchChange("");
    onDateRangeChange?.("", "");
    onClearAllFilters?.();
  };

  // Cell renderer
  const renderCell = (value: any, colIndex: number) => {
    const str = String(value ?? "");
    const isStatus = statusStyles[str];
    if (isStatus)
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: isStatus.bg,
            color: isStatus.color,
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isStatus.dot,
              display: "inline-block",
            }}
          />
          {str}
        </span>
      );
    if (colIndex === 0 && typeof value === "string" && /[-/]/.test(value))
      return (
        <span
          style={{
            color: "#475569",
            fontSize: 10,
            fontWeight: 700,
            background: "#f1f5f9",
            padding: "3px 8px",
            borderRadius: 6,
            fontFamily: "monospace",
          }}
        >
          {str}
        </span>
      );
    if (typeof value === "string" && (value.startsWith("$") || /[KM]/.test(value)))
      return (
        <span style={{ color: "#059669", fontWeight: 600, fontFamily: "monospace" }}>{str}</span>
      );
    if (typeof value === "number" || /^\d+$/.test(str))
      return (
        <span style={{ fontFamily: "monospace", fontWeight: 500, color: "#334155" }}>
          {typeof value === "number" ? value.toLocaleString() : str}
        </span>
      );
    return <span style={{ color: "#374151" }}>{str || "—"}</span>;
  };

  // Empty state
  if (!headers.length) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 60,
          textAlign: "center",
          border: "1px solid #f1f5f9",
        }}
      >
        <LayoutGrid size={24} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "#94a3b8", fontSize: 13 }}>No data available</p>
      </div>
    );
  }

  // Generate row selection bar (optional)
  const SelectionBar = () => {
    if (selectedRows.size === 0) return null;
    return (
      <div
        style={{
          background: accentLight,
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${accentColor}22`,
        }}
      >
        <span style={{ fontSize: 11, color: accentColor, fontWeight: 500 }}>
          {selectedRows.size} row(s) selected
        </span>
        <button
          onClick={() => setSelectedRows(new Set())}
          style={{
            background: "transparent",
            border: "none",
            color: accentColor,
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9",
        overflow: "hidden",
      }}
    >
      <TableToolbar
        total={total}
        search={propSearch}
        onSearchChange={onSearchChange}
        hasActiveFilters={hasActiveFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        accentColor={accentColor}
        accentLight={accentLight}
        onExport={onExport}
        isExporting={isExporting}
        isFetching={isFetching}
        onClearAll={handleClearAll}
      />

      {showFilters && (
        <FiltersPanel
          dateRange={dateRange}
          onDateRangeChange={(start, end) => onDateRangeChange?.(start, end)}
          filtersConfig={filtersConfig}
          columnFilters={columnFilters}
          onColumnFilterChange={(field, val) => onColumnFilterChange?.(field, val)}
          onClearFilters={() => {
            onClearAllFilters?.();
            onDateRangeChange?.("", "");
          }}
        />
      )}

      {/* <SelectionBar /> */}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compactView ? 11 : 12 }}>
          <TableHeader
            headers={headers}
            visibleColumns={visibleColumns}
            sortConfig={sortConfig}
            onSort={handleSort}
            compactView={compactView}
            selectAllChecked={selectAllChecked}
            onSelectAll={selectAll}
          />
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.filter(Boolean).length + 1}
                  style={{ padding: 50, textAlign: "center", color: "#94a3b8" }}
                >
                  No matching records found
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: "1px solid #f8fafc",
                    background: selectedRows.has(rIdx) ? accentLight : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedRows.has(rIdx)) e.currentTarget.style.background = "#fafcff";
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedRows.has(rIdx)) e.currentTarget.style.background = "";
                  }}
                >
                  <td style={{ padding: compactView ? "8px 12px" : "10px 16px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rIdx)}
                      onChange={() => toggleRow(rIdx)}
                      style={{ accentColor, cursor: "pointer" }}
                    />
                  </td>
                  {row.map(
                    (cell, cIdx) =>
                      visibleColumns[cIdx] && (
                        <td key={cIdx} style={{ padding: compactView ? "8px 12px" : "10px 16px" }}>
                          {renderCell(cell, cIdx)}
                        </td>
                      )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}