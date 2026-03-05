"use client";
import { useState, useEffect } from "react";
import { Clock, Play, Pause } from "lucide-react";

interface TimerProps {
  status: string;
  totalTimeInSeconds: number;
  activityId: string;
  compact?: boolean;
}

const Timer = ({ status, totalTimeInSeconds, activityId, compact = false }: TimerProps) => {
  const [currentTime, setCurrentTime] = useState(totalTimeInSeconds);

  useEffect(() => {
    setCurrentTime(totalTimeInSeconds);
  }, [totalTimeInSeconds, activityId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "in_progress") {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  // Compact inline version
  if (compact) {
    const { hours, minutes, seconds } = formatTime(currentTime);
    return (
      <div className="flex items-center gap-1">
        <span className={`font-mono font-bold text-sm ${status === 'in_progress' ? 'text-blue-600' : 'text-gray-700'}`}>
          {hours}:{minutes}:{seconds}
        </span>
      </div>
    );
  }

  const { hours, minutes, seconds } = formatTime(currentTime);

  const getTimerColor = () => {
    switch (status) {
      case "in_progress":
        return "from-blue-500 to-cyan-600";
      case "paused":
        return "from-orange-500 to-amber-600";
      case "completed":
        return "from-green-500 to-emerald-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getIconColor = () => {
    switch (status) {
      case "in_progress":
        return "text-blue-500";
      case "paused":
        return "text-orange-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "in_progress":
        return <Play size={20} className="animate-pulse" />;
      case "paused":
        return <Pause size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className={`${getIconColor()}`}>
          {getStatusIcon()}
        </div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          Activity Timer
        </h3>
      </div>

      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div
            className={`bg-linear-to-br ${getTimerColor()} text-white rounded-lg shadow-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] transform transition-all duration-300 ${
              status === "in_progress" ? "scale-105 animate-pulse" : ""
            }`}
          >
            <div className="text-xl sm:text-2xl font-black text-center font-mono tracking-tight">
              {hours}
            </div>
          </div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">
            Hours
          </p>
        </div>

        {/* Separator */}
        <div className="text-xl sm:text-2xl font-black text-gray-400 pb-5">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div
            className={`bg-linear-to-br ${getTimerColor()} text-white rounded-lg shadow-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] transform transition-all duration-300 ${
              status === "in_progress" ? "scale-105 animate-pulse" : ""
            }`}
          >
            <div className="text-xl sm:text-2xl font-black text-center font-mono tracking-tight">
              {minutes}
            </div>
          </div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">
            Minutes
          </p>
        </div>

        {/* Separator */}
        <div className="text-xl sm:text-2xl font-black text-gray-400 pb-5">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div
            className={`bg-linear-to-br ${getTimerColor()} text-white rounded-lg shadow-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] transform transition-all duration-300 ${
              status === "in_progress" ? "scale-105 animate-pulse" : ""
            }`}
          >
            <div className="text-xl sm:text-2xl font-black text-center font-mono tracking-tight">
              {seconds}
            </div>
          </div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">
            Seconds
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-3 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-linear-to-r ${getTimerColor()} text-white shadow-md`}
        >
          {status === "in_progress" && "⏵ Running"}
          {status === "paused" && "❚❚ Paused"}
          {status === "completed" && "✓ Completed"}
          {status === "pending" && "○ Pending"}
        </span>
      </div>
    </div>
  );
};

export default Timer;
