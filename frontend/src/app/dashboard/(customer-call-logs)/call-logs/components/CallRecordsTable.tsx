"use client";
import React, { useState } from "react";
import { Eye, UserPlus, FileText, SquarePen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Pagination from "../../../../../components/ui/Pagination";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface CallRecordsTableProps {
  refreshKey?: number; // Optional - ab iski zaroorat nahi, but backward compatibility ke liye rakha
}

// Separate API fetch function
const fetchCallLogs = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const token = localStorage.getItem("token")?.replace(/"/g, "").trim();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(
    `${BASE_URL}/call-logs?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch call logs");
  }

  return response.data;
};

const CallRecordsTable = ({ refreshKey }: CallRecordsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // TanStack Query hook
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["callLogs", currentPage], // Unique key for caching
    queryFn: () => fetchCallLogs({ page: currentPage, limit }),
    staleTime: 30000, // Data is fresh for 30 seconds
    refetchOnWindowFocus: false,
  });

  // If refreshKey changes, refetch data
  React.useEffect(() => {
    if (refreshKey) {
      refetch();
    }
  }, [refreshKey, refetch]);

  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load call logs");
      console.error("Fetch error:", error);
    }
  }, [error]);

  const records = data?.data || [];
  const totalRecords = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(totalRecords / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#E137BF] text-white shadow-sm">
            <FileText size={20} />
          </div>
          <h2 className="text-gray-800 font-bold text-lg">
            Call Records ({totalRecords})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="text-gray-400 text-[13px] font-semibold">
                <th className="px-6 py-4 font-semibold">Call ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Call Type</th>
                <th className="px-6 py-4 font-semibold">Purpose</th>
                <th className="px-6 py-4 font-semibold">Agent</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Priority
                </th>
                <th className="px-6 py-4 text-center font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-20 text-gray-400 italic"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-20 text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                records.map((row: any) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50/40 transition-colors group"
                  >
                    <td className="px-6 py-5 text-sm font-bold text-gray-700">
                      {row.autoCallId}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {row.customerName}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                      {row.phoneNumber}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1 rounded-full text-[11px] font-bold border ${getTypeStyles(row.callTypeId?.callTypeName)}`}
                      >
                        {row.callTypeId?.callTypeName || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 max-w-[200px] truncate">
                      {row.callPurpose}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {row.agentName || "Admin"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {row.callDuration || "00:00"}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span
                          className="px-4 py-1 rounded-full text-[11px] font-bold border"
                          style={{
                            backgroundColor: `${row.priorityLevelId?.backgroundColor}15`,
                            color: row.priorityLevelId?.backgroundColor,
                            borderColor: `${row.priorityLevelId?.backgroundColor}40`,
                          }}
                        >
                          {row.priorityLevelId?.serviceRequestPrioprity
                            ?.charAt(0)
                            .toUpperCase() +
                            row.priorityLevelId?.serviceRequestPrioprity?.slice(
                              1,
                            )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span
                          className={`px-4 py-1 rounded-full text-[11px] font-bold border ${getStatusStyles(row.callStatusId?.callStatus)}`}
                        >
                          {row.callStatusId?.callStatus
                            ?.charAt(0)
                            .toUpperCase() +
                            row.callStatusId?.callStatus?.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[12px] text-gray-500 leading-tight">
                        <div className="font-semibold text-gray-600">
                          {new Date(row.createdAt).toISOString().split("T")[0]}
                        </div>
                        <div>
                          {new Date(row.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-all">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
                          <SquarePen size={16} />
                        </button>
                        <button className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-all">
                          <UserPlus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const getTypeStyles = (type: string) => {
  const t = type?.toLowerCase();
  if (t === "support") return "bg-blue-50 text-blue-500 border-blue-200";
  if (t === "inquiry") return "bg-indigo-50 text-indigo-500 border-indigo-200";
  if (t === "complaint") return "bg-sky-50 text-sky-500 border-sky-200";
  return "bg-gray-50 text-gray-500 border-gray-200";
};

const getStatusStyles = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "resolved") return "bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]";
  if (s === "in progress")
    return "bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]";
  if (s === "escalated") return "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]";
  return "bg-gray-50 text-gray-500 border-gray-200";
};

export default CallRecordsTable;
