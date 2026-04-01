"use client";
import React, { useState } from "react";
import {
  X,
  Phone,
  ChevronDown,
  Bell,
  Calendar as CalendarIcon,
  Clock,
  Check,
} from "lucide-react";

interface CallLogFormProps {
  onClose: () => void;
  editingData?: any;
}

const CallLogForm = ({ onClose, editingData }: CallLogFormProps) => {
  const [showFollowUp, setShowFollowUp] = useState(false);

  return (
    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="p-6 pb-2 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200 mt-2">
            <Phone size={15} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              Log New Call
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Record details of a new customer call
            </p>
          </div>
        </div>
        <button
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
            type="text"
            placeholder="Enter customer name"
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Phone Number *
          </label>
          <input
            type="text"
            placeholder="+44 7700 900000"
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">Address</label>
          <input
            type="text"
            placeholder="Enter customer address"
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Post Code
            </label>
            <input
              type="text"
              placeholder="Enter post code"
              className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800 px-2">
              City
            </label>
            <input
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
              <select className="w-full h-11 pl-4 pr-10 rounded-xl border-2 border-gray-200 bg-white outline-none appearance-none text-gray-700 font-medium cursor-pointer focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all">
                <option>Support</option>
                <option>Sales</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Priority *
            </label>
            <div className="relative">
              <select className="w-full h-11 pl-4 pr-10 rounded-xl border-2 border-gray-200 bg-white outline-none appearance-none text-gray-700 font-medium cursor-pointer focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all">
                <option>Medium</option>
                <option>High</option>
                <option>Low</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Agent Name *
          </label>
          <input
            type="text"
            placeholder="Enter agent name"
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Call Purpose *
          </label>
          <input
            type="text"
            placeholder="Brief description of call purpose"
            className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Call Notes
          </label>
          <textarea
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
                    Follow-Up Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full h-10 pl-4 pr-10 rounded-lg border-2 border-transparent bg-gray-50/50 text-sm outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all appearance-none"
                    />
                    <CalendarIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-800">
                    Follow-Up Time *
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full h-11 px-4 rounded-xl border-2 border-transparent bg-gray-50/50 outline-none focus:bg-white focus:border-[#4F46E5]/60 focus:ring-4 focus:ring-[#4F46E5]/10 transition-all text-gray-700 font-medium"
                    />
                    <Clock
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-800">
                  Follow-Up Notes
                </label>
                <textarea
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
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <X size={16} /> Cancel
        </button>
        <button className="px-8 py-2.5 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
          <Phone size={16} fill="currentColor" /> Log Call
        </button>
      </div>
    </div>
  );
};

export default CallLogForm;
