"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";

const InvoiceHeader: React.FC = () => {
  return (
    <div className="w-full h-32 px-8 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-between overflow-hidden relative">
      <div className="flex items-center gap-6 z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16  h-16 bg-white/20 rounded-2xl shadow-xl flex justify-center items-center backdrop-blur-sm border border-white/30"
        >
          <FileText className="text-white w-10 h-10" />
        </motion.div>

        <div className="flex flex-col">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            Invoice Management
          </h2>
          <p className="text-white/90 mt-1 text-lg">
            View and manage all customer invoices
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl shadow-lg transition-colors duration-200 z-10"
      >
        <Plus size={20} strokeWidth={3} className="text-indigo-600" />
        <span className="text-lg font-medium font-sans">
          Create New Invoice
        </span>
      </motion.button>

      <div className="absolute -top-5 -left-5 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
    </div>
  );
};

export default InvoiceHeader;
