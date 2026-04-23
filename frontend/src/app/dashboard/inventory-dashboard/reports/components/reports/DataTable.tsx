// components/reports/DataTable.tsx
"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchTerm?: string;
}

export default function DataTable({ columns, data, searchTerm = "" }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col =>
        String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData?.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math?.ceil(sortedData?.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (!columns.find(col => col.key === key)?.sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      if (value.toString().includes('.')) {
        return value.toFixed(2);
      }
      return value.toLocaleString();
    }
    if (typeof value === 'string' && value.startsWith('$')) {
      return value;
    }
    return value;
  };

  const getStatusBadge = (value: string) => {
    if (value === "Critical" || value === "Low") {
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{value}</span>;
    }
    return formatValue(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            {columns?.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`text-left py-3 px-4 text-sm font-semibold text-slate-700 ${col.sortable ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortConfig?.key === col.key && (
                    sortConfig.direction === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-2.5 px-4 text-sm text-slate-600">
                  {col.key === "stockStatus" ? getStatusBadge(row[col.key]) : formatValue(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}