"use client";
import React, { useState } from "react";
import { Users, UserCheck, Settings, CheckCircle2 } from "lucide-react";

const RecipientSettings = () => {
  const [activeRecipient, setActiveRecipient] = useState("Customer");

  const recipients = [
    {
      id: "Customer",
      name: "Customer",
      icon: Users,
      color: "text-white",
      bg: "bg-[#4F46E5]",
    },
    {
      id: "Admin",
      name: "Admin",
      icon: Settings,
      color: "text-white",
      bg: "bg-[#A855F7]",
    },
    {
      id: "Staff",
      name: "Assigned Staff",
      icon: UserCheck,
      color: "text-white",
      bg: "bg-[#00D27A]",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-[#F3F6FF] p-4 flex items-center gap-3 border-b border-slate-50">
        <div className="bg-[#4F46E5] p-2 rounded-lg text-white">
          <Users size={18} />
        </div>
        <div>
          <h2 className="text-[14px] font-bold text-[#1E1F4B]">
            Recipient Settings
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Define who should receive this alert
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipients.map((rec) => (
            <button
              key={rec.id}
              onClick={() => setActiveRecipient(rec.id)}
              className={`relative p-3 h-[140px] rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                activeRecipient === rec.id
                  ? "border-purple-500 bg-[#FAF7FF] shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div
                className={`${rec.bg} ${rec.color} p-2.5 rounded-xl shadow-sm`}
              >
                <rec.icon size={20} />
              </div>

              <span className="text-[13px] font-bold text-[#1E1F4B]">
                {rec.name}
              </span>

              <div
                className={`mt-1 transition-opacity duration-300 ${activeRecipient === rec.id ? "opacity-100" : "opacity-0"}`}
              >
                <CheckCircle2
                  size={16}
                  className="text-[#00D27A]"
                  fill="white"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipientSettings;
