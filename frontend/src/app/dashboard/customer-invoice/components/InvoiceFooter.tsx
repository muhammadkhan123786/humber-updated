"use client";

import React from "react";
import { CheckCircle2, Save, Send } from "lucide-react";

interface InvoiceFooterProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const InvoiceFooter = ({ onSubmit, isSubmitting }: InvoiceFooterProps) => {
  const handleGenerateInvoice = async () => {
    console.log("Handle Generate Invoice.");
    await onSubmit();
  };

  return (
    <div className="w-full py-6 px-6 flex justify-end items-center gap-3 bg-transparent">
      {/* Save Draft Button */}
      <button
        type="button"
        disabled={isSubmitting}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        <Save size={18} className="text-gray-500" />
        <span className="text-sm font-medium">Save Draft</span>
      </button>

      {/* Send to Customer Button */}
      <button
        type="button"
        disabled={isSubmitting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md shadow-blue-100 disabled:opacity-50"
      >
        <Send size={18} />
        <span className="text-sm font-medium">Send to Customer</span>
      </button>

      {/* Generate Invoice Button */}
      <button
        type="button"
        onClick={handleGenerateInvoice}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-md shadow-green-200 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle2
          size={18}
          className="text-white group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium">
          {isSubmitting ? "Generating..." : "Generate Invoice"}
        </span>
      </button>
    </div>
  );
};

export default InvoiceFooter;
