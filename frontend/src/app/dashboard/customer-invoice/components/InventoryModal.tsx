"use client";
import React, { useState } from "react";
import { Search, X, Package, CheckCircle2, Minus, Plus } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  stock: number;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMultiple: (items: (InventoryItem & { quantity: number })[]) => void;
}

const InventoryModal = ({
  isOpen,
  onClose,
  onSelectMultiple,
}: InventoryModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Track quantities for each item ID
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const inventoryData: InventoryItem[] = [
    {
      id: "1",
      name: "12V 35Ah Battery",
      sku: "BAT-12V35AH",
      unitPrice: 89.99,
      stock: 0,
    },
    {
      id: "2",
      name: "Front Wheel Assembly",
      sku: "WHL-FNT-8IN",
      unitPrice: 45.5,
      stock: 5,
    },
    {
      id: "3",
      name: "Tiller Adjustment Kit",
      sku: "TLR-ADJ-KIT",
      unitPrice: 25.0,
      stock: 3,
    },
  ];

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
      // Default quantity to 1 when first selected
      if (!quantities[id]) {
        setQuantities((prev) => ({ ...prev, [id]: 1 }));
      }
    }
    setSelectedIds(newSelected);
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddParts = () => {
    const itemsToAdd = inventoryData
      .filter((item) => selectedIds.has(item.id))
      .map((item) => ({
        ...item,
        quantity: quantities[item.id] || 1,
      }));

    if (typeof onSelectMultiple === "function") {
      onSelectMultiple(itemsToAdd);
    } else {
      console.error("onSelectMultiple is not defined on the parent component");
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 flex justify-between items-start">
          <div className="flex gap-3">
            <Package
              className="text-blue-600 mt-1"
              size={24}
              strokeWidth={2.5}
            />
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Select Parts from Inventory
              </h3>
              <p className="text-slate-500 text-sm">
                Choose parts and quantities to add
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by part name or number..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
          {inventoryData.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const quantity = quantities[item.id] || 1;

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/30"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div
                      className={`mt-1 w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                          {item.sku}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.stock === 0
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          Stock: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector - Only visible when selected */}
                  {isSelected && (
                    <div
                      className="flex flex-col items-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-700">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Total
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-end">
                  <p className="text-xl font-bold text-emerald-600">
                    £{item.unitPrice.toFixed(2)}
                  </p>
                  {isSelected && (
                    <p className="text-lg font-bold text-blue-600">
                      £{(item.unitPrice * quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddParts}
            disabled={selectedIds.size === 0}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${
              selectedIds.size > 0
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                : "bg-blue-200 text-white cursor-not-allowed"
            }`}
          >
            <CheckCircle2 size={18} />
            Add {selectedIds.size} Parts to Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
