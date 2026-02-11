"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
  Wrench,
  Package,
  DollarSign,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

// Add custom animations
const animations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`;

interface Part {
  _id: string;
  partName: string;
  partNumber?: string;
  quantity: number;
  unitCost: number;
  stock?: number;
  description?: string;
}

interface QuotationViewData {
  _id: string;
  quotationAutoId?: string;
  ticketCode: string;
  quotationStatus: string;
  ticket: {
    ticketCode: string;
    [key: string]: any;
  };
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  partsList?: Part[];
  labourTime?: number;
  labourRate?: number;
  partTotalBill?: number;
  labourTotalBill?: number;
  subTotalBill?: number;
  taxAmount?: number;
  netTotal?: number;
  aditionalNotes?: string;
  validityDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ViewProps {
  quotation: QuotationViewData | null;
  onClose: () => void;
}

const View: React.FC<ViewProps> = ({ quotation, onClose }) => {
  if (!quotation) return null;

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "£ 0.00";
    return `£ ${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("sent") || statusLower.includes("send")) {
      return "bg-blue-100 text-blue-700 border-blue-300";
    } else if (statusLower.includes("approved") || statusLower.includes("approve")) {
      return "bg-green-100 text-green-700 border-green-300";
    } else if (statusLower.includes("draft")) {
      return "bg-gray-100 text-gray-700 border-gray-300";
    } else if (statusLower.includes("reject")) {
      return "bg-red-100 text-red-700 border-red-300";
    }
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const modalContent = (
    <>
      <style>{animations}</style>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4 animate-fadeIn"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="">
                <FileText className="text-white" size={30} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Quotation Details</h2>
                <p className="text-indigo-100 text-xs mt-1">
                  {quotation.quotationAutoId || "N/A"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 hover:text-indigo-600 rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-gray-600" />
                <span className="text-sm font-semibold text-gray-600">Status</span>
              </div>
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  quotation.quotationStatus
                )}`}
              >
                {quotation.quotationStatus}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-gray-600" />
                <span className="text-sm font-semibold text-gray-600">Created Date</span>
              </div>
              <p className="text-gray-900 font-medium">
                {formatDate(quotation.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Customer Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-gray-900 font-semibold">
                  {quotation?.customer?.firstName || ''} {quotation?.customer?.lastName || ''}
                </p>
              </div>
              {quotation?.customer?.email && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                  <p className="text-gray-900">{quotation.customer.email}</p>
                </div>
              )}
              {quotation?.customer?.phone && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-600">Phone</p>
                  </div>
                  <p className="text-gray-900">{quotation.customer.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Ticket Number</p>
                <p className="text-gray-900 font-mono font-semibold">
                  {quotation?.ticket?.ticketCode || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Parts List */}
          {quotation.partsList && quotation.partsList.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Parts List</h3>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Part Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quotation.partsList.map((part, index) => (
                      <tr key={`${part._id}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {part.partName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                          {part.partNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                          {part.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(part.unitCost || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-indigo-600 text-right">
                          {formatCurrency((part.unitCost || 0) * (part.quantity || 1))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Labour Charges */}
          <div className="bg-linear-to-br from-orange-50 to-yellow-50 rounded-xl p-6 mb-6 border border-orange-100">
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={20} className="text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Labour Charges</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-gray-500" />
                  <p className="text-sm text-gray-600">Labour Time</p>
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  {quotation.labourTime || 0} hours
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={16} className="text-gray-500" />
                  <p className="text-sm text-gray-600">Labour Rate</p>
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  {formatCurrency(quotation.labourRate)}/hr
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Labour Cost</p>
                <p className="text-orange-600 font-bold text-xl">
                  {formatCurrency(quotation.labourTotalBill)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {quotation.aditionalNotes && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Additional Notes
                </h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {quotation.aditionalNotes}
              </p>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Price Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                <span className="text-gray-600">Parts Total:</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {formatCurrency(quotation.partTotalBill)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                <span className="text-gray-600">Labour Total:</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {formatCurrency(quotation.labourTotalBill)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {formatCurrency(quotation.subTotalBill)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                <span className="text-gray-600">Tax Amount:</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {formatCurrency(quotation.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold text-gray-900">
                  Net Total:
                </span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(quotation.netTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Validity Date */}
          {quotation.validityDate && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Valid Until</p>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(quotation.validityDate)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span>Last Updated: </span>
              <span className="font-medium text-gray-900">
                {formatDate(quotation.updatedAt)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div> */}
      </div>
    </div>
    </>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default View;
