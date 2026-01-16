"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricProps {
  title: string;
  value: string | number;
  percentage: string;
  isPositive: boolean;
  icon: LucideIcon;
  gradient: string;
}

const MetricCard: React.FC<MetricProps> = ({
  title,
  value,
  percentage,
  isPositive,
  icon: Icon,
  gradient,
}) => {
  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      className={`relative flex flex-col justify-between p-6 rounded-[2.5rem] w-64 h-52 text-white shadow-xl overflow-hidden transition-transform hover:scale-105 ${gradient}`}
    >
      {/* --- Slow Motion Shine Layer --- */}
      <motion.div
        variants={{
          initial: { x: "-150%", skewX: "-20deg" },
          hover: { x: "150%", skewX: "-20deg" },
        }}
        transition={{
          duration: 1.8, // 0.75 se barha kar 1.8 kar diya taake slow guzre
          ease: "easeInOut",
        }}
        className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/25 to-transparent z-0 pointer-events-none"
      />

      <div className="relative z-10 flex justify-between items-start">
        <h3 className="text-[11px] font-bold uppercase tracking-wider opacity-90 leading-tight w-2/3">
          {title}
        </h3>

        {/* Glassmorphism Icon Box */}
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
          <motion.div
            variants={{
              initial: { rotate: 0 },
              hover: { rotate: 360 },
            }}
            transition={{
              duration: 0.8, // Icon rotation ko bhi thora slow kiya hai matching ke liye
              ease: "easeInOut",
            }}
            className="flex items-center justify-center"
          >
            <Icon size={22} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-5xl font-bold mb-4 tracking-tighter">{value}</div>

        <div className="flex items-center gap-2">
          <div className="bg-white/20 px-4 py-1.5 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center gap-1.5 text-[11px] font-bold shadow-sm">
            <span>{isPositive ? "↗" : "↘"}</span>
            {isPositive ? "+" : ""}
            {percentage}%
          </div>
          <span className="text-[9px] font-medium opacity-80 leading-3">
            vs last
            <br />
            month
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
