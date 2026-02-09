"use client";
import React from "react";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string | number;
  label: string;
  badgeText: string;
  gradient: string;
  Icon: LucideIcon;
}

const StatCard = ({
  value,
  label,
  badgeText,
  gradient,
  Icon,
}: StatCardProps) => {
  return (
    <div
      className={`flex-1 min-w-60 p-6 ${gradient} rounded-3xl shadow-lg flex flex-col justify-start items-start gap-4 transition-transform hover:scale-[1.02]`}
    >
      <div className="self-stretch flex justify-between items-center">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex justify-center items-center backdrop-blur-sm">
          <Icon size={24} color="white" strokeWidth={2} />
        </div>
        <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30 flex justify-center items-center">
          <span className="text-white text-xs font-bold font-sans tracking-wide">
            {badgeText}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1">
        <h2 className="text-white text-5xl font-bold font-sans">{value}</h2>
        <p className="text-white/90 text-sm font-medium font-sans">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
