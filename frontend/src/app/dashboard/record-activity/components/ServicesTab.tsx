"use client";
import React from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { ActivityRecordFormData } from "../../../../schema/activityRecordSchema";
import { CustomSelect } from "../../../common-form/CustomSelect"; // apna correct path
import FormField from "../../suppliers/components/FormInput"; // apna correct path

interface ServicesTabProps {
  form: UseFormReturn<ActivityRecordFormData>;
  serviceTypes: any[];
  serviceFields: any[];
  addService: (data?: any) => void;
  removeService: (index: number) => void;
  totalDuration: number;
}

export const ServicesTab = ({
  form,
  serviceTypes,
  serviceFields,
  addService,
  removeService,
  totalDuration,
}: ServicesTabProps) => {
  const { register, setValue, watch } = form;

  const lastIndex = serviceFields.length;
  const currentActivityId = watch(`services.${lastIndex}.activityId`);
  const currentDuration = watch(`services.${lastIndex}.duration`);
  const currentDescription = watch(`services.${lastIndex}.description`);
  const currentAdditionalNotes = watch(`services.${lastIndex}.additionalNotes`);

  const formatTotalTime = (total: number) => {
    if (total < 60) return `${total}m`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h}h ${m}m`;
  };

  const getServiceTypeName = (activityId: string) => {
    if (!activityId) return "Unknown";

    const serviceType = serviceTypes.find(
      (st) => st._id === activityId || st.id === activityId,
    );
    return serviceType?.technicianServiceType || "Unknown";
  };

  const handleAddActivity = () => {
    if (!currentActivityId || !currentDuration || !currentDescription) {
      alert("Please fill all required fields (*)");
      return;
    }

    addService({
      activityId: currentActivityId,
      duration: currentDuration.toString(),
      description: currentDescription,
      additionalNotes: currentAdditionalNotes || "",
    });
  };

  const inputIndex = serviceFields.length;

  const completedServices = serviceFields.filter(
    (_, index) => index !== inputIndex && serviceFields[index].activityId,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-[#4F39F6] font-bold">
          <Plus size={20} />
          <span className="text-sm">Add Service Activity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Activity Type <span className="text-red-500">*</span>
            </label>

            <CustomSelect
              options={serviceTypes.map((st) => ({
                id: st._id || st.id,
                label: st.technicianServiceType || "Unknown",
              }))}
              value={currentActivityId || ""}
              placeholder="Select activity type"
              isSearchable={true}
              onChange={(val: string) => {
                setValue(`services.${inputIndex}.activityId`, val, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </div>

          <FormField
            label="Duration (minutes) *"
            type="number"
            placeholder="30"
            value={currentDuration || ""}
            min="1"
            required
            onChange={(e) => {
              const value = e.target.value;
              setValue(
                `services.${inputIndex}.duration`,
                value === "" ? "" : (Number(value) as any),
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
            }}
          />
        </div>

        <div className="space-y-2 mb-6">
          <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm resize-none"
            placeholder="Describe what was done..."
            rows={3}
            {...register(`services.${inputIndex}.description`)}
            value={currentDescription || ""}
            onChange={(e) =>
              setValue(`services.${inputIndex}.description`, e.target.value)
            }
          />
        </div>

        <div className="space-y-2 mb-8">
          <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            Additional Notes
          </label>
          <input
            type="text"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm"
            placeholder="Any additional notes..."
            {...register(`services.${inputIndex}.additionalNotes`)}
            value={currentAdditionalNotes || ""}
            onChange={(e) =>
              setValue(`services.${inputIndex}.additionalNotes`, e.target.value)
            }
          />
        </div>

        <button
          type="button"
          onClick={handleAddActivity}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 px-4 py-2 has-[>svg]:px-3 w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-12 text-white"
        >
          <Plus size={20} />
          <span>Add Service Activity</span>
        </button>
      </div>
      <AnimatePresence>
        {completedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#F6FFF9] border border-emerald-100 rounded-3xl p-6 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-6 text-[#10B981] font-bold">
              <CheckCircle2 size={20} />
              <span className="text-sm">
                Recorded Service Activities ({completedServices.length})
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {completedServices.map((field) => {
                const originalIndex = serviceFields.findIndex(
                  (f) => f.id === field.id,
                );

                const serviceTypeName = getServiceTypeName(field.activityId);
                const date = new Date().toLocaleString("en-GB");

                return (
                  <motion.div
                    key={field.id}
                    layout
                    className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm relative group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white text-[9px] font-black px-2 py-0.5 rounded uppercase bg-[#0070F3]">
                          {serviceTypeName}
                        </span>
                        <span className="text-[11px] text-gray-400 font-bold">
                          {date}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Duration
                          </p>
                          <p className="text-[#0061FF] font-black text-lg">
                            {field.duration || 0}m
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => removeService(originalIndex)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-800">
                        {field.description || "No description provided"}
                      </p>
                      {field.additionalNotes && (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">
                            {field.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-[#0061FF] rounded-2xl p-5 flex items-center justify-between text-white shadow-inner">
              <span className="font-bold tracking-wide">Total Time Spent:</span>
              <span className="text-2xl font-black">
                {formatTotalTime(totalDuration)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
