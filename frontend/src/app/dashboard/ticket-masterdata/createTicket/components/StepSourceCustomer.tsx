"use client";

import React, { useState } from "react";
import { Phone, Globe, Store, UserPlus, ChevronRight } from "lucide-react";

const StepSourceCustomer = ({ onNext }: { onNext: () => void }) => {
  const [source, setSource] = useState("phone");
  const [customer, setCustomer] = useState("");

  const sources = [
    {
      id: "phone",
      label: "Phone",
      icon: Phone,
      color: "bg-linear-to-br from-[#00D3F2] to-[#00A63E]",
    },
    {
      id: "online",
      label: "Online Portal",
      icon: Globe,
      color: "bg-linear-to-br from-[#C27AFF] to-[#7F22FE]",
    },
    {
      id: "walkin",
      label: "Walk-in",
      icon: Store,
      color: "bg-linear-to-br from-[#FDC700] to-[#FF6900]",
    },
  ];

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="bg-linear-to-r from-[#2B7FFF] to-[#00B8DB] p-8 text-white rounded-t-4xl">
        <h2 className="text-xl font-bold tracking-tight">Source & Customer</h2>
        <p className="opacity-90 text-sm font-medium">
          Select ticket source and customer
        </p>
      </div>

      <div className="p-10 space-y-10">
        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Ticket Source
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sources.map((item) => (
              <button
                key={item.id}
                onClick={() => setSource(item.id)}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl transition-all duration-300 border ${
                  source === item.id
                    ? `${item.color} text-white shadow-xl scale-[1.02] border-transparent`
                    : "bg-white border-gray-100 text-[#64748B] hover:border-gray-200"
                }`}
              >
                <item.icon
                  size={32}
                  strokeWidth={source === item.id ? 2.5 : 2}
                />
                <span className="font-bold text-base">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Select Customer *
          </label>
          <select
            className="w-full p-5 rounded-2xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-bold outline-none focus:ring-2 ring-cyan-100 transition-all appearance-none cursor-pointer"
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option value="">Select a customer</option>
            <option value="mary">Mary Johnson - 555-0102</option>
          </select>

          <button className="w-full py-5 border-2 border-dashed border-[#4F39F6]/20 rounded-2xl text-[#4F39F6] font-extrabold flex items-center justify-center gap-2 hover:bg-[#F5F3FF] transition-all">
            <UserPlus size={20} /> Customer Not Found? Register New Customer
          </button>
        </div>

        {customer === "mary" && (
          <div className="p-8 rounded-4xl bg-[#F5F3FF] border border-[#4F39F6]/5 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <h4 className="text-[#4F39F6] font-black text-xs uppercase tracking-[0.2em]">
              Customer Details
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm font-bold">
              <p>
                <span className="text-[#4F39F6] inline-block w-20">Email:</span>{" "}
                <span className="text-[#5A607F]">mary.j@email.com</span>
              </p>
              <p>
                <span className="text-[#4F39F6] inline-block w-20">Phone:</span>{" "}
                <span className="text-[#5A607F]">555-0102</span>
              </p>
              <p>
                <span className="text-[#4F39F6] inline-block w-20">
                  Address:
                </span>{" "}
                <span className="text-[#5A607F]">
                  456 Oak Ave, Springfield, IL 62702
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
          <button className="px-10 py-4 rounded-2xl font-black bg-gray-50 text-gray-300 cursor-not-allowed">
            Previous
          </button>
          <button
            onClick={onNext}
            style={{
              background: "linear-gradient(90deg, #2B7FFF 0%, #00B8DB 100%)",
              boxShadow: "0 10px 15px -3px rgba(43, 127, 255, 0.2)",
              borderRadius: "10px",
            }}
            className="flex items-center gap-3 px-10 py-3 font-black text-white transition-all hover:scale-[1.05] active:scale-95 shadow-lg"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepSourceCustomer;
