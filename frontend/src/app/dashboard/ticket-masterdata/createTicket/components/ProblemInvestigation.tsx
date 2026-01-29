"use client";

import React, { useEffect, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import { Controller, useFieldArray } from "react-hook-form";
import { CustomSelect } from "../../../../common-form/CustomSelect";

interface MobilityPart {
  _id: string;
  partName: string;
  partNumber: string;
  unitCost: number;
}

const ProblemInvestigation = ({
  form,
  mobilityParts = [],
}: {
  form: any;
  mobilityParts: MobilityPart[];
}) => {
  const { control, register, setValue, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "investigationParts",
  });

  const watchedParts = watch("investigationParts");
  const isInitialized = useRef(false);

  const partOptions = mobilityParts.map((part) => ({
    id: part._id,
    label: `${part.partName} (${part.partNumber})`,
  }));

  const addPart = () => {
    append({
      partId: "",
      partName: "",
      partNumber: "",
      quantity: 1,
      unitCost: 0,
      total: 0,
    });
  };

  const handlePartSelect = (selectedId: string, index: number) => {
    const selectedPart = mobilityParts.find((p) => p._id === selectedId);
    if (!selectedPart) return;

    setValue(`investigationParts.${index}.partId`, selectedPart._id);
    setValue(`investigationParts.${index}.partName`, selectedPart.partName);
    setValue(`investigationParts.${index}.partNumber`, selectedPart.partNumber);
    setValue(`investigationParts.${index}.unitCost`, selectedPart.unitCost);

    const currentQty = watchedParts?.[index]?.quantity || 1;
    setValue(
      `investigationParts.${index}.total`,
      currentQty * selectedPart.unitCost,
    );
  };

  useEffect(() => {
    watchedParts?.forEach((field: any, index: number) => {
      if (field?.partId) {
        const selectedPart = mobilityParts.find((p) => p._id === field.partId);
        if (selectedPart) {
          setValue(
            `investigationParts.${index}.partNumber`,
            selectedPart.partNumber,
          );
          setValue(
            `investigationParts.${index}.unitCost`,
            selectedPart.unitCost,
          );

          const qty = field.quantity || 1;
          setValue(
            `investigationParts.${index}.total`,
            qty * selectedPart.unitCost,
          );
        }
      }
    });

    isInitialized.current = true;
  }, [mobilityParts, watchedParts, setValue]);
  return (
    <div className="self-stretch bg-white/80 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="h-20 px-6 pt-5 bg-linear-to-r from-indigo-500 to-purple-500 flex flex-col justify-start items-start">
        <h2 className="text-white text-lg font-bold font-['Arial']">
          Problem Investigation
        </h2>
        <p className="text-white/90 text-sm font-normal font-['Arial']">
          Parts required, cost & approval
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Report Field */}
        <div className="space-y-2">
          <label className="text-indigo-950 text-base font-medium font-['Arial']">
            Investigation Report *
          </label>
          <Controller
            name="investigationReportData"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full h-24 p-3 bg-gray-100 rounded-[10px] border-2 border-indigo-100 outline-none focus:border-indigo-400 text-gray-700 text-sm transition-colors resize-none"
                placeholder="Enter the investigation report..."
              />
            )}
          />
        </div>

        {/* Parts Section */}
        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial']">
            Parts Required (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-bold text-base">
                    Part {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Search Part */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Search Part:
                    </span>
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`investigationParts.${index}.partId`}
                        render={({ field: controllerField }) => (
                          <CustomSelect
                            options={partOptions}
                            placeholder="Type to search part..."
                            isSearchable={true}
                            value={controllerField.value}
                            onChange={(id: string) => {
                              controllerField.onChange(id);
                              handlePartSelect(id, index);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Part Number - READONLY */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Part Number:
                    </span>
                    <input
                      {...register(`investigationParts.${index}.partNumber`)}
                      type="text"
                      readOnly
                      className="flex-1 h-10 px-3 bg-gray-200 cursor-not-allowed rounded-[10px] border-2 border-transparent text-gray-500 text-sm outline-none"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Quantity:
                    </span>
                    <input
                      {...register(`investigationParts.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      className="flex-1 h-10 px-3 bg-gray-100 rounded-[10px] border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-indigo-950 text-sm font-normal">
                      Unit Cost:
                    </span>
                    <input
                      {...register(`investigationParts.${index}.unitCost`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.01"
                      className="flex-1 h-10 px-3 bg-gray-100 rounded-[10px] border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addPart}
              type="button"
              className="w-full h-10 flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 bg-indigo-50/10 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 mt-2"
            >
              <Plus size={16} className="text-indigo-500 stroke-[3px]" />
              <span className="text-indigo-600 font-medium text-sm">
                Add Part
              </span>
            </button>
          </div>
        </div>

        {/* Email logic */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] mb-3 block">
            Send Report to Customer (Optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              {...register("isEmailSendReport")}
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
