"use client";
import React, { useState } from "react";
import { Package, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PartEntry {
  id: number;
  name: string;
  number: string;
  condition: string;
  serialNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason: string;
}

const INVENTORY = [
  { id: "1", name: "Joystick Controller (CTL-JOY-005 - £129.99)", partNumber: "CTL-JOY-005", price: 129.99 },
  { id: "2", name: "Drive Motor (MOT-DRV-102 - £245.00)", partNumber: "MOT-DRV-102", price: 245.00 },
  { id: "3", name: "Battery Pack 12V 35Ah (BAT-1235 - £85.50)", partNumber: "BAT-1235", price: 85.50 },
];

export const PartsTab = () => {
  const [parts, setParts] = useState<PartEntry[]>([]);

  // Form State
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [condition, setCondition] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [reason, setReason] = useState("");

  const handlePartSelect = (id: string) => {
    setSelectedPartId(id);
    const part = INVENTORY.find(p => p.id === id);
    if (part) {
      setPartNumber(part.partNumber);
      setUnitCost(part.price);
    } else {
      setPartNumber("");
      setUnitCost(0);
    }
  };

  const handleRecordPart = () => {
    const selectedPart = INVENTORY.find(p => p.id === selectedPartId);
    if (!selectedPart || !condition || !reason) return;

    const newEntry: PartEntry = {
      id: Date.now(),
      name: selectedPart.name.split(" (")[0],
      number: partNumber,
      condition,
      serialNumber,
      quantity,
      unitCost,
      totalCost: unitCost * quantity,
      reason,
    };

    setParts([newEntry, ...parts]);

    setSelectedPartId("");
    setPartNumber("");
    setUnitCost(0);
    setCondition("");
    setSerialNumber("");
    setQuantity(1);
    setReason("");
  };

  const deletePart = (id: number) => {
    setParts(parts.filter(p => p.id !== id));
  };

  const totalPartsCost = parts.reduce((acc, curr) => acc + curr.totalCost, 0);
  const totalUnits = parts.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <AnimatePresence>
        {parts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFF6FB] border border-pink-100 rounded-3xl p-8 flex flex-wrap justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-center">
              <Package className="text-[#A855F7] mb-2" size={32} />
              <span className="text-2xl font-black text-[#A855F7]">{parts.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parts Changed</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Units</span>
              <span className="text-2xl font-black text-[#6366F1]">{totalUnits}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Units</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cost</span>
              <span className="text-2xl font-black text-[#10B981]">£{totalPartsCost.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">All Parts</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-[#A855F7] font-bold">
          <Plus size={20} />
          <span className="text-sm">Record Part Change</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Part Name *</label>
            <select
              value={selectedPartId}
              onChange={(e) => handlePartSelect(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
            >
              <option value="">Select a part from inventory...</option>
              {INVENTORY.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Part Number *</label>
            <input
              readOnly
              value={partNumber}
              className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-medium outline-none text-sm cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Old Part Condition</label>
            <input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Damaged"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Serial Number</label>
            <input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="SN-123456"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Cost (£)</label>
            <div className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-medium text-sm">
              £{unitCost.toFixed(2)}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Cost (£)</label>
            <div className="w-full p-4 bg-purple-50 border border-purple-100 rounded-2xl text-[#A855F7] font-black text-sm">
              £{(unitCost * quantity).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason for Change *</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm resize-none"
          />
        </div>

        <button
          onClick={handleRecordPart}
          className="w-full py-4 bg-linear-to-r from-[#A855F7] to-[#E11D48] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
        >
          <Package size={20} />
          <span>Record Part Change</span>
        </button>
      </div>

      <AnimatePresence>
        {parts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden mt-8"
          >
            <div className="flex items-center gap-2 mb-6 text-[#10B981] font-bold text-sm">
              <CheckCircle2 size={20} />
              <span>Parts Changed ({parts.length})</span>
            </div>

            <div className="space-y-4 mb-6">
              {parts.map((part) => (
                <div key={part.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 relative group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800 text-base">{part.name}</h4>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{part.number}</p>

                      <div className="mt-4 grid grid-cols-1 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">New Serial:</span>
                          <span className="text-sm text-gray-600">{part.serialNumber || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Reason:</span>
                          <span className="text-sm text-gray-600">{part.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#10B981] text-white text-[10px] font-black px-2 py-1 rounded-lg">Qty: {part.quantity}</span>
                        <button
                          onClick={() => deletePart(part.id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-8 text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Unit: £{part.unitCost.toFixed(2)}</p>
                        <p className="text-[#10B981] font-black text-2xl">£{part.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-linear-to-r from-[#A855F7] to-[#E11D48] rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-purple-100">
              <span className="font-bold   text-sm">Total Parts Cost:</span>
              <span className="text-2xl font-black">£{totalPartsCost.toFixed(2)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};