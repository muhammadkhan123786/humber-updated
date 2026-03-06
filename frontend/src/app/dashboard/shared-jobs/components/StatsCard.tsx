"use client";
import React from "react";
import {
  Clock,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: any;
  bg: string;
}

interface SharedJobsStatsProps {
  statusCounts: {
    PENDING: number;
    IN_PROGRESS: number;
    ON_HOLD: number;
    COMPLETED: number;
  };
  refreshTrigger?: number;
}

const statusConfig: Record<string, { icon: any; bg: string }> = {
  PENDING: {
    icon: Clock,
    bg: "bg-gradient-to-br from-gray-500 to-gray-600",
  },
  IN_PROGRESS: {
    icon: PlayCircle,
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  ON_HOLD: {
    icon: PauseCircle,
    bg: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  COMPLETED: {
    icon: CheckCircle2,
    bg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
};

const SharedJobsStats = ({ statusCounts, refreshTrigger = 0 }: SharedJobsStatsProps) => {
  const stats: StatItem[] = [
    {
      label: "Total Shared",
      value: (statusCounts.PENDING || 0) + (statusCounts.IN_PROGRESS || 0) + (statusCounts.ON_HOLD || 0) + (statusCounts.COMPLETED || 0),
      icon: Share2,
      bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
    },
    {
      label: "Pending",
      value: statusCounts.PENDING || 0,
      icon: statusConfig.PENDING.icon,
      bg: statusConfig.PENDING.bg,
    },
    {
      label: "In Progress",
      value: statusCounts.IN_PROGRESS || 0,
      icon: statusConfig.IN_PROGRESS.icon,
      bg: statusConfig.IN_PROGRESS.bg,
    },
    {
      label: "On Hold",
      value: statusCounts.ON_HOLD || 0,
      icon: statusConfig.ON_HOLD.icon,
      bg: statusConfig.ON_HOLD.bg,
    },
    {
      label: "Completed",
      value: statusCounts.COMPLETED || 0,
      icon: statusConfig.COMPLETED.icon,
      bg: statusConfig.COMPLETED.bg,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-gray-50 rounded-xl">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`${item.bg} h-24 rounded-2xl p-4 flex justify-between items-center text-white shadow-lg hover:shadow-2xl transition-transform hover:scale-105 cursor-pointer`}
        >
          <div className="flex flex-col justify-between h-full">
            <span className="text-white/90 text-xs font-semibold tracking-wide">
              {item.label}
            </span>
            <span className="text-white text-3xl font-bold leading-none">
              {item.value}
            </span>
          </div>

          <div className="text-white/80">
            <item.icon size={32} strokeWidth={1.5} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedJobsStats;
