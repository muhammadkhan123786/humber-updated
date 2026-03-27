"use client";
import React from "react";
import { X, FileText } from "lucide-react";

const AlertStatusFooter = () => {
  return (
    <div className="space-y-4 mt-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D27A]"></div>
          </label>
          <div>
            <h4 className="text-[15px] font-bold text-[#1E1F4B]">
              Alert Status
            </h4>
            <p className="text-[12px] text-slate-500">
              This alert is currently active
            </p>
          </div>
        </div>
        <span className="bg-[#00D27A] text-white text-[11px] px-4 py-1.5 rounded-lg font-bold">
          Active
        </span>
      </div>

      <div className="flex gap-3 h-10">
        <button className="flex-1 bg-linear-to-r from-[#C236D3] to-[#F13A9B] text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition-all active:scale-[0.98]">
          <FileText size={18} />
          Save Configuration
        </button>
        <button className="px-6 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <X size={18} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AlertStatusFooter;
