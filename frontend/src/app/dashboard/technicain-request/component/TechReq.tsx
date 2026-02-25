"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserCircle,
  Wrench,
  ChevronDown,
  TrendingUp,
  Users,
  Ban,
  CheckCheck,
  Calendar,
  Hash,
  ClipboardList,
} from "lucide-react";

interface Part {
  name: string;
  number: string;
  price: number;
  qty: number;
}

type StatusType =
  | "SENT TO INSURANCE"
  | "SENT TO CUSTOMER"
  | "REJECTED"
  | "RESOLVED";

interface Request {
  id: string;
  date: string;
  status: StatusType;
  customer: string;
  technician: string;
  parts: Part[];
}

const TechReq: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "REQ-001",
      date: "2024-03-15",
      status: "SENT TO INSURANCE",
      customer: "John Doe",
      technician: "Mike Johnson",
      parts: [
        { name: "Brake Pads", number: "BP-9921", price: 45.0, qty: 2 },
        { name: "Oil Filter", number: "OF-112", price: 15.5, qty: 1 },
      ],
    },
    {
      id: "REQ-002",
      date: "2024-03-16",
      status: "SENT TO CUSTOMER",
      customer: "Sarah Smith",
      technician: "Emily Brown",
      parts: [
        { name: "Headlight Bulb", number: "HB-007", price: 12.0, qty: 2 },
      ],
    },
    {
      id: "REQ-003",
      date: "2024-03-17",
      status: "REJECTED",
      customer: "Mike Ross",
      technician: "David Chen",
      parts: [{ name: "Radiator Fan", number: "RF-552", price: 120.0, qty: 1 }],
    },
    {
      id: "REQ-004",
      date: "2024-03-18",
      status: "RESOLVED",
      customer: "Lisa Taylor",
      technician: "James Wilson",
      parts: [
        { name: "Alternator", number: "ALT-789", price: 280.0, qty: 1 },
        { name: "Drive Belt", number: "DB-456", price: 35.0, qty: 2 },
      ],
    },
  ]);

  const statusOptions: StatusType[] = [
    "SENT TO INSURANCE",
    "SENT TO CUSTOMER",
    "REJECTED",
    "RESOLVED",
  ];

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)),
    );
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "SENT TO INSURANCE":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          light: "bg-blue-100/50",
          icon: ShieldCheck,
        };
      case "SENT TO CUSTOMER":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          light: "bg-purple-100/50",
          icon: Users,
        };
      case "REJECTED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          light: "bg-red-100/50",
          icon: Ban,
        };
      case "RESOLVED":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          light: "bg-green-100/50",
          icon: CheckCheck,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          light: "bg-gray-100/50",
          icon: Clock,
        };
    }
  };

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: ClipboardList,
      gradient: "from-indigo-600 via-purple-600 to-pink-500",
      lightBg: "bg-indigo-50",
      textColor: "text-indigo-600",
      cardGradient:
        "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500",
    },
    {
      label: "Pending Approval",
      value: requests.filter((r) => r.status.startsWith("SENT")).length,
      icon: Clock,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
      cardGradient:
        "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
    },
    {
      label: "Rejected",
      value: requests.filter((r) => r.status === "REJECTED").length,
      icon: XCircle,
      gradient: "from-rose-500 via-pink-600 to-red-600",
      lightBg: "bg-rose-50",
      textColor: "text-rose-600",
      cardGradient: "bg-gradient-to-br from-rose-500 via-pink-600 to-red-600",
    },
    {
      label: "Resolved",
      value: requests.filter((r) => r.status === "RESOLVED").length,
      icon: CheckCircle2,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      cardGradient:
        "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-linear-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-lg shadow-red-200 flex items-center justify-center">
              <Wrench size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Technician Requests
              </h1>
              <p className="text-slate-500">
                Review and manage part requests from technicians
              </p>
            </div>
          </div>
          <div className="h-1 w-32 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 rounded-full mt-2" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className={`${stat.cardGradient} rounded-2xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform -translate-x-12 translate-y-12" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold text-white">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-white/80" />
                  <span className="text-xs font-medium text-white/90">
                    +12%
                  </span>
                  <span className="text-xs text-white/60">vs last month</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req, reqIdx) => {
            const statusStyle = getStatusColor(req.status);
            const StatusIcon = statusStyle.icon;
            const totalAmount = req.parts.reduce(
              (sum, p) => sum + p.price * p.qty,
              0,
            );

            return (
              <motion.div
                layout
                key={req.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reqIdx * 0.1 }}
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`h-2 w-full bg-linear-to-r ${
                    req.status === "SENT TO INSURANCE"
                      ? "from-blue-500 to-blue-400"
                      : req.status === "SENT TO CUSTOMER"
                        ? "from-purple-500 to-purple-400"
                        : req.status === "REJECTED"
                          ? "from-red-500 to-rose-400"
                          : "from-green-500 to-emerald-400"
                  }`}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash size={14} className="text-slate-400" />
                        <span className="text-sm font-mono font-bold text-slate-700">
                          {req.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        <span>
                          {new Date(req.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-xl ${statusStyle.bg} border ${statusStyle.border} flex items-center gap-1.5`}
                    >
                      <StatusIcon size={14} className={statusStyle.text} />
                      <span
                        className={`text-xs font-semibold ${statusStyle.text}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Technician
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs">
                          {req.technician.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {req.technician.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Customer
                      </p>
                      <div className="flex items-center gap-2">
                        <UserCircle size={20} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {req.customer.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Package size={14} />
                        Parts ({req.parts.length})
                      </span>
                      <span className="text-xs text-slate-400">Unit Price</span>
                    </div>
                    <div className="space-y-3">
                      {req.parts.map((part, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">
                              {part.name}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">
                              {part.number}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-slate-500">
                              x{part.qty}
                            </span>
                            <span className="text-sm font-bold text-slate-800 w-16 text-right">
                              ${part.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Total Amount
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        ${totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Details
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <label className="text-xs font-semibold text-slate-500 block mb-2">
                      Update Status
                    </label>
                    <div className="relative">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleStatusChange(
                            req.id,
                            e.target.value as StatusType,
                          )
                        }
                        className={`w-full appearance-none px-4 py-2.5 rounded-xl border-2 text-sm font-medium cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechReq;
