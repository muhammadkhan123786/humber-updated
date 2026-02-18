"use client";
import React, { useState } from "react";
import { Trash2, Package, ShoppingCart, Plus, Lock } from "lucide-react";
import InventoryModal from "./InventoryModal";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormData } from "../../../../schema/invoice.schema";

interface PartsAndComponentsProps {
  parts: any[];
  partsInventory: any[];
  form: UseFormReturn<InvoiceFormData>;
  addPart: () => void;
  partFields: any[];
}

const PartsAndComponents = ({
  partsInventory,
  form,
  addPart,
  partFields,
}: PartsAndComponentsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, watch, setValue, getValues } = form;

  const handleInventorySelect = (items: any[]) => {
    const currentParts = getValues("parts") || [];
    const newParts = items.map((item) => ({
      partId: item._id || item.id,
      partName: item.partName || item.name || "",
      partNumber: item.partNumber || item.sku || "",
      quantity: Number(item.quantity) || 1,
      unitCost: Number(item.unitCost || item.unitPrice) || 0,
      totalCost:
        (Number(item.quantity) || 1) *
        (Number(item.unitCost || item.unitPrice) || 0),
      source: "INVOICE" as const,
    }));
    setValue("parts", [...currentParts, ...newParts] as any);
  };

  const removePart = (index: number) => {
    const currentParts = getValues("parts") || [];
    const updatedParts = currentParts.filter((_, i) => i !== index);
    setValue("parts", updatedParts as any);
  };

  const watchedParts = watch("parts") || [];

  const subtotal = watchedParts.reduce(
    (sum: number, part: any) =>
      sum + Number(part?.quantity || 0) * Number(part?.unitCost || 0),
    0,
  );

  const getPartDetails = (partId: string) => {
    return partsInventory.find((p) => p._id === partId) || null;
  };

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
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ShoppingCart size={16} />
            Select from Inventory
          </button>
          <button
            type="button"
            onClick={addPart}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-blue-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Plus size={16} />
            Add Manually
          </button>
        </div>
      </div>

      {!partFields || partFields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-blue-50 rounded-2xl bg-slate-50/30">
          <Package size={48} className="text-slate-300" />
          <p className="text-slate-500 font-medium">No parts added yet.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {partFields.map((field, index) => {
              const currentPart = watchedParts[index];
              if (!currentPart) return null;

              const isFromJob = currentPart.source === "JOB";
              const partDetails = getPartDetails(currentPart.partId);

              const displayName = isFromJob
                ? currentPart.partName ||
                  partDetails?.partName ||
                  "Unknown Part"
                : currentPart.partName || "";

              const displayPartNumber = isFromJob
                ? currentPart.partNumber || partDetails?.partNumber || "N/A"
                : currentPart.partNumber || "";

              const lineTotal =
                (Number(currentPart.quantity) || 0) *
                (Number(currentPart.unitCost) || 0);

              return (
                <div
                  key={field.id}
                  className={`bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 p-4 ${
                    isFromJob ? "opacity-90 bg-gray-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Part #{index + 1}
                      </span>
                      {isFromJob && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          <Lock size={12} />
                          From Job
                        </span>
                      )}
                    </div>
                    {!isFromJob && (
                      <button
                        type="button"
                        onClick={() => removePart(index)}
                        className="text-red-500 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                    <div className="md:col-span-4">
                      <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                        Part Name
                      </label>
                      <input
                        {...register(`parts.${index}.partName` as any)}
                        value={displayName}
                        onChange={(e) => {
                          if (!isFromJob) {
                            setValue(
                              `parts.${index}.partName` as any,
                              e.target.value,
                            );
                          }
                        }}
                        readOnly={isFromJob}
                        className={`w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${
                          isFromJob ? "bg-gray-100 text-gray-600" : ""
                        }`}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                        SKU
                      </label>
                      <input
                        {...register(`parts.${index}.partNumber` as any)}
                        value={displayPartNumber}
                        onChange={(e) => {
                          if (!isFromJob) {
                            setValue(
                              `parts.${index}.partNumber` as any,
                              e.target.value,
                            );
                          }
                        }}
                        readOnly={isFromJob}
                        className={`w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${
                          isFromJob ? "bg-gray-100 text-gray-600" : ""
                        }`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                        Quantity
                      </label>
                      <input
                        type="number"
                        {...register(`parts.${index}.quantity` as any, {
                          valueAsNumber: true,
                        })}
                        onChange={(e) => {
                          if (!isFromJob) {
                            const quantity = Number(e.target.value);
                            setValue(
                              `parts.${index}.quantity` as any,
                              quantity,
                            );

                            const unitCost = Number(currentPart.unitCost) || 0;
                            setValue(
                              `parts.${index}.totalCost` as any,
                              quantity * unitCost,
                            );
                          }
                        }}
                        readOnly={isFromJob}
                        className={`w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${
                          isFromJob ? "bg-gray-100 text-gray-600" : ""
                        }`}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-slate-900 text-xs font-semibold mb-1.5 block">
                        Unit Price (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`parts.${index}.unitCost` as any, {
                          valueAsNumber: true,
                        })}
                        onChange={(e) => {
                          if (!isFromJob) {
                            const unitCost = Number(e.target.value);
                            setValue(
                              `parts.${index}.unitCost` as any,
                              unitCost,
                            );
                            // Update total cost
                            const quantity = Number(currentPart.quantity) || 1;
                            setValue(
                              `parts.${index}.totalCost` as any,
                              quantity * unitCost,
                            );
                          }
                        }}
                        readOnly={isFromJob}
                        className={`w-full bg-white border border-blue-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${
                          isFromJob ? "bg-gray-100 text-gray-600" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-xl p-3 flex justify-between items-center border border-white/40">
                    <span className="text-gray-600 text-sm font-semibold">
                      Line Total:
                    </span>
                    <span className="text-blue-600 text-2xl font-bold">
                      £{lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl p-5 flex justify-between items-center text-white shadow-md mt-4">
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
        partsInventory={partsInventory}
      />
    </div>
  );
};

export default PartsAndComponents;
