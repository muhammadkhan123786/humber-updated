"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Send,
  AlertCircle,
  FileText,
  Clock,
  XCircle,
  FileBadge,
} from "lucide-react";

interface StatsResponse {
  statusCounts: {
    DRAFT: { count: number; amount: number };
    ISSUED: { count: number; amount: number };
    CANCELLED: { count: number; amount: number };
    PAID: { count: number; amount: number };
  };
  totalInvoices: number;
  todayInvoices: number;
  overdue: { count: number; amount: number };
  paid: { count: number; amount: number };
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
        const res = await fetch(`${baseUrl}/customer-invoices-statistics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();

    window.addEventListener("invoiceUpdated", fetchStats);

    return () => {
      window.removeEventListener("invoiceUpdated", fetchStats);
    };
  }, []);

  if (!stats) return null;

  const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;

  const statsData = [
    {
      id: 1,
      amount: formatCurrency(stats.statusCounts.DRAFT.amount),
      label: `${stats.statusCounts.DRAFT.count} Draft Invoices`,
      badge: "DRAFT",
      icon: FileBadge,
      gradient: "bg-gradient-to-br from-yellow-500 to-amber-500",
    },
    {
      id: 2,
      amount: formatCurrency(stats.statusCounts.ISSUED.amount),
      label: `${stats.statusCounts.ISSUED.count} Issued Invoices`,
      badge: "ISSUED",
      icon: Send,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      amount: formatCurrency(stats.statusCounts.CANCELLED.amount),
      label: `${stats.statusCounts.CANCELLED.count} Cancelled`,
      badge: "CANCELLED",
      icon: XCircle,
      gradient: "bg-gradient-to-br from-red-500 to-pink-500",
    },
    {
      id: 4,
      amount: formatCurrency(stats.statusCounts.PAID.amount),
      label: `${stats.statusCounts.PAID.count} Paid`,
      badge: "PAID",
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      id: 5,
      amount: stats.totalInvoices.toString(),
      label: "Total Invoices",
      badge: "TOTAL",
      icon: FileText,
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
    },
    {
      id: 6,
      amount: stats.todayInvoices.toString(),
      label: "Today Invoices",
      badge: "TODAY",
      icon: Clock,
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
    },
    {
      id: 7,
      amount: formatCurrency(stats.overdue.amount),
      label: `${stats.overdue.count} Overdue`,
      badge: "OVERDUE",
      icon: AlertCircle,
      gradient: "bg-gradient-to-br from-rose-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 my-4 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {statsData.map((item) => (
        <div
          key={item.id}
          className={`px-6 pt-6 pb-8 ${item.gradient} rounded-2xl shadow-lg flex flex-col gap-3 transition-transform duration-300 hover:scale-[1.02]`}
        >
          <div className="flex justify-between items-center">
            <motion.div className="w-8 h-8 flex items-center justify-center text-white">
              <item.icon size={28} strokeWidth={2.5} />
            </motion.div>

            <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold">
                {item.badge}
              </span>
            </div>
          </div>

          <h2 className="text-white text-4xl font-bold tracking-tight leading-none">
            {item.amount}
          </h2>

          <p className="text-white/90 text-sm font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
