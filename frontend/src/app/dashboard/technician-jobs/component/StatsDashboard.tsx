import React from "react";
import {
  Briefcase,
  Clock,
  User,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const StatsDashboard = () => {
  const stats = [
    {
      label: "Total Jobs",
      value: 6,
      icon: Briefcase,
      bg: " bg-gradient-to-br from-indigo-500 to-purple-500",
    },
    {
      label: "Pending",
      value: 1,
      icon: Clock,
      bg: "bg-gradient-to-br from-gray-500 to-gray-600",
    },
    {
      label: "Assigned",
      value: 1,
      icon: User,
      bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      label: "In Progress",
      value: 1,
      icon: PlayCircle,
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      label: "On Hold",
      value: 1,
      icon: PauseCircle,
      bg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      label: "Completed",
      value: 1,
      icon: CheckCircle2,
      bg: "bg-gradient-to-br from-emerald-500 to-green-500",
    },
    {
      label: "Cancelled",
      value: 1,
      icon: XCircle,
      bg: "bg-gradient-to-br from-rose-500 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4  bg-gray-50 rounded-xl">
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
