"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

const HeaderSection = () => {
  return (
    <div className="w-[1216px] h-32 pl-8 pt-8 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl inline-flex flex-col justify-start items-start overflow-hidden">
      <div className="w-6xl h-16 relative flex items-center">
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
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Customer Invoice
            </h1>
            <p className="text-white/90 mt-1 text-lg">
              Create and manage customer invoices
            </p>
          </div>
        </div>

        <div className="px-4 py-2 right-0 top-3 absolute bg-white/20 rounded-[10px]  outline-1 outline-white/30 flex justify-center items-center">
          <span className="text-white text-xs font-normal font-['Arial']">
            INV-2026-1136
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
