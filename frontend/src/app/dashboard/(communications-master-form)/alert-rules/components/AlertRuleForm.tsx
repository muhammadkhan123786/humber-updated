"use client";
import { Zap, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface FormProps {
  onCancel: () => void;
  modules: string[];
  channels: string[];
}

const FormInput = ({ label, placeholder, type = "text" }: any) => (
  <div className="space-y-1 flex-1">
    <label className="text-[13px] font-semibold text-slate-800 ml-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white shadow-inner focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all placeholder:text-slate-400 text-sm"
    />
  </div>
);

export const AlertRuleForm = ({ onCancel, modules, channels }: FormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="bg-linear-to-br from-white to-purple-50 rounded-2xl border border-slate-200 p-6 md:p-7 overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="bg-linear-to-r from-purple-500 to-pink-500 p-2.5 rounded-xl text-white shadow-lg shadow-purple-100">
          <Zap size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Create New Alert Rule
        </h2>
      </div>

      <form className="space-y-5">
        <div className="flex flex-col md:flex-row gap-5">
          <FormInput label="Rule Name" placeholder="Enter rule name" />
          <div className="space-y-1 flex-1 relative">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Module
            </label>
            <div className="relative">
              <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-white shadow-inner focus:ring-2 focus:ring-blue-700 outline-none transition-all text-sm appearance-none pr-10 text-slate-700">
                {modules.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <FormInput
            label="Trigger Condition"
            placeholder="e.g., Stock Level Below Threshold"
          />
          <FormInput
            label="Threshold Value"
            placeholder="e.g., 5 units, 48 hours"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-end">
          <FormInput
            label="Assigned Role"
            placeholder="e.g., Warehouse Manager"
          />
          <div className="flex-1 space-y-2 pb-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Notification Channels
            </label>
            <div className="flex items-center gap-4 pt-1">
              {channels.map((channel) => (
                <label
                  key={channel}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="accent-purple-500 size-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-600">{channel}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-2 rounded-lg font-bold bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 active:scale-95 text-sm"
          >
            Create Rule
          </button>
        </div>
      </form>
    </motion.div>
  );
};
