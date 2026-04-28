"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, Download, FileText, FileSpreadsheet, FileJson,
  Printer, Copy, ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid,
  RefreshCw, Settings, Calendar, Loader2, X,
} from "lucide-react";

interface ProfessionalTableProps {
  headers: string[];
  rows: any[][];
  total: number;
  totalPages: number;
  page: number | any;
  rowsPerPage: number | any;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  search: string | any;
  onSearchChange: (value: string) => void;
  columnFilters?: Record<string, string>;
  onColumnFilterChange?: (field: string, value: string) => void;
  onClearAllFilters?: () => any;
  statusStyles?: Record<string, { bg: string; color: string; dot: string }>;
  accentColor?: string;
  accentLight?: string;
  dateRange?: { start: string; end: string };
  onDateRangeChange?: (start: string, end: string) => void;
  onExport?: (type: "csv" | "excel" | "pdf") => void;
  isExporting?: boolean;
  isFetching?: boolean;
  filtersConfig: any;
}

export function ProfessionalTable({
  headers = [],
  rows = [],
  total = 0,
  totalPages = 1,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  search,
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
  filtersConfig,
}: ProfessionalTableProps) {


  const [visibleColumns, setVisibleColumns] = useState<boolean[]>(() => headers.map(() => true));
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: number; direction: "asc" | "desc" } | null>(null);


 
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
    setSortConfig(prev => ({
      key: colIndex,
      direction: prev?.key === colIndex && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
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

  const hasActiveFilters = search !== "" || Object.keys(columnFilters).length > 0 || dateRange.start !== "" || dateRange.end !== "";

  const handleClearAll = () => {
    onSearchChange("");
    onDateRangeChange?.("", "");
    onClearAllFilters?.();
  };

  const copyToClipboard = async () => {
    const vis = headers.filter((_, i) => visibleColumns[i]);
    const text = [
      vis.join("\t"),
      ...sortedRows.map(r => r.filter((_, i) => visibleColumns[i]).join("\t")),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  const printReport = () => {
    const vis = headers.filter((_, i) => visibleColumns[i]);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Report</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;margin:32px}
      h1{font-size:18px;margin-bottom:8px;color:#1e293b}table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#3b82f6;color:#fff;padding:8px;text-align:left}td{padding:6px 8px;border-bottom:1px solid #e2e8f0}
      </style></head><body>
      <h1>Report — ${new Date().toLocaleString()}</h1>
      <table><thead><td>${vis.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${sortedRows.map(r => `<tr>${r.filter((_, i) => visibleColumns[i]).map(c => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("")}
      </tbody></table></body></html>`);
    win.document.close();
    win.print();
    setShowExportMenu(false);
  };

  const renderCell = (value: any, colIndex: number) => {
    const str = String(value ?? "");
    const isStatus = statusStyles[str];
    if (isStatus) return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: isStatus.bg, color: isStatus.color,
        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isStatus.dot, display: "inline-block" }} />
        {str}
      </span>
    );
    if (colIndex === 0 && typeof value === "string" && /[-/]/.test(value)) return (
      <span style={{
        color: "#475569", fontSize: 10, fontWeight: 700,
        background: "#f1f5f9", padding: "3px 8px", borderRadius: 6, fontFamily: "monospace",
      }}>{str}</span>
    );
    if (typeof value === "string" && (value.startsWith("$") || /[KM]/.test(value))) return (
      <span style={{ color: "#059669", fontWeight: 600, fontFamily: "monospace" }}>{str}</span>
    );
    if (typeof value === "number" || /^\d+$/.test(str)) return (
      <span style={{ fontFamily: "monospace", fontWeight: 500, color: "#334155" }}>
        {typeof value === "number" ? value.toLocaleString() : str}
      </span>
    );
    return <span style={{ color: "#374151" }}>{str || "—"}</span>;
  };

  if (!headers.length) {
    return (
      <div style={{ background: "#fff", borderRadius: 20, padding: 60, textAlign: "center", border: "1px solid #f1f5f9" }}>
        <LayoutGrid size={24} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "#94a3b8", fontSize: 13 }}>No data available</p>
      </div>
    );
  }

  const exportLabel = isExporting ? "Exporting…" : "Export";

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      border: "1px solid #f1f5f9", overflow: "hidden",
    }}>
      {/* Toolbar */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", background: "#fafcff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <LayoutGrid size={14} style={{ color: accentColor }} />
              Data Records
              {isFetching && <Loader2 size={13} style={{ color: accentColor, animation: "spin 1s linear infinite" }} />}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 11, margin: "2px 0 0" }}>{total} records</p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
           

            <button onClick={() => setShowFilters(!showFilters)} style={{
              background: showFilters ? accentLight : "#fff",
              border: `1px solid ${showFilters ? accentColor : "#e2e8f0"}`,
              borderRadius: 10, padding: "6px 10px", fontSize: 11,
              color: showFilters ? accentColor : "#64748b", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <Filter size={11} /> Filters
              {hasActiveFilters && (
                <span style={{ background: accentColor, color: "#fff", borderRadius: 10, padding: "1px 5px", fontSize: 9 }}>
                  {Object.keys(columnFilters).length + (search ? 1 : 0) + (dateRange.start || dateRange.end ? 1 : 0)}
                </span>
              )}
            </button>

           

            <button onClick={() => setCompactView(!compactView)} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
              padding: "6px 10px", fontSize: 11, color: "#64748b", cursor: "pointer",
            }}>
              {compactView ? "Comfortable" : "Compact"}
            </button>

            {/* Export dropdown */}
            <div style={{ position: "relative" }}>
              <button onClick={() => !isExporting && setShowExportMenu(!showExportMenu)} disabled={isExporting} style={{
                background: `linear-gradient(135deg,${accentColor},${accentColor}CC)`,
                border: "none", borderRadius: 10, padding: "6px 14px",
                fontSize: 11, fontWeight: 600, color: "#fff",
                cursor: isExporting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 5,
                opacity: isExporting ? 0.7 : 1,
              }}>
                {isExporting ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={11} />}
                {exportLabel}
              </button>
              {showExportMenu && !isExporting && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", zIndex: 20, minWidth: 170 }}>
                  <div style={{ padding: "6px 0" }}>
                    {(["csv", "excel", "pdf"] as const).map(fmt => (
                      <button key={fmt} onClick={() => { onExport?.(fmt); setShowExportMenu(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 11 }}>
                        {fmt === "csv" && <FileText size={12} style={{ color: "#059669" }} />}
                        {fmt === "excel" && <FileSpreadsheet size={12} style={{ color: "#16a34a" }} />}
                        {fmt === "pdf" && <FileJson size={12} style={{ color: "#dc2626" }} />}
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                    <div style={{ borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
                    <button onClick={printReport} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 11 }}>
                      <Printer size={12} style={{ color: "#7c3aed" }} /> Print
                    </button>
                    <button onClick={copyToClipboard} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 11 }}>
                      <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button onClick={handleClearAll} style={{
                background: "transparent", border: "1px solid #e2e8f0", borderRadius: 10,
                padding: "6px 10px", fontSize: 11, color: "#ef4444", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <RefreshCw size={11} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters panel */}
        {showFilters && (
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
    {filtersConfig?.map((filter: any, idx: number) => (
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
          value={columnFilters?.[filter.field] || ""}
          onChange={(e) =>
            onColumnFilterChange?.(filter.field, e.target.value)
          }
          placeholder={`Search ${filter.label}`}
          style={{
            padding: "7px 10px",
            fontSize: 12,
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            width: "100%",
            outline: "none",
            transition: "0.2s",
          }}
        />
      </div>
    ))}

    {/* Clear all filters button */}
    <button
      onClick={onClearAllFilters}
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
)}
      </div>

      {/* Selected rows bar */}
      {selectedRows.size > 0 && (
        <div style={{ background: accentLight, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${accentColor}22` }}>
          <span style={{ fontSize: 11, color: accentColor, fontWeight: 500 }}>{selectedRows.size} row(s) selected</span>
          <button onClick={() => setSelectedRows(new Set())} style={{ background: "transparent", border: "none", color: accentColor, fontSize: 10, cursor: "pointer" }}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compactView ? 11 : 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: compactView ? "8px 12px" : "10px 16px", width: 30 }}>
                <input type="checkbox" checked={sortedRows.length > 0 && selectedRows.size === sortedRows.length} onChange={selectAll} style={{ accentColor, cursor: "pointer" }} />
              </th>
              {headers.map((h, idx) => visibleColumns[idx] && (
                <th key={idx} onClick={() => handleSort(idx)} style={{
                  padding: compactView ? "8px 12px" : "10px 16px",
                  textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  whiteSpace: "nowrap", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {h}
                    <ArrowUpDown size={10} style={{ opacity: sortConfig?.key === idx ? 1 : 0.3 }} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr><td colSpan={visibleColumns.filter(Boolean).length + 1} style={{ padding: 50, textAlign: "center", color: "#94a3b8" }}>No matching records found</td></tr>
            ) : (
              sortedRows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: "1px solid #f8fafc", background: selectedRows.has(rIdx) ? accentLight : "transparent" }}
                  onMouseEnter={(e) => { if (!selectedRows.has(rIdx)) e.currentTarget.style.background = "#fafcff"; }}
                  onMouseLeave={(e) => { if (!selectedRows.has(rIdx)) e.currentTarget.style.background = ""; }}>
                  <td style={{ padding: compactView ? "8px 12px" : "10px 16px", textAlign: "center" }}>
                    <input type="checkbox" checked={selectedRows.has(rIdx)} onChange={() => toggleRow(rIdx)} style={{ accentColor, cursor: "pointer" }} />
                  </td>
                  {row.map((cell, cIdx) => visibleColumns[cIdx] && (
                    <td key={cIdx} style={{ padding: compactView ? "8px 12px" : "10px 16px" }}>{renderCell(cell, cIdx)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (server‑side) */}
      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: 10, background: "#fafcff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              Showing {Math.min((page - 1) * rowsPerPage + 1, total)}–{Math.min(page * rowsPerPage, total)} of {total}
            </span>
            <select value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))} style={{ fontSize: 10, padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 6 }}>
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => onPageChange(1)} disabled={page === 1} style={pageBtnStyle(page === 1)}><ChevronLeft size={10} /><ChevronLeft size={10} style={{ marginLeft: -4 }} /></button>
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1} style={pageBtnStyle(page === 1)}><ChevronLeft size={10} /></button>
            {(() => {
              const maxVisible = 5;
              let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
              const endPage = Math.min(totalPages, startPage + maxVisible - 1);
              if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
              const pages = [];
              for (let i = startPage; i <= endPage; i++) pages.push(i);
              return pages.map(p => (
                <button key={p} onClick={() => onPageChange(p)} style={{
                  padding: "4px 10px", border: p === page ? "none" : "1px solid #e2e8f0",
                  borderRadius: 6, background: p === page ? `linear-gradient(135deg,${accentColor},${accentColor}CC)` : "#fff",
                  color: p === page ? "#fff" : "#374151", fontSize: 10, fontWeight: p === page ? 600 : 400, cursor: "pointer",
                }}>{p}</button>
              ));
            })()}
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={pageBtnStyle(page === totalPages)}><ChevronRight size={10} /></button>
            <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} style={pageBtnStyle(page === totalPages)}><ChevronRight size={10} /><ChevronRight size={10} style={{ marginLeft: -4 }} /></button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6,
    background: "#fff", fontSize: 10, cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1, display: "flex", alignItems: "center",
  };
}