"use client";
import React, { useState, useEffect } from "react";
import { X, Phone, ChevronDown, Bell, Check, Loader2 } from "lucide-react";
import { useCallLogs } from "../../../../../hooks/useCallLogsHook";

interface CallLogFormProps {
  onClose: () => void;
  editingData?: any;
  onSuccess?: () => void;
}

const CallLogForm = ({ onClose, editingData, onSuccess }: CallLogFormProps) => {
  const [showFollowUp, setShowFollowUp] = useState(false);

  const { form, onSubmit, isLoading, dropdowns } = useCallLogs(
    editingData,
    onClose,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  useEffect(() => {
    const shouldShow = !!editingData?.followUpDate;

    const timer = setTimeout(() => {
      setShowFollowUp(shouldShow);
    }, 0);

    return () => clearTimeout(timer);
  }, [editingData?.followUpDate]);

  return (
    <form
      onSubmit={handleSubmit(
        async (data) => {
          console.log("Submitting Data:", data);
          await onSubmit(data);
          if (onSuccess) onSuccess();
        },
        (err) => {
          console.log("Form Validation Errors:", err);
        },
      )}
      className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div className="p-6 pb-2 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200 mt-2">
            <Phone size={15} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 leading-tight">
              {editingData ? "Update Call Log" : "Log New Call"}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {editingData
                ? `Editing record for ${editingData.customerName}`
                : "Record details of a new customer call"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Customer Name *
          </label>
          <input
            {...register("customerName")}
            type="text"
            placeholder="Enter customer name"
            className={`w-full h-11 px-4 rounded-xl border-2 outline-none transition-all text-gray-700 font-medium ${
              errors.customerName
                ? "border-red-500 bg-red-50/30"
                : "border-transparent bg-gray-50/50 focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10"
            }`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-xs font-medium px-1">
              {errors.customerName.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Phone Number *
          </label>
          <input
            {...register("phoneNumber")}
            type="number"
            placeholder="+44 7700 900000"
            className={`w-full h-11 px-4 rounded-xl border-2 outline-none transition-all text-gray-700 font-medium ${
              errors.phoneNumber
                ? "border-red-500 bg-red-50/30"
                : "border-transparent bg-gray-50/50 focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs font-medium px-1">
              {errors.phoneNumber.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">Address</label>
          <input
            {...register("address")}
            type="text"
            placeholder="Enter customer address"
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800 px-2">
              Post Code
            </label>
            <input
              {...register("postCode")}
              type="text"
              placeholder="Post code"
              className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800 px-2">
              City
            </label>
            <input
              {...register("city")}
              type="text"
              placeholder="Enter city"
              className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Call Type *
            </label>
            <div className="relative">
              <select
                {...register("callTypeId")}
                className={`w-full h-11 pl-4 pr-10 rounded-xl border-2 bg-white outline-none appearance-none text-gray-700 font-medium cursor-pointer focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all ${errors.callTypeId ? "border-red-500" : "border-gray-200"}`}
              >
                <option value="">Select Type</option>
                {dropdowns.callTypes.map((type: any) => (
                  <option key={type._id} value={type._id}>
                    {type.callTypeName}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
            {errors.callTypeId && (
              <p className="text-red-500 text-xs font-medium">
                {errors.callTypeId.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Priority *
            </label>
            <div className="relative">
              <select
                {...register("priorityLevelId")}
                className={`w-full h-11 pl-4 pr-10 rounded-xl border-2 bg-white outline-none appearance-none text-gray-700 font-medium cursor-pointer focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all ${errors.priorityLevelId ? "border-red-500" : "border-gray-200"}`}
              >
                <option value="">Select Priority</option>
                {dropdowns.priorities.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.serviceRequestPrioprity}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
            {errors.priorityLevelId && (
              <p className="text-red-500 text-xs font-medium">
                {errors.priorityLevelId.message as string}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Agent Name *
          </label>
          <input
            {...register("agentName")}
            type="text"
            placeholder="Enter agent name"
            className={`w-full h-11 px-4 rounded-xl border-2 outline-none transition-all text-gray-700 font-medium ${
              errors.agentName
                ? "border-red-500"
                : "border-transparent bg-gray-50/50 focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10"
            }`}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Call Duration (mins)
          </label>
          <input
            {...register("callDuration")}
            type="text"
            inputMode="decimal"
            placeholder="e.g. 7.3"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*?)\..*/g, "$1");
            }}
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Call Purpose *
          </label>
          <input
            {...register("callPurpose")}
            type="text"
            placeholder="Brief description of call purpose"
            className={`w-full h-11 px-4 rounded-xl border-2 outline-none transition-all text-gray-700 font-medium ${
              errors.callPurpose
                ? "border-red-500"
                : "border-transparent bg-gray-50/50 focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Call Notes
          </label>
          <textarea
            {...register("callNotes")}
            placeholder="Detailed notes about the call..."
            className="w-full min-h-[100px] p-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 resize-none"
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="peer hidden"
                checked={showFollowUp}
                onChange={() => setShowFollowUp(!showFollowUp)}
              />
              <div className="w-5 h-5 border-2 border-blue-500 rounded flex items-center justify-center transition-all peer-checked:bg-blue-500">
                {showFollowUp && (
                  <Check size={14} className="text-white" strokeWidth={4} />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-orange-500" />
              <span className="text-sm font-bold text-[#1e293b]">
                Schedule Follow-Up Reminder
              </span>
            </div>
          </label>

          {showFollowUp && (
            <div className="mt-4 ml-2 pl-4 border-l-2 border-orange-500 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-800">
                    Follow-Up Date
                  </label>
                  <input
                    {...register("followUpDate")}
                    type="date"
                    className="w-full h-10 px-4 rounded-lg border-2 border-transparent bg-gray-50/50 text-sm outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-800">
                    Follow-Up Time
                  </label>
                  <input
                    {...register("followUpTime")}
                    type="time"
                    className="w-full h-10 px-4 rounded-lg border-2 border-transparent bg-gray-50/50 text-sm outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-800">
                  Follow-Up Notes
                </label>
                <textarea
                  {...register("followUpNotes")}
                  placeholder="What should be done in the follow-up..."
                  className="w-full min-h-20 p-3 rounded-lg border-2 border-transparent bg-gray-50/50 text-sm outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-50 flex justify-end gap-3 bg-white">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <X size={16} /> Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Phone size={16} fill="currentColor" />
          )}
          {editingData ? "Update Log" : "Log Call"}
        </button>
      </div>
    </form>
  );
};

export default CallLogForm;
