// components/reports/ProfessionalTable/TablePagination.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  accentColor: string;
}

export function TablePagination({
  page,
  totalPages,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  accentColor,
}: TablePaginationProps) {
  const pageBtnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: "4px 8px",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: "#fff",
    fontSize: 10,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
  });

  return (
    <div
      style={{
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid #f1f5f9",
        flexWrap: "wrap",
        gap: 10,
        background: "#fafcff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          Showing {Math.min((page - 1) * rowsPerPage + 1, total)}–
          {Math.min(page * rowsPerPage, total)} of {total}
        </span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          style={{
            fontSize: 10,
            padding: "3px 6px",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          style={pageBtnStyle(page === 1)}
        >
          <ChevronLeft size={10} />
          <ChevronLeft size={10} style={{ marginLeft: -4 }} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={pageBtnStyle(page === 1)}
        >
          <ChevronLeft size={10} />
        </button>
        {(() => {
          const maxVisible = 5;
          let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
          const endPage = Math.min(totalPages, startPage + maxVisible - 1);
          if (endPage - startPage + 1 < maxVisible)
            startPage = Math.max(1, endPage - maxVisible + 1);
          const pages = [];
          for (let i = startPage; i <= endPage; i++) pages.push(i);
          return pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                padding: "4px 10px",
                border: p === page ? "none" : "1px solid #e2e8f0",
                borderRadius: 6,
                background:
                  p === page
                    ? `linear-gradient(135deg,${accentColor},${accentColor}CC)`
                    : "#fff",
                color: p === page ? "#fff" : "#374151",
                fontSize: 10,
                fontWeight: p === page ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ));
        })()}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={pageBtnStyle(page === totalPages)}
        >
          <ChevronRight size={10} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          style={pageBtnStyle(page === totalPages)}
        >
          <ChevronRight size={10} />
          <ChevronRight size={10} style={{ marginLeft: -4 }} />
        </button>
      </div>
    </div>
  );
}