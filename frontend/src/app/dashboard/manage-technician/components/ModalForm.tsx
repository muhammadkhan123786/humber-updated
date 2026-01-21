"use client";
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalFormProps {
  onClose: () => void;
}

const ModalForm = ({ onClose }: ModalFormProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Register Technician
            </h2>
            <p className="text-slate-500 font-medium">
              Add a new technical expert to your team
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {/* Your Form Content Goes Here */}
          <div className="space-y-6">
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 font-bold">
              [Form Inputs Placeholder]
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-4 rounded-2xl font-bold bg-[#E7000B] text-white shadow-lg shadow-red-200 hover:bg-[#F54900] transition-colors">
            Save Technician
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalForm;
