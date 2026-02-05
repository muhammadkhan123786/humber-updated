"use client";
import React from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { ActivityRecordFormData } from "../../../../schema/activityRecordSchema";

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
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Activity Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm"
              {...register(`services.${inputIndex}.activityId`)}
              value={currentActivityId || ""}
              onChange={(e) =>
                setValue(`services.${inputIndex}.activityId`, e.target.value)
              }
            >
              <option value="">Select activity type</option>
              {serviceTypes.map((serviceType) => (
                <option
                  key={serviceType._id || serviceType.id}
                  value={serviceType._id || serviceType.id}
                >
                  {serviceType.technicianServiceType || "Unknown"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm"
              placeholder="30"
              {...register(`services.${inputIndex}.duration`, {
                valueAsNumber: true,
              })}
              value={currentDuration || ""}
              onChange={(e) => {
                const value = e.target.value;

                setValue(
                  `services.${inputIndex}.duration`,
                  value === "" ? "" : (Number(value) as any),
                );
              }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
          className="w-full py-4 bg-linear-to-r from-[#0061FF] to-[#00C1FF] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Add Service Activity</span>
        </button>
      </div>

      {/* RECORDED SERVICE ACTIVITIES SECTION */}
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
