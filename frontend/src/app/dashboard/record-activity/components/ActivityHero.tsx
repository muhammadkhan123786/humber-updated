"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ClipboardEdit } from "lucide-react";

interface ActivityHeroProps {
  actualServicesCount?: number;
  actualPartsCount?: number;
  completedInspections?: number;
  totalInspectionTypes?: number;
  totalMedia?: number;
  totalDuration?: number;
}

export const ActivityHero = ({}: ActivityHeroProps) => {
  return (
    <div className="bg-linear-to-r from-[#4F39F6] to-[#9810FA] p-6 rounded-3xl shadow-xl flex items-center gap-4 text-white mb-8">
      <Link href="/dashboard">
        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all cursor-pointer group">
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>
      </Link>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 360,
        }}
        transition={{
          scale: { type: "spring", duration: 0.8 },
          rotate: {
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          },
        }}
      >
        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-xl">
          <ClipboardEdit size={32} />
        </div>
      </motion.div>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          Record Technician Activity
        </h1>
        <p className="text-white/90 mt-1 text-base md:text-lg">
          Enter service activities, parts, and inspection results
        </p>
      </div>
    </div>
  );
};
