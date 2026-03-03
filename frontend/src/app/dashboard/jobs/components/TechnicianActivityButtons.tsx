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
  // Don't show anything if activity is completed
  if (status === "completed") {
    return null;
  }

  return (
    <div className="md:col-span-3 pt-3 border-t">
      {/* Start/Pause/Resume Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Start Button - Only show when pending */}
        {status === "pending" && (
          <button
            onClick={() => onStart(activityId)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
          >
            <Play size={16} />
            Start
          </button>
        )}

        {/* Pause Button - Show when in_progress */}
        {status === "in_progress" && (
          <button
            onClick={() => onPause(activityId)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors shadow-sm"
          >
            <Pause size={16} />
            Pause
          </button>
        )}

        {/* Resume Button - Show when paused */}
        {status === "paused" && (
          <button
            onClick={() => onResume(activityId)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <RotateCcw size={16} />
            Resume
          </button>
        )}
      </div>

      {/* Complete Button - Show when not pending */}
      {status !== "pending" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onComplete(activityId)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
          >
            <CheckCircle size={16} />
            Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default TechnicianActivityButtons;
