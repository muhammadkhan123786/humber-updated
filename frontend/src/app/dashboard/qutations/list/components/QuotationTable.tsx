"use client";
import React from "react";
import { User, Calendar } from "lucide-react";
import ActionButtons from "./ActionButtons";

interface QuotationFromBackend {
  _id: string;
  ticketId: any;
  ticketCode: string;
  quotationStatus: string;
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

interface QuotationTableProps {
  quotations: QuotationFromBackend[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getCustomerName: (quotation: any) => string;
  getTicketNumber: (quotation: any) => string;
  getStatusInfo: (quotation: any) => { name: string; color: string; bgColor: string };
}

const QuotationTable: React.FC<QuotationTableProps> = ({
  quotations,
  onView,
  onEdit,
  onDelete,
  getCustomerName,
  getTicketNumber,
  getStatusInfo,
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

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
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
            quotations.map((quotation) => {
              const statusInfo = getStatusInfo(quotation);
              return (
                <tr
                  key={quotation._id}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <td className="px-4 py-4 ">
                    <span className="font-mono text-xs text-gray-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                      {quotation.quotationAutoId || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-gray-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
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
                    <span className=" font-bold text-indigo-600">
                      {formatCurrency(quotation.netTotal)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-indigo-600">
                      {quotation.ticket.pay_by || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full   text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                    >
                      {statusInfo.name}
                    </span>
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
