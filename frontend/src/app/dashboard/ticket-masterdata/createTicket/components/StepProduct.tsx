"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const StepProduct = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [selectedProduct, setSelectedProduct] = useState("");

  const productData = [
    { label: "Make", value: "Drive Medical" },
    { label: "Model", value: "Scout Compact" },
    { label: "Year", value: "2024" },
    { label: "Serial Number", value: "DM-SC-2024-045" },
    { label: "Color", value: "Blue" },
    { label: "Ownership", value: "Customer Owned" },
  ];

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500">
      <div className="bg-linear-to-r from-[#AD46FF] to-[#F6339A] p-8 text-white rounded-t-4xl">
        <h2 className="text-xl font-bold tracking-tight">Product</h2>
        <p className="opacity-90 text-sm font-medium">
          Select mobility scooter
        </p>
      </div>

      <div className="p-10 space-y-10">
        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Select Mobility Scooter *
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-5 rounded-3xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-bold outline-none focus:ring-2 ring-purple-100 transition-all cursor-pointer"
          >
            <option value="">Select a product</option>
            <option value="scout">Drive Scout (Scout Compact) - Blue</option>
          </select>
        </div>
        {selectedProduct === "scout" && (
          <div className="p-8 rounded-4xl bg-[#FAF5FF] border border-[#AD46FF]/10 animate-in zoom-in-95 duration-300">
            <h4 className="text-[#AD46FF] font-black text-[10px] uppercase tracking-[0.2em] mb-6">
              Part Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/70 p-5 rounded-3xl border border-white shadow-sm"
                >
                  <span className="block text-[9px] font-black text-[#AD46FF] uppercase mb-1">
                    {item.label}
                  </span>
                  <span className="text-[#1E293B] font-bold text-[15px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 rounded-3xl font-black bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button
            disabled={!selectedProduct}
            onClick={onNext}
            className={`flex items-center gap-2 px-10 py-4 rounded-3xl font-black text-white shadow-lg transition-all ${
              selectedProduct
                ? "bg-linear-to-r from-[#C27AFF] to-[#FA1085] hover:scale-105 active:scale-95 shadow-purple-100"
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

export default StepProduct;
