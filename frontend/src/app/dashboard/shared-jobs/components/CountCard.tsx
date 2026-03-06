"use client";
import React from "react";
import { Share2 } from "lucide-react";

interface CountCardProps {
  total: number;
}

const SharedJobsCount = ({ total }: CountCardProps) => {
  return (
    <div className="w-full h-24 bg-linear-to-br from-teal-500 to-cyan-600 rounded-2xl p-4 flex justify-between items-center shadow-lg transition-transform hover:scale-105 cursor-pointer">
      <div className="flex flex-col justify-between h-full">
        <span className="text-white/90 text-xs font-semibold tracking-wide">
          Total Shared Jobs
        </span>
        <span className="text-white text-3xl font-bold leading-none">
          {total}
        </span>
      </div>

      <div className="text-white/80">
        <Share2 size={32} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default SharedJobsCount;
