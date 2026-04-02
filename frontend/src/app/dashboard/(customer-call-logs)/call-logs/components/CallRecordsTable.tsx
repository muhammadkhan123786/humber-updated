"use client";
import React, { useState, useRef } from "react";
import {
  FileText,
  SquarePen,
  Trash2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Pagination from "../../../../../components/ui/Pagination";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface CallRecordsTableProps {
  refreshKey?: number;
  onEdit: (record: any) => void;
  filters?: {
    search?: string;
    status?: string;
    callType?: string;
    date?: string;
  };
  callStatuses?: any[];
}

const fetchCallLogs = async ({
  page,
  limit,
  search,
  status,
  callType,
  date,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  callType?: string;
  date?: string;
}) => {
  const token = localStorage.getItem("token")?.replace(/"/g, "").trim();
  if (!token) throw new Error("No authentication token found");

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search && search.trim()) {
    params.append("search", search.trim());
  }
  if (status && status !== "all") {
    params.append("callStatusId", status);
  }
  if (callType && callType !== "all") {
    params.append("callTypeId", callType);
  }
  if (date && date.trim()) {
    params.append("followUpDate", date.trim());
  }

  const response = await axios.get(
    `${BASE_URL}/call-logs?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch call logs");
  }
  return response.data;
};

const CallRecordsTable = ({
  refreshKey,
  onEdit,
  filters,
  callStatuses = [],
}: CallRecordsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const limit = 10;
  const queryClient = useQueryClient();
  const prevFiltersRef = useRef(filters);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["callLogs", currentPage, filters],
    queryFn: () =>
      fetchCallLogs({
        page: currentPage,
        limit,
        search: filters?.search,
        status: filters?.status,
        callType: filters?.callType,
        date: filters?.date,
      }),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, statusId }: { id: string; statusId: string }) => {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();

      const currentRecord = records.find((r: any) => r._id === id);
      if (!currentRecord) throw new Error("Record not found");

      const payload = {
        customerName: currentRecord.customerName,
        phoneNumber: currentRecord.phoneNumber,
        address: currentRecord.address || "",
        postCode: currentRecord.postCode || "",
        city: currentRecord.city || "",
        callTypeId: currentRecord.callTypeId?._id || currentRecord.callTypeId,
        priorityLevelId:
          currentRecord.priorityLevelId?._id || currentRecord.priorityLevelId,
        callStatusId: statusId,
        agentName: currentRecord.agentName,
        callPurpose: currentRecord.callPurpose,
        callDuration: currentRecord.callDuration || 0,
        callNotes: currentRecord.callNotes || "",
        followUpDate: currentRecord.followUpDate || null,
        followUpTime: currentRecord.followUpTime || null,
        followUpNotes: currentRecord.followUpNotes || "",
        userId: currentRecord.userId?._id || currentRecord.userId,
      };
      return await axios.put(`${BASE_URL}/call-logs/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["callLogs"] });
      setUpdatingStatusId(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
      setUpdatingStatusId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();
      return await axios.delete(`${BASE_URL}/call-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["callLogs"] });
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete record");
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, newStatusId: string) => {
    setUpdatingStatusId(id);
    updateStatusMutation.mutate({ id, statusId: newStatusId });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    if (refreshKey) refetch();
  }, [refreshKey, refetch]);

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load call logs");
    }
  }, [error]);
  React.useEffect(() => {
    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged) {
      setCurrentPage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  const records = data?.data || [];
  const totalRecords = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(totalRecords / limit);

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const formatFollowUpDate = (date: any) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString();
    } catch {
      return "N/A";
    }
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
              <tr className="text-gray-400 text-[13px] font-semibold bg-gray-50/50">
                <th className="px-6 py-4">Call ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Call Type</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4">Call Duration</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Follow-Up Date</th>
                {/* <th className="px-6 py-4">Created Date</th> */}
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2
                        className="animate-spin text-purple-600"
                        size={32}
                      />
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
                    <td className="px-6 py-5 text-sm text-gray-500 max-w-[150px] truncate">
                      {row.callPurpose || "N/A"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {row.agentName || "Admin"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {row.callDuration || "N/A"}
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
                          {row.priorityLevelId?.serviceRequestPrioprity ||
                            "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative min-w-[120px]">
                        <select
                          value={row.callStatusId?._id || ""}
                          onChange={(e) =>
                            handleStatusChange(row._id, e.target.value)
                          }
                          disabled={updatingStatusId === row._id}
                          className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all appearance-none cursor-pointer"
                        >
                          {callStatuses.map((status: any) => (
                            <option key={status._id} value={status._id}>
                              {status.callStatus}
                            </option>
                          ))}
                        </select>
                        {updatingStatusId === row._id ? (
                          <Loader2
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-purple-600"
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-600 font-medium">
                        {formatFollowUpDate(row.followUpDate)}
                      </div>
                    </td>
                    {/* <td className="px-6 py-5">
                      <div className="text-[12px] text-gray-500 leading-tight">
                        <div className="font-semibold text-gray-600">
                          {formatDate(row.createdAt)}
                        </div>
                        <div>
                          {new Date(row.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td> */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-all"
                        >
                          <SquarePen size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          disabled={deletingId === row._id}
                          className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-all disabled:opacity-50"
                        >
                          {deletingId === row._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const getTypeStyles = (type: string) => {
  const t = type?.toLowerCase();
  if (t === "support") return "bg-blue-50 text-blue-500 border-blue-200";
  if (t === "inquiry") return "bg-indigo-50 text-indigo-500 border-indigo-200";
  if (t === "complaint") return "bg-red-50 text-red-500 border-red-200";
  return "bg-gray-50 text-gray-500 border-gray-200";
};

export default CallRecordsTable;
