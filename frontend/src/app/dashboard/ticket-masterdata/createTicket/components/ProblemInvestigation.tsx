"use client";

import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface Part {
  id: number;
  name: string;
  number: string;
  quantity: number;
  unitCost: number;
}

const ProblemInvestigation = ({}: { form: any }) => {
  const [parts, setParts] = useState<Part[]>([
    { id: 1, name: "", number: "", quantity: 1, unitCost: 0 },
  ]);

  const addPart = () => {
    setParts([
      ...parts,
      { id: Date.now(), name: "", number: "", quantity: 1, unitCost: 0 },
    ]);
  };

  const removePart = (id: number) => {
    setParts(parts.filter((part) => part.id !== id));
  };

  return (
    <div className="self-stretch bg-white/80 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="h-20 px-6 pt-5 bg-linear-to-r from-indigo-500 to-purple-500 flex flex-col justify-start items-start">
        <h2 className="text-white text-lg font-bold font-['Arial']">
          Problem Investigation
        </h2>
        <p className="text-white/90 text-sm font-normal font-['Arial']">
          Parts required, cost & approval
        </p>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <label className="text-indigo-950 text-base font-medium font-['Arial']">
            Investigation Report *
          </label>
          <textarea
            className="w-full h-24 p-3 bg-gray-100 rounded-[10px] hover:border-blue-300 border-2 border-indigo-100 outline-none focus:border-indigo-400 focus-visible:ring-[1px] text-gray-700 text-sm transition-colors resize-none"
            placeholder="Enter the investigation report..."
          />
        </div>

        {/* Parts Required Section */}
        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial']">
            Parts Required (Optional)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parts.map((part, index) => (
              <div
                key={part.id}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-bold text-base">
                    Part {index + 1}
                  </span>
                  <button
                    onClick={() => removePart(part.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Part Name */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Part Name:
                    </span>
                    <input
                      type="text"
                      placeholder="Enter part name"
                      className="flex-1 h-10 px-3 bg-gray-100 rounded-[10px] border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all duration-200"
                    />
                  </div>

                  {/* Part Number */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Part Number:
                    </span>
                    <input
                      type="text"
                      placeholder="Enter part number"
                      className="flex-1 h-10 px-3 bg-gray-100 rounded-[10px] border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all duration-200"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Quantity:
                    </span>
                    <input
                      type="number"
                      defaultValue={1}
                      className="flex-1 h-10 px-3 bg-gray-100 rounded-[10px] border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all duration-200"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Unit Cost:
                    </span>
                    <input
                      type="number"
                      defaultValue={0}
                      className="flex-1 h-10 px-3 bg-gray-100 rounded-[10px] border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Part Button (Styled exactly like your Figma input box) */}
            <button
              onClick={addPart}
              type="button"
              className="w-full h-10 flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 bg-indigo-50/10 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 group mt-2"
            >
              <Plus size={16} className="text-indigo-500 stroke-[3px]" />
              <span className="text-indigo-600 font-medium text-sm">
                Add Part
              </span>
            </button>
          </div>
        </div>

        {/* Email Option Section */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] mb-3 block">
            Send Report to Customer (Optional)
          </label>
          <div className="flex items-center gap-3   ">
            <input
              type="checkbox"
              className="w-5 h-5 rounded accent-green-500 cursor-pointer"
              id="sendEmail"
            />
            <label
              htmlFor="sendEmail"
              className="text-gray-600 text-sm cursor-pointer select-none"
            >
              Send the investigation report to the customer via email
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemInvestigation;
