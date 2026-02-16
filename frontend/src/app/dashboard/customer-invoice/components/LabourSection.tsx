"use client";
import React from "react";
import { Trash2, Plus, Clock, Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormData } from "../../../../schema/invoice.schema";

interface LabourSectionProps {
  labourItems: any[];
  serviceTypes: any[];
  form: UseFormReturn<InvoiceFormData>;
  addService: () => void;
  serviceFields: any[];
}

const LabourSection: React.FC<LabourSectionProps> = ({
  serviceTypes,
  form,
  addService,
  serviceFields,
}) => {
  const { register, watch, setValue, getValues } = form;

  const watchedServices = watch("services") || [];

  const removeLabour = (index: number) => {
    const currentServices = getValues("services") || [];
    const updated = currentServices.filter((_, i) => i !== index);
    setValue("services", updated as any);
  };

  const handleAddService = () => {
    addService();
  };

  const subtotal = watchedServices.reduce(
    (acc: number, item: any) =>
      acc + Number(item.duration || 0) * Number(item.rate || 50),
    0,
  );

  const getServiceTypeName = (activityId: string) => {
    if (!activityId) return "";
    const serviceType = serviceTypes.find((type) => type._id === activityId);
    return serviceType?.technicianServiceType || "";
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl border-2 border-purple-100 flex flex-col gap-6 font-sans shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Clock size={20} />
            <h2 className="text-lg font-semibold tracking-tight">
              Labour & Services
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Add or modify labour charges for this job
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddService}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md"
        >
          <Plus size={18} /> Add Labour
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {serviceFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-purple-50 rounded-2xl bg-purple-50/20">
            <Clock size={48} className="text-purple-200" />
            <p className="text-slate-500 font-medium">
              No labour items added yet.
            </p>
          </div>
        ) : (
          <>
            {serviceFields.map((field, index) => {
              const currentItem = watchedServices[index];
              if (!currentItem) return null;

              const isFromJob = currentItem.source === "JOB";

              const rate = Number(currentItem.rate) || 50;
              const lineTotal = (Number(currentItem.duration) || 0) * rate;

              const serviceTypeName = getServiceTypeName(
                currentItem.activityId,
              );

              return (
                <div
                  key={field.id}
                  className={`w-full p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 flex flex-col gap-4 ${
                    isFromJob ? "bg-purple-50/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                        Labour #{index + 1}
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
                        onClick={() => removeLabour(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4 flex flex-col gap-1">
                      <label className="text-indigo-950 text-xs font-semibold">
                        Service Type
                      </label>
                      {isFromJob ? (
                        <input
                          type="text"
                          value={serviceTypeName}
                          readOnly
                          className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-purple-100 text-sm text-gray-700"
                        />
                      ) : (
                        <select
                          {...register(`services.${index}.activityId` as any)}
                          className="w-full h-10 px-3 bg-white rounded-xl border border-purple-100 text-sm focus:ring-2 ring-purple-300 outline-none"
                        >
                          <option value="">Select Service</option>
                          {serviceTypes?.map((type: any) => (
                            <option key={type._id} value={type._id}>
                              {type.technicianServiceType}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="col-span-12 md:col-span-4 flex flex-col gap-1">
                      <label className="text-indigo-950 text-xs font-semibold">
                        Description
                      </label>
                      <input
                        {...register(`services.${index}.description` as any)}
                        readOnly={isFromJob}
                        placeholder="Enter description..."
                        className={`w-full h-10 px-3 bg-white rounded-xl border border-purple-100 text-sm focus:ring-2 ring-purple-300 outline-none ${
                          isFromJob ? "bg-gray-50 read-only:bg-gray-50" : ""
                        }`}
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2 flex flex-col gap-1">
                      <label className="text-indigo-950 text-xs font-semibold">
                        Hours
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        {...register(`services.${index}.duration` as any, {
                          valueAsNumber: true,
                        })}
                        readOnly={isFromJob}
                        className={`w-full h-10 px-3 bg-white rounded-xl border border-purple-100 text-sm focus:ring-2 ring-purple-300 outline-none ${
                          isFromJob ? "bg-gray-50 read-only:bg-gray-50" : ""
                        }`}
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2 flex flex-col gap-1">
                      <label className="text-indigo-950 text-xs font-semibold">
                        Rate (£/hr)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={50}
                        {...register(`services.${index}.rate` as any, {
                          valueAsNumber: true,
                        })}
                        className="w-full h-10 px-3 bg-white rounded-xl border border-purple-200 text-sm focus:ring-2 ring-purple-300 outline-none font-bold text-purple-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-4 py-2 bg-white/60 rounded-xl border border-white">
                    <span className="text-gray-600 text-sm font-medium">
                      Line Total:
                    </span>
                    <span className="text-purple-600 text-2xl font-bold">
                      £{lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="mt-2 p-5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl flex justify-between items-center text-white shadow-lg">
              <div className="flex flex-col">
                <span className="text-purple-100 text-xs uppercase tracking-wider font-bold">
                  Total Estimate
                </span>
                <span className="text-xl font-bold">Labour Subtotal</span>
              </div>
              <span className="text-4xl font-black">
                £{subtotal.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LabourSection;
