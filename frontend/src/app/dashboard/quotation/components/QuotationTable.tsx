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
import { getAlls, updateItem } from "../../../../helper/apiHelper";
import Pagination from "../../../../components/ui/Pagination";
import Cards from "../../qutations/list/components/Cards";
import toast from "react-hot-toast";

interface QuotationStatus {
  _id: string;
  ticketQuationStatus: string;
}

interface StatusCount {
  status: string;
  count: number;
}

const QuotationTable: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<QuotationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);

  const ENDPOINT = "/update-technician-quotation-status";

  const fetchAllQuotationsForCounts = useCallback(async () => {
    try {
      const response = await getAlls<any>("/technician-ticket-quotation", {
        limit: 1000,
        page: 1,
      });
      return (response as any).data || [];
    } catch (error) {
      console.error("Failed to fetch all quotations:", error);
      return [];
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setInitialLoading(true);

      const statusResponse = await getAlls<any>(
        "/ticket-quotation-status?filter=all",
      );
      const statusData = (statusResponse as any).data || [];
      setStatusOptions(statusData);

      const allQuotations = await fetchAllQuotationsForCounts();
      setTotalItems(allQuotations.length);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("Failed to load data");
    } finally {
      setInitialLoading(false);
    }
  }, [fetchAllQuotationsForCounts]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const fetchQuotations = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await getAlls<any>("/technician-ticket-quotation", {
        page,
        limit: 10,
      });

      const fetchedData = (response as any).data || [];
      const paginationInfo = (response as any).pagination || {};

      setQuotations(fetchedData);
      setFilteredQuotations(fetchedData);
      setTotalPages(paginationInfo.pages || 1);
    } catch (error) {
      console.error("Failed to fetch quotations:", error);
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      fetchQuotations(currentPage);
    }
  }, [currentPage, initialLoading, fetchQuotations]);
  useEffect(() => {
    let filtered = [...quotations];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.quotationAutoId?.toLowerCase().includes(query) ||
          q.ticket?.ticketCode?.toLowerCase().includes(query) ||
          q.customer?.firstName?.toLowerCase().includes(query) ||
          q.customer?.lastName?.toLowerCase().includes(query),
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((q) => {
        const statusName = q.quotationStatus || "";
        return statusName.toLowerCase() === selectedStatus.toLowerCase();
      });
    }

    setFilteredQuotations(filtered);
  }, [searchQuery, selectedStatus, quotations]);

  const getStatusCounts = (): StatusCount[] => {
    const counts: { [key: string]: number } = {};
    quotations.forEach((q) => {
      const statusName = q.quotationStatus || "Unknown";
      counts[statusName] = (counts[statusName] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  };

  const handleFilterByStatus = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus("");
    } else {
      setSelectedStatus(status);
    }
    setCurrentPage(1);
  };

  const getCurrentStatusId = (quotation: any): string => {
    if (!quotation.quotationStatusId) return "";
    if (
      typeof quotation.quotationStatusId === "object" &&
      quotation.quotationStatusId?._id
    ) {
      return quotation.quotationStatusId._id;
    }
    if (typeof quotation.quotationStatusId === "string") {
      return quotation.quotationStatusId;
    }
    return "";
  };

  const findStatusIdByName = (statusName: string): string => {
    const status = statusOptions.find(
      (opt) =>
        opt.ticketQuationStatus?.toLowerCase() === statusName?.toLowerCase(),
    );
    return status?._id || "";
  };

  const handleStatusChange = async (
    quotationId: string,
    statusId: string,
    currentStatus: string,
  ) => {
    if (!statusId) {
      toast.error("Please select a valid status");
      return;
    }

    try {
      setUpdatingId(quotationId);

      const payload = {
        techncianQuotationId: quotationId,
        techncianQuotationStatusId: statusId,
      };

      const response = await updateItem<any>(ENDPOINT, "", payload);

      if (response?.success) {
        toast.success("Status updated successfully!");

        setQuotations((prevQuotations) =>
          prevQuotations.map((q) =>
            q._id === quotationId
              ? {
                  ...q,
                  quotationStatusId: statusId,
                  quotationStatus:
                    statusOptions.find((opt) => opt._id === statusId)
                      ?.ticketQuationStatus || q.quotationStatus,
                }
              : q,
          ),
        );
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusDropdownStyle = (status: string): string => {
    const styles: Record<string, string> = {
      sent: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border-blue-200",
      approved:
        "bg-gradient-to-r from-green-50 to-green-100 text-green-600 border-green-200",
      draft:
        "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-gray-200",
      rejected:
        "bg-gradient-to-r from-red-50 to-red-100 text-red-600 border-red-200",
    };
    return styles[status?.toLowerCase()] || styles["draft"];
  };

  if (initialLoading) {
    return (
      <div className="p-8 bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 text-slate-600 min-h-screen flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-indigo-600" />
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-slate-600 min-h-screen overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm animate-slideUp">
      <div className="h-2  rounded-t-lg mb-6" />
      <Cards
        statusCounts={getStatusCounts()}
        onFilterByStatus={handleFilterByStatus}
      />

      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div className="leading-none flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-500 rounded-lg">
              <FileText size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              All Quotations
            </h2>
          </div>
          <span className="bg-linear-to-r from-slate-100 to-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200">
            {filteredQuotations.length} of {totalItems} items
          </span>
        </div>
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quotation number, ticket ID, or customer name..."
            className="w-full pl-10 pr-4 py-3 bg-[#f3f4f6] h-12 rounded-lg placeholder:text-[#6b7280] text-sm focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
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
              ) : filteredQuotations.length > 0 ? (
                filteredQuotations.map((row) => {
                  const isUpdating = updatingId === row._id;
                  let currentStatusId = getCurrentStatusId(row);
                  if (!currentStatusId && row.quotationStatus) {
                    currentStatusId = findStatusIdByName(row.quotationStatus);
                  }

                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-linear-to-r hover:from-slate-50 hover:to-indigo-50/30 transition-all duration-200"
                    >
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 bg-linear-to-r from-indigo-50 to-purple-50 font-mono text-xs font-semibold rounded-full border border-indigo-200">
                          {row.quotationAutoId}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-linear-to-r from-slate-50 to-slate-100 px-3 py-1 font-medium rounded-full border border-slate-200 text-[11px] text-slate-600 uppercase">
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
                          {new Date(row.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-base bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        £{row.netTotal?.toFixed(2)}
                      </td>
                      <td className="p-4 text-slate-600 text-sm font-medium">
                        {row.ticket?.decision || "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={currentStatusId}
                            onChange={(e) =>
                              handleStatusChange(
                                row._id,
                                e.target.value,
                                row.quotationStatus,
                              )
                            }
                            disabled={isUpdating}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer transition-all ${getStatusDropdownStyle(
                              row.quotationStatus,
                            )} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <option value="">Select Status</option>
                            {statusOptions.length > 0 ? (
                              statusOptions.map((opt: QuotationStatus) => (
                                <option key={opt._id} value={opt._id}>
                                  {opt.ticketQuationStatus}
                                </option>
                              ))
                            ) : (
                              <option value={row.quotationStatus}>
                                {row.quotationStatus}
                              </option>
                            )}
                          </select>
                          {isUpdating && (
                            <Loader2
                              size={14}
                              className="animate-spin text-indigo-600"
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 transition-all">
                            <Eye size={14} />
                          </button>
                          <button className="p-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 transition-all">
                            <Edit size={14} />
                          </button>
                          <button className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-linear-to-r hover:from-red-50 hover:to-orange-50 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
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
      </div>
    </div>
  );
};

export default QuotationTable;
