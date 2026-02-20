"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Clock,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
} from "lucide-react";
import { getAlls } from "@/helper/apiHelper";

interface StatItem {
  label: string;
  value: number;
  icon: any;
  bg: string;
}

interface StatsDashboardProps {
  refreshTrigger?: number;
}

interface StatusCount {
  status: string;
  totalJobs: number;
}

const staticCards = [
  {
    label: "Total Jobs",
    icon: Briefcase,
    bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
    statusKey: "overallTotalJobs",
  },
  {
    label: "Pending",
    icon: Clock,
    bg: "bg-gradient-to-br from-gray-500 to-gray-600",
    statusKey: "PENDING",
  },
  {
    label: "In Progress",
    icon: PlayCircle,
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    statusKey: "START",
  },
  {
    label: "On Hold",
    icon: PauseCircle,
    bg: "bg-gradient-to-br from-purple-500 to-pink-500",
    statusKey: "ON HOLD",
  },
  {
    label: "Completed",
    icon: CheckCircle2,
    bg: "bg-gradient-to-br from-emerald-500 to-green-500",
    statusKey: "END",
  },
];

const StatsDashboard = ({ refreshTrigger = 0 }: StatsDashboardProps) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await getAlls<any>("/job-statistics");
        const apiData = res?.data as any["data"];

        if (!apiData) {
          const defaultStats = staticCards.map((card) => ({
            label: card.label,
            value: 0,
            icon: card.icon,
            bg: card.bg,
          }));
          setStats(defaultStats);
          return;
        }

        const dynamicStats = staticCards.map((card) => {
          if (card.statusKey === "overallTotalJobs") {
            return {
              label: card.label,
              value: apiData.overallTotalJobs || 0,
              icon: card.icon,
              bg: card.bg,
            };
          } else {
            const statusCount = apiData.statusCounts?.find(
              (s: StatusCount) => s.status === card.statusKey,
            );
            return {
              label: card.label,
              value: statusCount?.totalJobs || 0,
              icon: card.icon,
              bg: card.bg,
            };
          }
        });

        setStats(dynamicStats);
      } catch (error) {
        console.error("Error fetching job statistics:", error);

        const defaultStats = staticCards.map((card) => ({
          label: card.label,
          value: 0,
          icon: card.icon,
          bg: card.bg,
        }));
        setStats(defaultStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-gray-50 rounded-xl">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full h-24 rounded-2xl bg-gray-200 animate-pulse"
            ></div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-gray-50 rounded-xl">
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
