"use client";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";

interface TechnicianActivityButtonsProps {
  activityId: string;
  status: string;
  onStart: (activityId: string) => void;
  onPause: (activityId: string) => void;
  onResume: (activityId: string) => void;
  onComplete: (activityId: string) => void;
}

const TechnicianActivityButtons = ({
  activityId,
  status,
  onStart,
  onPause,
  onResume,
  onComplete,
}: TechnicianActivityButtonsProps) => {
  return (
    <div className="space-y-3 pt-5 border-t border-gray-200">
      {/* Start/Pause/Resume Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Start Button - Show when pending or completed */}
        {(status === "pending" || status === "completed") && (
          <button
            onClick={() => onStart(activityId)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
          >
            <Play size={18} />
            Start Activity
          </button>
        )}

        {/* Pause Button - Show when in_progress */}
        {status === "in_progress" && (
          <button
            onClick={() => onPause(activityId)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
          >
            <Pause size={18} />
            Pause Activity
          </button>
        )}

        {/* Resume Button - Show when paused */}
        {status === "paused" && (
          <button
            onClick={() => onResume(activityId)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 animate-pulse"
          >
            <RotateCcw size={18} />
            Resume Activity
          </button>
        )}
      </div>

      {/* Complete Button - Show when in_progress or paused */}
      {(status === "in_progress" || status === "paused") && (
        <div className="flex gap-3">
          <button
            onClick={() => onComplete(activityId)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
          >
            <CheckCircle size={18} />
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default TechnicianActivityButtons;
