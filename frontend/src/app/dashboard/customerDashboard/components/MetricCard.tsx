"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp } from "lucide-react";

interface MetricProps {
  title: string;
  value: string | number;
  percentage: string | number;
  isPositive: boolean;
  icon: LucideIcon;
  gradient: string;
  className?: string;
  // Dynamic dimensions props
  width?: string;
  height?: string;
}

const MetricCard: React.FC<MetricProps> = ({
  title,
  value,
  percentage,
  isPositive,
  icon: Icon,
  gradient,
  className = "",
  width = "w-[]", // Default width
  height = "h-[200px]", // Default height
}) => {
  return (
    <div className={`relative ${width} ${height} group ${className}`}>
      {/* Background Glow */}
      <div
        className={`absolute inset-0 ${gradient} opacity-20 blur-xl rounded-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-40`}
      />

      <motion.div
        initial="initial"
        whileHover="hover"
        variants={{
          initial: { scale: 1, y: 0 },
          hover: { scale: 1.04, y: -5 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative ${gradient} w-full h-full rounded-2xl shadow-2xl overflow-hidden z-10 cursor-pointer`}
      >
        {/* Shine Animation */}
        <motion.div
          variants={{
            initial: { x: "-150%", skewX: "-20deg" },
            hover: { x: "150%", skewX: "-20deg" },
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"
        />

        {/* Decorative Dots */}
        <div className="absolute right-[18px] top-2 flex gap-1 z-10">
          <div className="w-2 h-2 bg-white/40 rounded-full" />
          <div className="w-2 h-2 bg-white/30 rounded-full" />
          <div className="w-2 h-2 bg-white/20 rounded-full" />
        </div>

        {/* Main Content (Top Section) */}
        <div className="absolute left-6 top-6 right-6 flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <h3 className="text-white/90 text-[13px] font-normal uppercase leading-5 tracking-tight font-['Arial'] max-w-[100px]">
              {title}
            </h3>
            <div className="text-white text-4xl font-bold leading-10 font-['Arial'] drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
              {value}
            </div>
          </div>

          {/* Icon Box */}
          <div className="w-16 h-16 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-center backdrop-blur-md shadow-xl shrink-0">
            <motion.div
              variants={{
                initial: { rotate: 0 },
                hover: { rotate: 360 },
              }}
              transition={{ duration: 0.8, ease: "linear" }}
            >
              <Icon size={28} className="text-white" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats Section - Positioned relative to bottom */}
        <div className="absolute left-6 bottom-8 right-6 flex justify-between items-center">
          {/* Percentage Pill */}
          <div className="h-10 px-3 bg-white/25 rounded-2xl border border-white/30 flex items-center gap-2 backdrop-blur-lg shadow-lg">
            <div
              className={`flex items-center justify-center ${!isPositive ? "rotate-180" : ""}`}
            >
              <span className="text-white">
                <TrendingUp size={18} />
              </span>
            </div>
            <span className="text-white text-base font-bold font-['Arial']">
              {isPositive ? "+" : ""}
              {percentage}%
            </span>
          </div>

          {/* vs last month text */}
          <div className="text-white/80 text-xs font-normal font-['Arial'] leading-4 text-right">
            vs last <br /> month
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="absolute left-0 bottom-0 w-full h-1 bg-white/30" />
      </motion.div>
    </div>
  );
};

export default MetricCard;
