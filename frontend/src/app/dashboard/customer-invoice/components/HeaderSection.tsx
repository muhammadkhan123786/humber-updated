"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

const HeaderSection = () => {
  return (
    /* Changed 'inline-flex' to 'flex' and removed 'w-6xl' to allow full-width control */
    <div className="w-full h-32 px-8 py-8 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl flex flex-col justify-center overflow-hidden">
      {/* This flex container pushes items to the edges using justify-between */}
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Button, Icon, and Text */}
        <div className="flex items-center gap-5">
          <button className="w-12 h-12 bg-white/20 rounded-2xl flex justify-center items-center hover:bg-white/30 transition-colors shrink-0">
            <ArrowLeft className="text-white" size={20} />
          </button>

          <motion.div
            className="w-16 h-16 bg-white/20 rounded-2xl shadow-xl flex justify-center items-center shrink-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <FileText size={32} strokeWidth={1.5} className="text-white" />
          </motion.div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg leading-none">
              Customer Invoice
            </h1>
            <p className="text-white/90 mt-1 text-lg">
              Create and manage customer invoices
            </p>
          </div>
        </div>

        {/* Right Side: Invoice ID (No absolute positioning) */}
        <div className="px-4 py-2 bg-white/20 rounded-[10px] outline  outline-white/30 flex justify-center items-center self-start mt-2">
          <span className="text-white text-xs font-normal font-sans">
            INV-2026-1136
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
