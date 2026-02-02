import React from "react";
import { Save, Send, CheckCircle2 } from "lucide-react";

const InvoiceFooter = () => {
  return (
    <div className="w-full py-6 px-6 flex justify-end items-center gap-3 bg-transparent">
      <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-all duration-200 shadow-sm group">
        <Save
          size={18}
          className="text-slate-600 group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium">Save Draft</span>
      </button>

      <button className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md shadow-blue-200 group">
        <Send
          size={18}
          className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
        <span className="text-sm font-medium">Send to Customer</span>
      </button>

      <button className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-md shadow-green-200 group">
        <CheckCircle2
          size={18}
          className="text-white group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium">Generate Invoice</span>
      </button>
    </div>
  );
};

export default InvoiceFooter;
