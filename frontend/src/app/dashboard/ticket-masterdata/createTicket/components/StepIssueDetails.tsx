"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Info, Upload } from "lucide-react";

const StepIssueDetails = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [description, setDescription] = useState("");

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500">
      <div className="bg-linear-to-r from-[#FF6900] to-[#FB2C36] p-8 text-white rounded-t-4xl">
        <h2 className="text-xl font-bold tracking-tight">Issue Details</h2>
        <p className="opacity-90 text-sm font-medium">Describe the problem</p>
      </div>
      <div className="p-10 space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
            Fault or Accident Description *
          </label>
          <textarea
            className="w-full p-6 rounded-3xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-medium outline-none focus:ring-2 ring-orange-100 transition-all min-h-[150px] resize-none"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-gray-400 text-xs flex items-center gap-1 font-bold">
            <Info size={14} /> Provide as much detail as possible to help
            technicians understand the issue
          </p>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Upload Photos or Videos (Optional)
          </label>
          <div className="border-2 border-dashed border-[#FF6900]/40 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#FFF9F5] hover:bg-[#FFF4ED] transition-all cursor-pointer group">
            {/* Circular Upload Icon */}
            <div className="w-16 h-16 bg-[#FF6900] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FF6900]/20 mb-4 group-hover:scale-105 transition-transform">
              <Upload size={28} />
            </div>

            {/* Text Content */}
            <p className="font-bold text-[#1E293B]">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-400 text-xs font-medium mt-1">
              PNG, JPG, MP4 up to 10MB
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button
            disabled={!description}
            onClick={onNext}
            className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-white shadow-lg transition-all ${
              description
                ? "bg-linear-to-r from-[#FF6900] to-[#FF3D00] hover:shadow-orange-200"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepIssueDetails;
