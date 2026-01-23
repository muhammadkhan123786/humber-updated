"use client";
import React, { useState } from "react";
import { CheckCircle2, ListChecks, Info } from "lucide-react";
import { motion } from "framer-motion";

// Define an interface to fix the TypeScript 'null' vs 'string' error
interface InspectionItem {
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'PASS' | 'FAIL' | 'N/A';
  timestamp: string | null;
}

export const InspectionTab = () => {
  const [items, setItems] = useState<InspectionItem[]>([
    {
      id: 1,
      title: "Battery Voltage Check",
      description: "Check battery voltage and charge level",
      status: "PENDING",
      timestamp: null,
    },
    {
      id: 2,
      title: "Motor Function Test",
      description: "Test motor operation at various speeds",
      status: "PENDING",
      timestamp: null,
    },
    {
      id: 3,
      title: "Brake System Check",
      description: "Verify electromagnetic brake functionality",
      status: "PENDING",
      timestamp: null,
    }
  ]);

  const handleStatusChange = (id: number, newStatus: 'PASS' | 'FAIL' | 'N/A') => {
    const now = new Date().toLocaleString();
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: newStatus, timestamp: now } : item
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 px-2 text-[#10B981] font-bold text-sm">
        <ListChecks size={18} />
        <span>Inspection Checklist</span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 hover:border-green-500 border-gray-50 rounded-[2.5rem] p-6 shadow-sm relative transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-extrabold text-gray-800 text-base">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium">{item.description}</p>
              </div>

              {item.status !== 'PENDING' && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter border animate-in fade-in zoom-in duration-300 ${
                  item.status === 'PASS' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                  item.status === 'FAIL' ? 'bg-red-50 text-red-500 border-red-100' :
                  'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {item.status}
                </span>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => handleStatusChange(item.id, 'PASS')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all border-2 ${
                  item.status === 'PASS'
                  ? 'bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-emerald-100'
                  : 'bg-gray-50 text-gray-400 border-gray-50 hover:bg-gray-100'
                }`}
              >
                <CheckCircle2 size={14} />
                Pass
              </button>

              <button
                onClick={() => handleStatusChange(item.id, 'FAIL')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all border-2 ${
                  item.status === 'FAIL'
                  ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-lg shadow-red-100'
                  : 'bg-gray-50 text-gray-400 border-gray-50 hover:bg-gray-100'
              }`}>
                <Info size={14} />
                Fail
              </button>

              <button
                onClick={() => handleStatusChange(item.id, 'N/A')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all border-2 ${
                  item.status === 'N/A'
                  ? 'bg-[#374151] text-white border-[#374151]'
                  : 'bg-gray-50 text-gray-400 border-gray-50 hover:bg-gray-100'
              }`}>
                N/A
              </button>
            </div>

            <div className="mt-5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">Notes</label>
              <input
                type="text"
                placeholder="Add inspection notes..."
                className="w-full bg-[#F9FAFB] border-2 border-gray-50 rounded-2xl px-5 py-3 text-xs mt-1 focus:outline-none focus:border-emerald-100 transition-colors"
              />
            </div>

            {item.timestamp && (
              <p className="text-[10px] text-gray-300 mt-4 ml-2 font-semibold italic">
                Checked: {item.timestamp}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};