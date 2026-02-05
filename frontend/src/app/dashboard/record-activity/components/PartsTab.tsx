"use client";
import React, { useEffect } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { ActivityRecordFormData } from "../../../../schema/activityRecordSchema";

interface PartsTabProps {
  form: UseFormReturn<ActivityRecordFormData>;
  parts: any[];
  partFields: any[];
  addPart: () => void;
  removePart: (index: number) => void;
  calculatePartTotal: (index: number) => number;
  totalPartsCost: number;
}

export const PartsTab = ({
  form,
  parts,
  partFields,
  addPart,
  removePart,
  calculatePartTotal,
  totalPartsCost,
}: PartsTabProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const nextIndex = partFields.length;

  const currentPartId = watch(`parts.${nextIndex}.partId`);
  const currentQuantity = watch(`parts.${nextIndex}.quantity`) || 1;
  const currentUnitCost = watch(`parts.${nextIndex}.unitCost`) || 0;

  const selectedPart = parts.find((p) => p._id === currentPartId);

  useEffect(() => {
    if (!selectedPart) return;

    setValue(`parts.${nextIndex}.unitCost`, selectedPart.unitCost || 0, {
      shouldDirty: true,
    });
  }, [selectedPart, nextIndex, setValue]);

  useEffect(() => {
    const total = currentQuantity * currentUnitCost;
    setValue(`parts.${nextIndex}.totalCost`, total, {
      shouldDirty: true,
    });
  }, [currentQuantity, currentUnitCost, nextIndex, setValue]);

  const handleRecordPart = async () => {
    const partId = watch(`parts.${nextIndex}.partId`);
    const condition = watch(`parts.${nextIndex}.oldPartConditionDescription`);
    const reason = watch(`parts.${nextIndex}.reasonForChange`);

    if (!partId || !condition || !reason) {
      alert("Please fill all required fields (*)");
      return;
    }

    addPart();

    setTimeout(() => {
      const newIndex = nextIndex + 1;
      setValue(`parts.${newIndex}.partId`, "");
      setValue(`parts.${newIndex}.oldPartConditionDescription`, "");
      setValue(`parts.${newIndex}.newSerialNumber`, "");
      setValue(`parts.${newIndex}.quantity`, 1);
      setValue(`parts.${newIndex}.unitCost`, 0);
      setValue(`parts.${newIndex}.totalCost`, 0);
      setValue(`parts.${newIndex}.reasonForChange`, "");
    }, 0);
  };

  const getPartName = (partId: string) =>
    parts.find((p) => p._id === partId)?.partName || "Unknown";

  const getPartNumber = (partId: string) =>
    parts.find((p) => p._id === partId)?.partNumber || "N/A";

  const totalUnits = partFields
    .filter((_, index) => index !== nextIndex)
    .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  const currentTotalCost = currentQuantity * currentUnitCost;
  const completedParts = partFields.filter(
    (_, index) => index !== nextIndex && partFields[index].partId,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SUMMARY */}
      <AnimatePresence>
        {completedParts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFF6FB] border border-pink-100 rounded-3xl p-8 flex flex-wrap justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-center">
              <Package className="text-[#A855F7] mb-2" size={32} />
              <span className="text-2xl font-black text-[#A855F7]">
                {completedParts.length}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Parts Changed
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#6366F1]">
                {totalUnits}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Units
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#10B981]">
                £{totalPartsCost.toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                All Parts
              </span>
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
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Part Name <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
              {...register(`parts.${nextIndex}.partId`)}
              value={currentPartId || ""}
              onChange={(e) =>
                setValue(`parts.${nextIndex}.partId`, e.target.value)
              }
            >
              <option value="">Select a part from inventory...</option>
              {parts.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.partName} ({item.partNumber} - £{item.unitCost})
                </option>
              ))}
            </select>
            {errors.parts?.[nextIndex]?.partId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.parts[nextIndex]?.partId?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Part Number
            </label>
            <input
              readOnly
              value={selectedPart?.partNumber || ""}
              className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-medium outline-none text-sm cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Old Part Condition <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="e.g. Damaged"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
              {...register(`parts.${nextIndex}.oldPartConditionDescription`)}
              value={
                watch(`parts.${nextIndex}.oldPartConditionDescription`) || ""
              }
              onChange={(e) =>
                setValue(
                  `parts.${nextIndex}.oldPartConditionDescription`,
                  e.target.value,
                )
              }
            />
            {errors.parts?.[nextIndex]?.oldPartConditionDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.parts[nextIndex]?.oldPartConditionDescription?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              New Serial Number
            </label>
            <input
              placeholder="SN-123456"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
              {...register(`parts.${nextIndex}.newSerialNumber`)}
              value={watch(`parts.${nextIndex}.newSerialNumber`) || ""}
              onChange={(e) =>
                setValue(`parts.${nextIndex}.newSerialNumber`, e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm"
              {...register(`parts.${nextIndex}.quantity`, {
                valueAsNumber: true,
                min: 1,
              })}
              value={currentQuantity || 1}
              onChange={(e) => {
                const value = e.target.value;
                setValue(
                  `parts.${nextIndex}.quantity`,
                  value === "" ? 1 : Number(value),
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Unit Cost (£)
            </label>
            <div className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-medium text-sm">
              £{currentUnitCost?.toFixed(2) || "0.00"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Total Cost (£)
            </label>
            <div className="w-full p-4 bg-purple-50 border border-purple-100 rounded-2xl text-[#A855F7] font-black text-sm">
              £{currentTotalCost.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Reason for Change <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-400 outline-none text-sm resize-none"
            {...register(`parts.${nextIndex}.reasonForChange`)}
            value={watch(`parts.${nextIndex}.reasonForChange`) || ""}
            onChange={(e) =>
              setValue(`parts.${nextIndex}.reasonForChange`, e.target.value)
            }
          />
        </div>

        <button
          type="button"
          onClick={handleRecordPart}
          className="w-full py-4 bg-linear-to-r from-[#A855F7] to-[#E11D48] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
        >
          <Package size={20} />
          <span>Record Part Change</span>
        </button>
      </div>

      <AnimatePresence>
        {completedParts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
          >
            <div className="space-y-4">
              {completedParts.map((field) => {
                const originalIndex = partFields.findIndex(
                  (f) => f.id === field.id,
                );
                const totalCost = calculatePartTotal(originalIndex);

                return (
                  <div
                    key={field.id}
                    className="bg-gray-50 p-5 rounded-2xl border"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold">
                          {getPartName(field.partId)}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {getPartNumber(field.partId)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {field.oldPartConditionDescription}
                        </p>
                        <p className="text-xs text-gray-500">
                          Reason: {field.reasonForChange}
                        </p>
                        {field.newSerialNumber && (
                          <p className="text-xs text-green-600">
                            New SN: {field.newSerialNumber}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => removePart(originalIndex)}
                          className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <p className="text-2xl font-black text-[#10B981] mt-4">
                          £{totalCost.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {field.quantity} × £{field.unitCost?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
