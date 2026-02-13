"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Eye,
  Trash2,
  Search,
  FileText,
  CheckCircle,
  File,
  AlertCircle,
  User,
  Calendar,
  Edit,
  Loader2,
} from "lucide-react";

import { getAlls } from "../../../../helper/apiHelper";
import Pagination from "../../../../components/ui/Pagination";

const QuotationTable: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({
    sent: 0,
    approved: 0,
    draft: 0,
    rejected: 0,
  });
  const fetchStatusOptions = useCallback(async () => {
    try {
      const response = await getAlls<any>("ticket-quotation-status");
      const data = (response as any).data || [];
      setStatusOptions(data);
    } catch (error) {
      console.error("Failed to fetch status options:", error);
    }
  }, []);

  const fetchQuotations = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await getAlls<any>("technician-ticket-quotation", {
        page,
        limit: 10,
      });
      const fetchedData = (response as any).data || [];
      const paginationInfo = (response as any).pagination || {};

      setQuotations(fetchedData);
      setTotalPages(paginationInfo.pages || 1);

      const newCounts = fetchedData.reduce(
        (acc: any, item: any) => {
          const status = item.quotationStatus?.toLowerCase();
          if (acc.hasOwnProperty(status)) {
            acc[status] = (acc[status] || 0) + 1;
          }
          return acc;
        },
        { sent: 0, approved: 0, draft: 0, rejected: 0 },
      );

      setCounts(newCounts);
    } catch (error) {
      console.error("Failed to fetch quotations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatusOptions();
    fetchQuotations(currentPage);
  }, [currentPage, fetchQuotations, fetchStatusOptions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusDropdownStyle = (status: string): string => {
    const styles: Record<string, string> = {
      sent: "bg-blue-50 text-blue-500 border-blue-200",
      approved: "bg-green-50 text-green-500 border-green-200",
      draft: "bg-gray-50 text-gray-500 border-gray-200",
      rejected: "bg-red-50 text-red-500 border-red-200",
    };
    return styles[status?.toLowerCase()] || styles["draft"];
  };

  return (
    <div className="p-8 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-600 min-h-screen">
      <div className="h-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-md" />
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-sm border border-slate-200 p-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <div className="leading-none flex items-center gap-2 font-bold">
            <FileText size={20} className="text-[#6366F1]" />
            All Quotations
          </div>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold border border-slate-200">
            {quotations.length} items on this page
          </span>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by quotation number..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#8B5CF6] text-white">
                <th className="px-4 py-3 text-sm font-semibold">
                  Quotation No.
                </th>
                <th className="px-4 py-3 text-sm font-semibold">Ticket No.</th>
                <th className="px-4 py-3 text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-sm font-semibold">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-sm font-semibold">Decision</th>
                <th className="px-4 py-3 text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={18} /> Loading
                      data...
                    </div>
                  </td>
                </tr>
              ) : quotations.length > 0 ? (
                quotations.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 font-mono text-xs rounded-md">
                        {row.quotationAutoId}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-50 px-2 py-1 font-medium rounded border border-slate-200 text-[11px] text-slate-500 uppercase">
                        {row.ticket?.ticketCode || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        {row.customer?.firstName || "Unknown"}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(row.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-[#4F46E5] font-bold text-base">
                      £{row.netTotal?.toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-medium">
                      {row.ticket?.decision || "N/A"}
                    </td>
                    <td className="p-4">
                      <select
                        defaultValue={row.quotationStatus}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider focus:outline-none cursor-pointer ${getStatusDropdownStyle(row.quotationStatus)}`}
                      >
                        {statusOptions.length > 0 ? (
                          statusOptions.map((opt: any) => (
                            <option
                              key={opt._id}
                              value={opt.ticketQuationStatus}
                            >
                              {opt.ticketQuationStatus}
                            </option>
                          ))
                        ) : (
                          <option value={row.quotationStatus}>
                            {row.quotationStatus}
                          </option>
                        )}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50">
                          <Edit size={14} />
                        </button>
                        <button className="p-1.5 border border-red-200 text-red-500 rounded-md hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    No quotations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <div className="grid grid-cols-4 gap-4 mt-8">
          <SummaryCard
            icon={<FileText size={16} />}
            label="Sent"
            count={counts.sent.toString()}
            color="blue"
          />
          <SummaryCard
            icon={<CheckCircle size={16} />}
            label="Approved"
            count={counts.approved.toString()}
            color="green"
          />
          <SummaryCard
            icon={<File size={16} />}
            label="Draft"
            count={counts.draft.toString()}
            color="slate"
          />
          <SummaryCard
            icon={<AlertCircle size={16} />}
            label="Rejected"
            count={counts.rejected.toString()}
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  icon: React.ReactNode;
  label: string;
  count: string;
  color: "blue" | "green" | "slate" | "red";
}

const SummaryCard: React.FC<CardProps> = ({ icon, label, count, color }) => {
  const colors = {
    blue: {
      container: "bg-[#EFF6FF] border-[#DBEAFE]",
      iconText: "text-[#2563EB]",
      count: "text-[#1E40AF]",
    },
    green: {
      container: "bg-[#F0FDF4] border-[#DCFCE7]",
      iconText: "text-[#16A34A]",
      count: "text-[#166534]",
    },
    slate: {
      container: "bg-[#F8FAFC] border-[#E2E8F0]",
      iconText: "text-[#475569]",
      count: "text-[#1E293B]",
    },
    red: {
      container: "bg-[#FEF2F2] border-[#FEE2E2]",
      iconText: "text-[#DC2626]",
      count: "text-[#991B1B]",
    },
  };
  const style = colors[color];
  return (
    <div className={`p-4 rounded-xl border ${style.container}`}>
      <div
        className={`flex items-center gap-2 text-xs font-bold mb-2 ${style.iconText}`}
      >
        {icon} {label}
      </div>
      <div className={`text-2xl font-bold ${style.count}`}>{count}</div>
    </div>
  );
};

export default QuotationTable;
