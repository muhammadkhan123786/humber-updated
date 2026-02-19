"use client";
import React from "react";
import { User, Calendar } from "lucide-react";
import ActionButtons from "./ActionButtons";

export const QUOTATION_STATUS = [
  "SENT TO ADMIN",
  "SEND TO CUSTOMER",
  "SEND TO INSURANCE",
  "APPROVED",
  "REJECTED",
] as const;

interface QuotationFromBackend {
  _id: string;
  ticketId: any;
  ticketCode: string;
  quotationStatus: string;
  quotationStatusId?: string;
  quotationAutoId?: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  ticket: {
    _id: string;
    ticketCode: string;
    decision?: string;
    [key: string]: any;
  };
  netTotal?: number;
  createdAt?: string;
}

interface QuotationTableProps {
  quotations: QuotationFromBackend[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getCustomerName: (quotation: any) => string;
  getTicketNumber: (quotation: any) => string;
  onStatusChange: (quotationId: string, newStatus: string) => void;
}

const QuotationTable: React.FC<QuotationTableProps> = ({
  quotations,
  onView,
  onEdit,
  onDelete,
  getCustomerName,
  getTicketNumber,
  onStatusChange,
}) => {
  const dropdownStatuses = QUOTATION_STATUS.filter(
    (status) => status !== "SENT TO ADMIN",
  );
  const formatStatusLabel = (status: string) => {
    const upper = status?.toUpperCase();

    const statusMap: Record<string, string> = {
      "SEND TO CUSTOMER": "SENT TO CUSTOMER",
      "SEND TO INSURANCE": "SENT TO INSURANCE",
    };

    return statusMap[upper] || upper;
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "£ 0.00";
    return `£ ${amount.toFixed(2)}`;
  };

  const getStatusColors = (statusName: string) => {
    const statusUpper = String(statusName || "").toUpperCase();

    if (
      statusUpper.includes("CUSTOMER") ||
      statusUpper.includes("INSURANCE") ||
      statusUpper.includes("ADMIN")
    ) {
      return {
        bgColor: "#3B82F620",
        textColor: "#1E40AF",
        borderColor: "#3B82F6",
      };
    } else if (statusUpper === "APPROVED") {
      return {
        bgColor: "#10B98120",
        textColor: "#047857",
        borderColor: "#10B981",
      };
    } else if (statusUpper === "REJECTED") {
      return {
        bgColor: "#EF444420",
        textColor: "#B91C1C",
        borderColor: "#EF4444",
      };
    }
    return { bgColor: "#F3F4F6", textColor: "#6B7280", borderColor: "#E5E7EB" };
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm animate-slideUp">
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animate-row {
          animation: fadeInRow 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <table className="w-full">
        <thead>
          <tr className="bg-linear-to-r from-indigo-500 to-purple-500 text-white">
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Quotation No.
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Ticket No.
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Customer Name
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Created Date
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Total Amount
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Pay By
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-4 py-5 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quotations.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                No quotations found
              </td>
            </tr>
          ) : (
            quotations.map((quotation, index) => {
              const currentStatus =
                quotation.quotationStatus?.toUpperCase() || "";
              const colors = getStatusColors(currentStatus);

              return (
                <tr
                  key={quotation._id}
                  className="hover:bg-indigo-50 transition-all duration-200 animate-row"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-3 py-4">
                    <span className="font-mono text-xs text-gray-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 whitespace-nowrap">
                      {quotation.quotationAutoId || "N/A"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="font-mono text-xs text-gray-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 whitespace-nowrap">
                      {getTicketNumber(quotation)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {getCustomerName(quotation)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(quotation.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-indigo-600">
                    {formatCurrency(quotation.netTotal)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-indigo-600 capitalize">
                    {quotation?.ticket?.decision || "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        onStatusChange(quotation._id, e.target.value)
                      }
                      className="px-2 py-1 rounded-full text-[10px] font-bold border focus:outline-none transition-all cursor-pointer text-center uppercase min-w-[140px]"
                      style={{
                        backgroundColor: colors.bgColor,
                        color: colors.textColor,
                        borderColor: colors.borderColor,
                      }}
                    >
                      {!dropdownStatuses.includes(currentStatus as any) &&
                        currentStatus !== "" && (
                          <option value={currentStatus}>
                            {formatStatusLabel(currentStatus)}
                          </option>
                        )}

                      {dropdownStatuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-white text-black"
                        >
                          {formatStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <ActionButtons
                      onView={() => onView(quotation._id)}
                      onEdit={() => onEdit(quotation._id)}
                      onDelete={() => onDelete(quotation._id)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuotationTable;
