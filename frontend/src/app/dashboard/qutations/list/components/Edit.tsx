"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  Calendar,
  User,
  Clock,
  Wrench,
  DollarSign,
  MessageSquare,
  Save,
  AlertCircle
} from "lucide-react";
import { updateItem } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";

// Reuse animations from View
const animations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

  .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
  .animate-slideUp { animation: slideUp 0.3s ease-out; }
`;

interface EditProps {
  quotation: any;
  onClose: () => void;
  onSuccess: () => void;
}

const Edit: React.FC<EditProps> = ({ quotation, onClose, onSuccess }) => {
  const [labourTime, setLabourTime] = useState(quotation.labourTime || 0);
  const [labourRate, setLabourRate] = useState(quotation.labourRate || 0);
  const [aditionalNotes, setAditionalNotes] = useState(quotation.aditionalNotes || "");
  const [validityDate, setValidityDate] = useState(
    quotation.validityDate ? new Date(quotation.validityDate).toISOString().split('T')[0] : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  console.log("quotation", quotation)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Calculate totals (simplified for now as parts editing is complex)
  const partTotalBill = quotation.partTotalBill || 0;
  const labourTotalBill = labourTime * labourRate;
  const subTotalBill = partTotalBill + labourTotalBill;
  const taxAmount = subTotalBill * 0.20; // Assuming 20% tax
  const netTotal = subTotalBill + taxAmount;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const payload = {
        labourTime,
        labourRate,
        aditionalNotes,
        validityDate: new Date(validityDate).toISOString(),
        partTotalBill,
        labourTotalBill,
        subTotalBill,
        taxAmount,
        netTotal
      };

      await updateItem("/technician-ticket-quotation", quotation._id, payload);
      toast.success("Quotation updated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error updating quotation:", error);
      toast.error(error?.message || "Failed to update quotation");
    } finally {
      setIsSaving(false);
    }
  };

  if (!quotation) return null;

  const modalContent = (
    <>
      <style>{animations}</style>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4 animate-fadeIn"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <FileText className="text-white" size={30} />
                <div>
                  <h2 className="text-xl font-semibold">Edit Quotation</h2>
                  <p className="text-indigo-100 text-xs mt-1">
                    {quotation.quotationAutoId || "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Info (Read Only) */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <User size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Customer Details</h3>
                </div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900 mb-2">
                  {quotation.customer?.firstName} {quotation.customer?.lastName}
                </p>
                <p className="text-sm text-gray-600">Ticket</p>
                <p className="font-mono font-medium text-gray-900">
                  {quotation.ticket?.ticketCode || "N/A"}
                </p>
              </div>

              {/* Validity Date */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Validity</h3>
                </div>
                <label className="text-sm text-gray-600 block mb-1">Valid Until</label>
                <input
                  type="date"
                  value={validityDate}
                  onChange={(e) => setValidityDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Labour Section */}
            <div className="bg-orange-50 rounded-xl p-6 mb-6 border border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <Wrench size={20} className="text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">Labour Charges</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Clock size={16} /> Labour Time (hours)
                  </label>
                  <input
                    type="number"
                    value={labourTime}
                    onChange={(e) => setLabourTime(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <DollarSign size={16} /> Labour Rate (£/hr)
                  </label>
                  <input
                    type="number"
                    value={labourRate}
                    onChange={(e) => setLabourRate(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Additional Notes</h3>
              </div>
              <textarea
                value={aditionalNotes}
                onChange={(e) => setAditionalNotes(e.target.value)}
                placeholder="Enter any additional information..."
                className="w-full p-4 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              />
            </div>

            {/* Summary Information */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <AlertCircle size={18} />
                <p className="text-sm italic">Totals are auto-calculated based on labour and existing parts.</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Parts Total:</span>
                  <span className="font-semibold">£{partTotalBill.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labour Total:</span>
                  <span className="font-semibold">£{labourTotalBill.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">£{subTotalBill.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (20%):</span>
                  <span className="font-semibold">£{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-indigo-600 border-t border-gray-300 pt-2">
                  <span>Net Total:</span>
                  <span>£{netTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Quotation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default Edit;
