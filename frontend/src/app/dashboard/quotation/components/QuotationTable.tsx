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
import toast from "react-hot-toast";

interface QuotationStatus {
  _id: string;
  ticketQuationStatus: string;
}

interface StatusCard {
  _id: string;
  name: string;
  count: number;
  color: "blue" | "green" | "slate" | "red" | "purple" | "orange" | "teal";
  icon: React.ReactNode;
}

const getStatusColor = (
  statusName: string,
): "blue" | "green" | "slate" | "red" | "purple" | "orange" | "teal" => {
  const name = statusName.toLowerCase();

  if (name.includes("sent") || name.includes("pending")) return "blue";
  if (name.includes("approve") || name.includes("complete")) return "green";
  if (name.includes("draft")) return "slate";
  if (name.includes("reject") || name.includes("cancel")) return "red";
  if (name.includes("review") || name.includes("check")) return "purple";
  if (name.includes("wait") || name.includes("hold")) return "orange";
  if (name.includes("process")) return "teal";

  return "slate";
};
const getStatusIcon = (statusName: string): React.ReactNode => {
  const name = statusName.toLowerCase();

  if (name.includes("sent") || name.includes("pending"))
    return <FileText size={18} />;
  if (name.includes("approve") || name.includes("complete"))
    return <CheckCircle size={18} />;
  if (name.includes("draft")) return <File size={18} />;
  if (name.includes("reject") || name.includes("cancel"))
    return <AlertCircle size={18} />;

  return <FileText size={18} />;
};

const QuotationTable: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<QuotationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusCards, setStatusCards] = useState<StatusCard[]>([]);

  const ENDPOINT = "/update-technician-quotation-status";

  const fetchStatusOptions = useCallback(async () => {
    try {
      const response = await getAlls<any>(
        "/ticket-quotation-status?filter=all",
      );
      const data = (response as any).data || [];
      setStatusOptions(data);
    } catch (error) {
      console.error("Failed to fetch status options:", error);
      toast.error("Failed to load status options");
    }
  }, []);

  const calculateStatusCounts = useCallback(
    (data: any[], statusList: QuotationStatus[]) => {
      const countMap = new Map<string, number>();
      statusList.forEach((status) => {
        countMap.set(status._id, 0);
      });

      data.forEach((item: any) => {
        let statusId = "";

        if (item.quotationStatusId) {
          if (
            typeof item.quotationStatusId === "object" &&
            item.quotationStatusId._id
          ) {
            statusId = item.quotationStatusId._id;
          } else if (typeof item.quotationStatusId === "string") {
            statusId = item.quotationStatusId;
          }
        }

        if (statusId && countMap.has(statusId)) {
          countMap.set(statusId, (countMap.get(statusId) || 0) + 1);
        }
      });

      const cards: StatusCard[] = statusList.map((status) => ({
        _id: status._id,
        name: status.ticketQuationStatus,
        count: countMap.get(status._id) || 0,
        color: getStatusColor(status.ticketQuationStatus),
        icon: getStatusIcon(status.ticketQuationStatus),
      }));

      setStatusCards(cards);
    },
    [],
  );

  const fetchQuotations = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await getAlls<any>("/technician-ticket-quotation", {
          page,
          limit: 10,
        });

        const fetchedData = (response as any).data || [];
        const paginationInfo = (response as any).pagination || {};

        setQuotations(fetchedData);
        setTotalPages(paginationInfo.pages || 1);
        setTotalItems(paginationInfo.total || fetchedData.length);

        if (statusOptions.length > 0) {
          calculateStatusCounts(fetchedData, statusOptions);
        }
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
        toast.error("Failed to load quotations");
      } finally {
        setLoading(false);
      }
    },
    [statusOptions, calculateStatusCounts],
  );

  useEffect(() => {
    fetchStatusOptions();
  }, [fetchStatusOptions]);

  useEffect(() => {
    if (statusOptions.length > 0) {
      fetchQuotations(currentPage);
    }
  }, [currentPage, statusOptions, fetchQuotations]);

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
    console.log(currentStatus);

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
        setTimeout(() => {
          setQuotations((currentQuotations) => {
            calculateStatusCounts(currentQuotations, statusOptions);
            return currentQuotations;
          });
        }, 100);
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

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-4";
    if (count >= 5) return "grid-cols-5";
    return "grid-cols-4";
  };

  return (
    <div className="p-8 bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 text-slate-600 min-h-screen">
      <div className="h-2 bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-t-lg mb-6" />

      {statusCards.length > 0 && (
        <div className={`grid ${getGridCols(statusCards.length)} gap-6 mb-8`}>
          {statusCards.map((card) => (
            <SummaryCard
              key={card._id}
              icon={card.icon}
              label={card.name}
              count={card.count.toString()}
              color={card.color}
              total={totalItems}
            />
          ))}
        </div>
      )}
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
            {quotations.length} of {totalItems} items
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
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
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
              ) : quotations.length > 0 ? (
                quotations.map((row) => {
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

interface CardProps {
  icon: React.ReactNode;
  label: string;
  count: string;
  color: "blue" | "green" | "slate" | "red" | "purple" | "orange" | "teal";
  total: number;
}

const SummaryCard: React.FC<CardProps> = ({
  icon,
  label,
  count,
  color,
  total,
}) => {
  const colors = {
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      shadow: "shadow-blue-500/20",
    },
    green: {
      gradient: "from-emerald-500 to-green-600",
      bgLight: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      shadow: "shadow-green-500/20",
    },
    slate: {
      gradient: "from-slate-500 to-gray-600",
      bgLight: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      shadow: "shadow-slate-500/20",
    },
    red: {
      gradient: "from-rose-500 to-red-600",
      bgLight: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      shadow: "shadow-red-500/20",
    },
    purple: {
      gradient: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
      shadow: "shadow-purple-500/20",
    },
    orange: {
      gradient: "from-orange-500 to-amber-600",
      bgLight: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      shadow: "shadow-orange-500/20",
    },
    teal: {
      gradient: "from-teal-500 to-cyan-600",
      bgLight: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-200",
      shadow: "shadow-teal-500/20",
    },
  };

  const style = colors[color];
  const percentage =
    total > 0 ? Math.round((parseInt(count) / total) * 100) : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${style.gradient} p-6 shadow-xl ${style.shadow} transform hover:scale-105 transition-all duration-300`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <div className="text-white">{icon}</div>
          </div>
          <span className="text-white/80 text-sm font-medium">
            {percentage}%
          </span>
        </div>

        <div className="text-white/90 text-sm font-medium mb-1">{label}</div>
        <div className="text-3xl font-bold text-white mb-2">{count}</div>

        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-2 text-white/60 text-xs">out of {total} total</div>
      </div>
    </div>
  );
};

export default QuotationTable;
