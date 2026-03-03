"use client";
import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  UserMinus,
  ShieldCheck,
  AlertOctagon,
  Users,
} from "lucide-react";

interface StatsSectionProps {
  statistics?: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    TERMINATED: number;
    "IN-ACTIVE": number;
    ACTIVE: number;
    total: number;
  };
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
}) => (
  <div
    className={`flex items-center justify-between p-5 rounded-3xl shadow-sm border border-white/50 ${bgColor}`}
  >
    <div>
      <p className="text-gray-600 text-[10px] uppercase tracking-wider font-bold mb-1">
        {label}
      </p>
      <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
    </div>
    <div className={textColor}>{icon}</div>
  </div>
);

const StatsSection: React.FC<StatsSectionProps> = ({ statistics }) => {
  const stats = [
    {
      label: "Total Riders",
      value: statistics?.total || 0,
      icon: <Users size={28} />,
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-100",
      textColor: "text-purple-600",
    },
    {
      label: "Active",
      value: statistics?.ACTIVE || 0,
      icon: <ShieldCheck size={28} />,
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-100",
      textColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: statistics?.PENDING || 0,
      icon: <Clock size={28} />,
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-100",
      textColor: "text-amber-600",
    },
    {
      label: "Approved",
      value: statistics?.APPROVED || 0,
      icon: <CheckCircle2 size={28} />,
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
      textColor: "text-blue-600",
    },
    {
      label: "Rejected",
      value: statistics?.REJECTED || 0,
      icon: <XCircle size={28} />,
      bgColor: "bg-gradient-to-br from-red-50 to-rose-100",
      textColor: "text-red-600",
    },
    {
      label: "In-Active",
      value: statistics?.["IN-ACTIVE"] || 0,
      icon: <UserMinus size={28} />,
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-200",
      textColor: "text-gray-600",
    },
    {
      label: "Terminated",
      value: statistics?.TERMINATED || 0,
      icon: <AlertOctagon size={28} />,
      bgColor: "bg-gradient-to-br from-slate-100 to-zinc-200",
      textColor: "text-slate-800",
    },
  ];

  return (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsSection;
