"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const TechnicianHeader = () => {
  return (
    <div className="w-full min-h-32 p-6 md:pl-8 md:py-8 bg-linear-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl flex flex-col justify-center items-start overflow-hidden">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex justify-start items-center gap-5 w-full md:w-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear",
            }}
            className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl shadow-xl flex justify-center items-center shrink-0 backdrop-blur-sm"
          >
            <Settings
              size={40}
              color="white"
              strokeWidth={1.5}
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            />
          </motion.div>

          <div className="flex flex-col justify-start items-start">
            <h1 className="text-white text-2xl md:text-4xl font-bold font-sans drop-shadow-md leading-tight">
              Technician Activities
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-normal font-sans">
              Track service activities and job completion
            </p>
          </div>
        </div>

        <button className="group flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-indigo-50 transition-all active:scale-95 rounded-xl shadow-lg self-start md:self-center">
          <div className="w-4 h-4 relative flex justify-center items-center">
            <span className="w-3 h-0.5 bg-indigo-600 absolute rounded-full" />
            <span className="w-0.5 h-3 bg-indigo-600 absolute rounded-full" />
          </div>
          <span className="text-indigo-600 text-sm font-bold whitespace-nowrap">
            New Activity
          </span>
        </button>
      </div>
    </div>
  );
};

export default TechnicianHeader;
