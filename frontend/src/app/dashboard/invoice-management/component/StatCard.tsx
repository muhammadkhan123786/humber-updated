"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, AlertCircle, FileText } from "lucide-react";

const DashboardStats = () => {
  const statsData = [
    {
      id: 1,
      amount: "£1309.15",
      label: "2 Invoices Paid",
      badge: "Paid",
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      id: 2,
      amount: "£1059.61",
      label: "2 Invoices Sent",
      badge: "Sent",
      icon: Send,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      amount: "£420.00",
      label: "1 Invoice Overdue",
      badge: "Overdue",
      icon: AlertCircle,
      gradient: "bg-gradient-to-br from-red-500 to-pink-500",
    },
    {
      id: 4,
      amount: "6",
      label: "Total Invoices",
      badge: "Total",
      icon: FileText,
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 my-4 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {statsData.map((item) => (
        <div
          key={item.id}
          className={`px-6 pt-6 pb-8 ${item.gradient} rounded-2xl shadow-lg flex flex-col justify-start items-start gap-3 transition-transform duration-300 hover:scale-[1.02]`}
        >
          <div className="self-stretch flex justify-between items-center">
            <motion.div className="w-8 h-8 flex items-center justify-center text-white">
              <item.icon size={28} strokeWidth={2.5} />
            </motion.div>

            <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold leading-4">
                {item.badge}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-white text-4xl font-bold font-sans tracking-tight leading-none drop-shadow-sm">
              {item.amount}
            </h2>
          </div>

          <div>
            <p className="text-white/90 text-sm font-medium font-sans">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
