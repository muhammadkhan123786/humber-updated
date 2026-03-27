"use client";
import React, { useState } from "react";
import {
  Mail,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Sparkles,
} from "lucide-react";

const MessageTemplate = () => {
  const [message, setMessage] = useState("");
  const maxLength = 160;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-white/50 overflow-hidden">
      <div className="bg-[#FFF9F0] p-6 border-b border-orange-50">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-100">
            <Mail size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold tracking-wide text-[#1E1F4B]">
              Message Template
            </h2>
            <p className="text-[11px] text-[#808191] font-medium">
              Select a template or create custom message
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
            Select Template
          </label>
          <div className="flex gap-3">
            <select className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] appearance-none cursor-pointer transition-all">
              <option value="">Choose a template...</option>
              <option value="welcome">Welcome Message</option>
              <option value="status">Status Update</option>
            </select>
            <button className="flex items-center gap-2 px-5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-[#1E1F4B] hover:bg-slate-50 transition-all shadow-sm">
              <Eye size={16} className="text-slate-500" />
              Preview
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
            Message Body <span className="text-purple-500">*</span>
          </label>

          <div className="border border-slate-100 rounded-2xl overflow-hidden focus-within:border-purple-300 transition-all shadow-sm">
            <div className="flex items-center justify-between p-2 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all">
                  <Bold size={16} />
                </button>
                <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all">
                  <Italic size={16} />
                </button>
                <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all">
                  <Underline size={16} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all">
                  <List size={16} />
                </button>
                <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all">
                  <ListOrdered size={16} />
                </button>
              </div>

              <button className="flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-[12px] font-bold shadow-md hover:opacity-90 transition-all active:scale-95">
                <Sparkles size={14} />
                AI Assistant
              </button>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message template here... Use dynamic variables like {CustomerName}, {TicketNo}, etc."
              className="w-full h-64 p-5 outline-none text-[14px] leading-relaxed text-[#1E1F4B] placeholder:text-[#ACB5BD] resize-none"
              maxLength={maxLength}
            />
          </div>

          <div className="flex justify-between items-center px-1 mt-2">
            <p className="text-[11px] text-[#808191] font-medium">
              Character count: {message.length}
            </p>
            <p
              className={`text-[11px] font-bold ${message.length >= maxLength ? "text-red-500" : "text-[#808191]"}`}
            >
              {maxLength - message.length} remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplate;
