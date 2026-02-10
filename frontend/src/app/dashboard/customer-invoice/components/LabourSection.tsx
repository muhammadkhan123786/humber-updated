"use client";
import React, { useState } from "react";
import { Trash2, Plus, Clock } from "lucide-react";

interface LabourItem {
  id: number;
  description: string;
  hours: number;
  rate: number;
}

const LabourSection: React.FC = () => {
  const [labourItems, setLabourItems] = useState<LabourItem[]>([
    { id: 1, description: "Battery System Testing", hours: 0.5, rate: 45 },
  ]);

  const addLabour = () => {
    const newId = Date.now();
    setLabourItems([
      ...labourItems,
      { id: newId, description: "", hours: 0, rate: 0 },
    ]);
  };

  const removeLabour = (id: number) => {
    setLabourItems(labourItems.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof LabourItem,
    value: string | number,
  ) => {
    setLabourItems(
      labourItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const subtotal = labourItems.reduce(
    (acc, item) => acc + item.hours * item.rate,
    0,
  );

  return (
    <div className="w-full  p-6 bg-white rounded-2xl outline  outline-purple-100 flex flex-col gap-6 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <span className="p-1.5   rounded-lg">
              <Clock size={20} />
            </span>
            <h2 className="leading-none flex items-center gap-2 text-purple-600">
              Labour & Services
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Add or modify labour charges for this job
          </p>
        </div>

        <button
          onClick={addLabour}
          className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-md hover:shadow-purple-200"
        >
          <Plus size={18} /> Add Labour
        </button>
      </div>

      {/* 2. Removed overflow and max-height so it grows downwards */}
      <div className="flex flex-col gap-4">
        {labourItems.map((item, index) => (
          <div
            key={item.id}
            className="w-full p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl  outline-2 outline-purple-100 flex flex-col gap-4 transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                Labour #{index + 1}
              </span>
              {/* 3. New Trash Icon */}
              <button
                onClick={() => removeLabour(item.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Delete item"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
                <label className="text-indigo-950 text-xs font-semibold">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                  placeholder="Enter service description..."
                  className="w-full h-10 px-3 bg-white rounded-xl border border-purple-100 text-sm focus:outline-none focus:ring-2 ring-purple-300 transition-all"
                />
              </div>
              <div className="col-span-6 md:col-span-3 flex flex-col gap-1">
                <label className="text-indigo-950 text-xs font-semibold">
                  Hours
                </label>
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "hours",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full h-10 px-3 bg-white rounded-xl border border-purple-100 text-sm focus:outline-none focus:ring-2 ring-purple-300"
                />
              </div>
              <div className="col-span-6 md:col-span-3 flex flex-col gap-1">
                <label className="text-indigo-950 text-xs font-semibold">
                  Rate (£/hr)
                </label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                  }
                  className="w-full h-10 px-3 bg-white rounded-xl border border-purple-100 text-sm focus:outline-none focus:ring-2 ring-purple-300"
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-2 bg-white/60 rounded-xl border border-white">
              <span className="text-gray-600 text-sm font-medium">
                Line Total:
              </span>
              <span className="text-purple-600 text-2xl font-bold">
                £{(item.hours * item.rate).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        <div className="mt-2 p-5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl flex justify-between items-center text-white shadow-lg shadow-purple-100">
          <div className="flex flex-col">
            <span className="text-purple-100 text-xs uppercase tracking-wider font-bold">
              Total Estimate
            </span>
            <span className="text-xl font-bold">Labour Subtotal</span>
          </div>
          <span className="text-4xl font-black">£{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default LabourSection;
