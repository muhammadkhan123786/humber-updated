"use client";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  Loader,
  PauseCircle,
} from "lucide-react";
import { getAlls } from "@/helper/apiHelper";
interface StatItem {
  label: string;
  value: number;
  icon: any;
  bg: string;
}

// Interface for props to handle auto-refresh
interface StatsDashboardProps {
  refreshTrigger?: number;
}
const statusConfig: Record<string, { icon: any; bg: string; label: string }> = {
  pending: {
    icon: Clock,
    bg: "bg-gradient-to-br from-yellow-500 to-orange-500",
    label: "Pending",
  },
  started: {
    icon: Loader,
    bg: "bg-gradient-to-br from-green-500 to-teal-500",
    label: "Started",
  },
  onHold: {
    icon: PauseCircle,
    bg: "bg-gradient-to-br from-red-500 to-pink-500",
    label: "On Hold",
  },
  ended: {
    icon: CheckCircle,
    bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
    label: "Ended",
  },
};
const StatsDashboard = ({ refreshTrigger = 0 }: StatsDashboardProps) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAlls<any>("/technician-dashboard-jobs");
        const apiData = res?.data as any;

        if (!apiData) return;
        
        const dynamicStats: StatItem[] = [];
        const statusSummary = apiData.statusSummary || {};

        // Calculate total jobs from statusSummary
        const totalJobs = 
          (statusSummary.pending || 0) + 
          (statusSummary.started || 0) + 
          (statusSummary.onHold || 0) + 
          (statusSummary.ended || 0);

        // 1. Adding Total Jobs Card
        dynamicStats.push({
          label: "Total Jobs",
          value: totalJobs,
          icon: Briefcase,
          bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
        });

        // 2. Mapping statuses from statusSummary
        Object.keys(statusConfig).forEach((statusKey) => {
          const config = statusConfig[statusKey];
          dynamicStats.push({
            label: config.label,
            value: statusSummary[statusKey] || 0,
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
  }, [refreshTrigger]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-gray-50 rounded-xl">
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
