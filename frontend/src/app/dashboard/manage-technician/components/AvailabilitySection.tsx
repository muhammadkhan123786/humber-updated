import React from "react";
import { Clock } from "lucide-react";

interface AvailabilitySectionProps {
  formData: any;
  activeDays: string[];
  toggleDay: (day: string) => void;
  handleTimeChange: (
    day: string,
    field: "startTime" | "endTime",
    value: string,
  ) => void;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  formData,
  toggleDay,
  handleTimeChange,
}) => {
  const sectionTitleStyle =
    "flex items-center gap-2 text-md font-bold text-slate-800 border-b border-slate-50 pb-2 mb-4";

  return (
    <section className="space-y-4">
      <h3 className={`${sectionTitleStyle} flex items-center gap-2`}>
        <Clock size={18} className="text-[#A855F7]" />
        <span>Availability & Duty Roster</span>
      </h3>
      <div className="space-y-2">
        {formData.dutyRoster.map((dayData: any) => (
          <div
            key={dayData.day}
            className={`flex flex-wrap items-center justify-between p-3 rounded-2xl border transition-all ${dayData.isActive ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-slate-50 border-slate-100 opacity-60"}`}
          >
            <div className="flex items-center gap-3 min-w-[120px]">
              <button
                type="button"
                onClick={() => toggleDay(dayData.day)}
                className={`w-10 h-5 rounded-full relative transition-colors ${dayData.isActive ? "bg-[#22C55E]" : "bg-slate-300"}`}
              >
                <div
                  className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${dayData.isActive ? "right-1" : "left-1"}`}
                />
              </button>
              <span className="text-sm font-bold text-slate-700">
                {dayData.day}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Start
                </span>
                <input
                  type="time"
                  value={dayData.startTime}
                  onChange={(e) =>
                    handleTimeChange(dayData.day, "startTime", e.target.value)
                  }
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-[12px] font-bold text-slate-600 focus:ring-1 focus:ring-[#22C55E] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!dayData.isActive}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  End
                </span>
                <input
                  type="time"
                  value={dayData.endTime}
                  onChange={(e) =>
                    handleTimeChange(dayData.day, "endTime", e.target.value)
                  }
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-[12px] font-bold text-slate-600 focus:ring-1 focus:ring-[#22C55E] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!dayData.isActive}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailabilitySection;
