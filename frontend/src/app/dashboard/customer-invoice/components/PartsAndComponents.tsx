"use client";
import React, { useState } from "react";
import { Trash2, Package, ShoppingCart, Plus } from "lucide-react";
import InventoryModal from "./InventoryModal";

interface Part {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

const PartsAndComponents = () => {
  // Start with an empty array so the "No parts" state shows by default
  const [parts, setParts] = useState<Part[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInventorySelect = (items: any[]) => {
    const newParts: Part[] = items.map((item) => ({
      id: Date.now() + Math.random(),
      name: item.name,
      sku: item.sku,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice,
    }));

    setParts([...parts, ...newParts]);
  };

  const addPart = () => {
    const newPart: Part = {
      id: Date.now(),
      name: "",
      sku: "",
      quantity: 1,
      unitPrice: 0,
    };
    setParts([...parts, newPart]);
  };

  const removePart = (id: number) => {
    setParts(parts.filter((part) => part.id !== id));
  };

  const updatePart = (
    id: number,
    field: keyof Part,
    value: string | number,
  ) => {
    const updatedParts = parts.map((part) => {
      if (part.id === id) {
        return { ...part, [field]: value };
      }
      return part;
    });
    setParts(updatedParts);
  };

  const subtotal = parts.reduce(
    (acc, part) =>
      acc + (Number(part.quantity) || 0) * (Number(part.unitPrice) || 0),
    0,
  );

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-blue-100 p-6 flex flex-col gap-6 font-sans shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Package size={20} />
            <h2 className="text-lg font-semibold">Parts & Components</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Add or modify parts used in this job
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ShoppingCart size={16} />
            Select from Inventory
          </button>
          <button
            onClick={addPart}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-blue-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Plus size={16} />
            Add Manually
          </button>
        </div>
      </div>

      {parts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-blue-50 rounded-2xl bg-slate-50/30">
          <div>
            <Package size={48} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No parts added yet.</p>
          <p className="text-slate-400 text-sm">
            Click Add Part to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {parts.map((part, index) => (
              <div
                key={part.id}
                className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 p-4 transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Part #{index + 1}
                  </span>
                  <button
                    onClick={() => removePart(part.id)}
                    className="text-red-500 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                  <div className="md:col-span-5">
                    <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                      Part Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter part name..."
                      value={part.name}
                      onChange={(e) =>
                        updatePart(part.id, "name", e.target.value)
                      }
                      className="w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                      SKU
                    </label>
                    <input
                      type="text"
                      placeholder="SKU-000"
                      value={part.sku}
                      onChange={(e) =>
                        updatePart(part.id, "sku", e.target.value)
                      }
                      className="w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={part.quantity}
                      onChange={(e) =>
                        updatePart(part.id, "quantity", Number(e.target.value))
                      }
                      className="w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                      Unit Price (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={part.unitPrice}
                      onChange={(e) =>
                        updatePart(part.id, "unitPrice", Number(e.target.value))
                      }
                      className="w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="bg-white/60 rounded-xl p-3 flex justify-between items-center border border-white/40">
                  <span className="text-gray-600 text-sm font-medium">
                    Line Total:
                  </span>
                  <span className="text-blue-600 text-2xl font-bold">
                    £
                    {(
                      (Number(part.quantity) || 0) *
                      (Number(part.unitPrice) || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl p-5 flex justify-between items-center text-white shadow-md">
            <span className="text-lg font-bold uppercase tracking-wide">
              Parts Subtotal:
            </span>
            <span className="text-3xl font-bold">£{subtotal.toFixed(2)}</span>
          </div>
        </>
      )}

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectMultiple={handleInventorySelect}
      />
    </div>
  );
};

export default PartsAndComponents;
