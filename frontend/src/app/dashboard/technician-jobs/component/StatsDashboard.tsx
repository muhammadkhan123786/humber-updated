"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Clock,
  User,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { getAlls } from "@/helper/apiHelper";

interface StatItem {
  label: string;
  value: number;
  icon: any;
  bg: string;
}

const statusConfig: Record<string, { icon: any; bg: string }> = {
  Pending: {
    icon: Clock,
    bg: "bg-gradient-to-br from-gray-500 to-gray-600",
  },
  Assigned: {
    icon: User,
    bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  "In Progress": {
    icon: PlayCircle,
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  "On Hold": {
    icon: PauseCircle,
    bg: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  Completed: {
    icon: CheckCircle2,
    bg: "bg-gradient-to-br from-emerald-500 to-green-500",
  },
  Cancelled: {
    icon: XCircle,
    bg: "bg-gradient-to-br from-rose-500 to-red-600",
  },
  open: {
    icon: Briefcase,
    bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
  },
};

const defaultStyle = {
  icon: HelpCircle,
  bg: "bg-gradient-to-br from-slate-500 to-slate-700",
};

const StatsDashboard = () => {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAlls<any>("/job-statistics");

        const apiData = res?.data as any;

        if (!apiData) return;

        const dynamicStats: StatItem[] = [];

        dynamicStats.push({
          label: "Total Jobs",
          value: apiData.overallTotalJobs || 0,
          icon: Briefcase,
          bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
        });

        apiData.statusCounts.forEach((status: any) => {
          const config =
            statusConfig[status.technicianJobStatus] || defaultStyle;

          dynamicStats.push({
            label: status.technicianJobStatus,
            value: status.totalJobs,
            icon: config.icon,
            bg: config.bg,
          });
        });

        setStats(dynamicStats);
      } catch (error) {
        console.error("Error fetching job statistics:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 bg-gray-50 rounded-xl">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`${item.bg} w-full h-24 rounded-2xl p-4 flex justify-between items-center shadow-lg transition-transform hover:scale-105 cursor-pointer`}
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

export default StatsDashboard;
