"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Layout,
  Settings,
  Package,
  CheckSquare,
  Image as ImageIcon,
  Clock
} from "lucide-react";

export const ActivityHero = () => {
  const stats = [
    { label: "Service Activities", value: "0", tag: "Activities", icon: Settings, color: "from-[#00B8DB] to-[#00BBA7]" },
    { label: "Parts Changed", value: "2", tag: "Parts", icon: Package, color: "from-[#E12AFB] to-[#FF2056]" },
    { label: "Completed", value: "0/8", tag: "Inspection", icon: CheckSquare, color: "from-[#00BC7D] to-[#7CCF00]" },
    { label: "Photos & Videos", value: "0", tag: "Media", icon: ImageIcon, color: "from-[#8E51FF] to-[#615FFF]" },
    { label: "Total Duration", value: "0m", tag: "Time", icon: Clock, color: "from-[#FF8C00] to-[#FF4500]" },
  ];

  return (
    <>
      <div className="bg-linear-to-r from-[#4F39F6] to-[#9810FA] p-6 rounded-3xl shadow-xl flex items-center gap-4 text-white mb-8">
        <Link href="/dashboard">
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all cursor-pointer group">
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </Link>
        <motion.div
    // 1. Initial entrance animation
    initial={{ scale: 0, rotate: -180 }}
    animate={{
      scale: 1,
      rotate: 360 // 2. Continuous 360 rotation
    }}
    transition={{
      scale: { type: "spring", duration: 0.8 },
      rotate: {
        repeat: Infinity,
        duration: 12, // Adjust speed: 12 seconds for a slow, premium feel
        ease: "linear",
      },
    }}
  >
    <Layout size={32} />
  </motion.div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Record Technician Activity</h1>
          <p className="text-white/80 font-medium text-sm">Enter service activities, parts, and inspection results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden p-5 rounded-2xl bg-linear-to-br ${stat.color} text-white shadow-lg transition-transform hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon size={22} className="opacity-90" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded-full">
                {stat.tag}
              </span>
            </div>
            <div>
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};