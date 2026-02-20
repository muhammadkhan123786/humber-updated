"use client";
import React from "react";
import { User, Calendar } from "lucide-react";
import ActionButtons from "./ActionButtons";

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
    [key: string]: any;
  };
  labourTime?: number;
  labourRate?: number;
  partTotalBill?: number;
  labourTotalBill?: number;
  subTotalBill?: number;
  taxAmount?: number;
  netTotal?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface QuotationStatus {
  _id: string;
  ticketQuationStatus: string;
  statusColor: string;
  statusIcon?: string;
  isActive: boolean;
  canChooseTechnician?: boolean;
}

interface QuotationTableProps {
  quotations: QuotationFromBackend[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getCustomerName: (quotation: any) => string;
  getTicketNumber: (quotation: any) => string;
  getStatusInfo: (quotation: any) => { name: string; color: string; bgColor: string; statusColor?: string };
  quotationStatuses: QuotationStatus[];
  onStatusChange: (quotationId: string, newStatusId: string) => void;
}

const QuotationTable: React.FC<QuotationTableProps> = ({
  quotations,
  onView,
  onEdit,
  onDelete,
  getCustomerName,
  getTicketNumber,
  getStatusInfo,
  quotationStatuses,
 
}) => {
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

  // Get color styling based on status name
  const getStatusColors = (statusName: string) => {
    const statusLower = String(statusName || '').toLowerCase();

    if (statusLower.includes("sent") || statusLower.includes("send")) {
      return {
        bgColor: "#3B82F620", // Blue with 12% opacity
        textColor: "#1E40AF",
        borderColor: "#3B82F6",
      };
    } else if (statusLower.includes("approved") || statusLower.includes("approve")) {
      return {
        bgColor: "#10B98120", // Green with 12% opacity
        textColor: "#047857",
        borderColor: "#10B981",
      };
    } else if (statusLower.includes("draft")) {
      return {
        bgColor: "#6B728020", // Gray with 12% opacity
        textColor: "#374151",
        borderColor: "#6B7280",
      };
    } else if (statusLower.includes("reject")) {
      return {
        bgColor: "#EF444420", // Red with 12% opacity
        textColor: "#B91C1C",
        borderColor: "#EF4444",
      };
    }

    return {
      bgColor: "#F3F4F6",
      textColor: "#6B7280",
      borderColor: "#E5E7EB",
    };
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
            <th className="px-4 py-5  text-left text-sm font-semibold">
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
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="text-lg font-medium">No quotations found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            quotations.map((quotation, index) => {
              const statusInfo = getStatusInfo(quotation);
              
              // Find the current status ID from quotation status name if not set
              const currentStatusId = quotation.quotationStatusId || quotationStatuses.find(
                s => s.ticketQuationStatus?.toLowerCase() === quotation.quotationStatus?.toLowerCase()
              )?._id || '';
              
              // Find the current status object
              const currentStatus = quotationStatuses.find(s => s._id === currentStatusId);
              
              // Get colors based on current status name
              const statusColors = getStatusColors(currentStatus?.ticketQuationStatus || quotation.quotationStatus || '');
              
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
                  <td className="px-4 py-4">
                    <span className=" font-bold text-indigo-600 whitespace-nowrap">
                      {formatCurrency(quotation.netTotal)}
                    </span>
                  </td>
                  <td className="px-4 py-4 ">
                    <span className="text-sm font-medium text-indigo-600 whitespace-nowrap">
                      {quotation?.ticket?.decision || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                   <span className="text-xs bg-blue-50 border border-blue-200 px-1.5 py-1 rounded-full font-medium text-indigo-600 whitespace-nowrap">
                      {quotation?.quotationStatus || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <ActionButtons
                      onView={() => onView(quotation._id)}
                      onEdit={() => onEdit(quotation._id)}
                      onDelete={() => onDelete(quotation._id)}
                      isEditDisabled={quotation.quotationStatus?.toLowerCase().includes('approve') || false}
                      isDeleteDisabled={quotation.quotationStatus?.toLowerCase().includes('approve') || false}
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
