"use client";
import React, { useState } from "react";
import {
  Smartphone,
  Mail,
  MessageSquare,
  Bell,
  Check,
  Send,
} from "lucide-react";

const CommunicationMode = () => {
  const [selectedModes, setSelectedModes] = useState(["sms", "email"]);

  const modes = [
    {
      id: "sms",
      label: "SMS",
      icon: <MessageSquare size={20} />,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      activeBgColor: "bg-blue-500",
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail size={20} />,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      activeBgColor: "bg-pink-500",
    },
    {
      id: "wa",
      label: "WhatsApp",
      icon: <Send size={20} />,
      color: "text-green-500",
      bgColor: "bg-green-50",
      activeBgColor: "bg-green-500",
    },
    {
      id: "push",
      label: "Push Notification",
      icon: <Bell size={20} />,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      activeBgColor: "bg-orange-500",
    },
  ];

  const toggleMode = (id: string) => {
    setSelectedModes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="bg-[#F0FFF9] p-5 flex items-start gap-4 border-b border-[#E0F2F1]">
        <div className="bg-[#00C48C] p-2 rounded-xl text-white shadow-sm">
          <Smartphone size={18} />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-[#1E1F4B]">
            Communication Mode
          </h2>
          <p className="text-[12px] text-[#808191]">
            Select one or more notification channels
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modes.map((mode) => {
            const isActive = selectedModes.includes(mode.id);
            return (
              <div
                key={mode.id}
                onClick={() => toggleMode(mode.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 relative
                  ${
                    isActive
                      ? "border-purple-300 bg-[#F9F7FF]"
                      : "border-gray-100 bg-white hover:border-purple-200"
                  }
                `}
              >
                <div
                  className={`p-2 rounded-lg transition-all ${
                    isActive ? mode.activeBgColor : mode.bgColor
                  } ${isActive ? "text-white" : mode.color}`}
                >
                  {mode.icon}
                </div>

                <div className="flex flex-col flex-1">
                  <span className="font-bold text-[14px] text-[#1E1F4B]">
                    {mode.label}
                  </span>

                  {isActive && (
                    <div className="flex items-center gap-1 mt-1 bg-[#00C48C] text-white px-2 py-0.5 rounded-md w-fit">
                      <Check size={10} strokeWidth={4} />
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        Active
                      </span>
                    </div>
                  )}
                </div>

                {!isActive && (
                  <div className="ml-auto w-5 h-5 border-2 border-gray-200 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunicationMode;
