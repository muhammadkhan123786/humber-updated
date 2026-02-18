"use client";
import React, { useEffect } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { ActivityRecordFormData } from "../../../../schema/activityRecordSchema";
import { CustomSelect } from "../../../common-form/CustomSelect";
import FormField from "../../suppliers/components/FormInput";

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
  totalPartsCost,
}: PartsTabProps) => {
  const { register, watch, setValue } = form;

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
    setValue(`parts.${nextIndex}.totalCost`, total, { shouldDirty: true });
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
    const newIndex = nextIndex + 1;
    setValue(
      `parts.${newIndex}`,
      {
        partId: "",
        oldPartConditionDescription: "",
        newSerialNumber: "",
        quantity: 1,
        unitCost: 0,
        totalCost: 0,
        reasonForChange: "",
      },
      { shouldValidate: true },
    );
  };

  const getPartName = (partId: string) =>
    parts.find((p) => p._id === partId)?.partName || "Unknown";

  const getPartNumber = (partId: string) =>
    parts.find((p) => p._id === partId)?.partNumber || "N/A";

  const currentTotalCost = currentQuantity * currentUnitCost;
  const completedParts = partFields.filter((f) => f.partId);

  const totalUnits = partFields.reduce((acc, field) => {
    if (field.partId) {
      const qty =
        field.quantity !== undefined && field.quantity !== null
          ? Number(field.quantity)
          : 1;
      return acc + qty;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AnimatePresence>
        {completedParts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFF6FB] border border-pink-100 rounded-3xl p-8 flex flex-wrap justify-around items-center shadow-sm"
          >
            <div className="flex flex-col items-center text-center mx-4">
              <Package className="text-[#A855F7] mb-2" size={32} />
              <span className="text-2xl font-black text-[#A855F7]">
                {completedParts.length}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Parts Changed
              </span>
            </div>

            <div className="flex flex-col items-center text-center mx-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Units
              </span>
              <span className="text-2xl font-black text-[#6366F1]">
                {totalUnits}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Units
              </span>
            </div>

            <div className="flex flex-col items-center text-center mx-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Cost
              </span>
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
        <div className=" mb-6  font-bold leading-none flex items-center gap-2 text-purple-600">
          <Plus size={20} />
          <span className="">Record Part Change</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Part Name <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={parts.map((p) => ({
                id: p._id,
                label: `${p.partName} (${p.partNumber} - £${p.unitCost})`,
              }))}
              value={currentPartId || ""}
              placeholder="Select a part from inventory..."
              isSearchable
              onChange={(val: string) =>
                setValue(`parts.${nextIndex}.partId`, val, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          <FormField
            label="Part Number *"
            name="partNumber"
            value={selectedPart?.partNumber || ""}
            type="text"
            disabled
            labelClassName={true}
          />

          <FormField
            label="Old Part Condition"
            placeholder="e.g. Damaged"
            required
            labelClassName={true}
            value={
              watch(`parts.${nextIndex}.oldPartConditionDescription`) || ""
            }
            onChange={(e) =>
              setValue(
                `parts.${nextIndex}.oldPartConditionDescription`,
                e.target.value,
                { shouldDirty: true, shouldValidate: true },
              )
            }
          />

          <FormField
            label="New Serial Number"
            placeholder="SN-123456"
            labelClassName={true}
            value={watch(`parts.${nextIndex}.newSerialNumber`) || ""}
            onChange={(e) =>
              setValue(`parts.${nextIndex}.newSerialNumber`, e.target.value, {
                shouldDirty: true,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FormField
            label="Quantity"
            type="number"
            labelClassName={true}
            required
            value={currentQuantity !== undefined ? Number(currentQuantity) : 1}
            onChange={(e) => {
              let value: number;

              if (e.target.value === "" || isNaN(Number(e.target.value))) {
                value = 1;
              } else {
                value = Math.max(1, Number(e.target.value));
              }

              setValue(`parts.${nextIndex}.quantity`, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Unit Cost (£)
            </label>
            <div className="w-full h-9 px-4 flex items-center bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-medium text-sm">
              £{currentUnitCost?.toFixed(2) || "0.00"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Total Cost (£)
            </label>
            <div className="w-full h-9 px-4 flex items-center bg-purple-50 border border-purple-100 rounded-2xl text-[#A855F7] font-black text-sm">
              £{currentTotalCost.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
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
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 px-4 py-2 has-[>svg]:px-3 w-full bg-linear-to-r text-white from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
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
              {completedParts.map((field, index) => {
                const totalCost = (field.quantity || 1) * (field.unitCost || 0);

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
                          onClick={() => removePart(index)}
                          className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <p className="text-2xl font-black text-[#10B981] mt-4">
                          £{totalCost.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {field.quantity || 1} × £{field.unitCost?.toFixed(2)}
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
