"use client";

import { Share2, Grid3X3, List } from "lucide-react";

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const SharedJobsHeader = ({ activeView, setActiveView }: HeaderProps) => {
  return (
    <div className="w-full h-32 px-8 pt-8 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl relative overflow-hidden">

      <div className="relative h-16 flex items-start justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* Rotated Glass Icon Box */}
          <div className="relative">
           <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg items-center justify-center shadow-xl animate-[spin_10s_linear_infinite]">
          <Share2 className="text-white" size={32} />
        </div>
          </div>

          {/* Title + Subtitle */}
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-4xl font-bold leading-10">
              Shared Jobs
            </h1>
            <p className="text-white/90 text-lg leading-7">
              Track jobs shared by leading technicians
            </p>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-2 mt-4">

          {/* GRID BUTTON */}
          <button
            onClick={() => setActiveView("grid")}
            className={`flex items-center gap-2 h-9 px-4 rounded-[10px] text-sm transition ${
              activeView === "grid"
                ? "bg-white text-teal-600"
                : "bg-white/20 text-white  outline-1 outline-white/30"
            }`}
          >
            <Grid3X3 size={16} />
            Grid
          </button>

          {/* TABLE BUTTON */}
          <button
            onClick={() => setActiveView("table")}
            className={`flex items-center gap-2 h-9 px-4 rounded-[10px] text-sm transition ${
              activeView === "table"
                ? "bg-white text-teal-600"
                : "bg-white/20 text-white  outline-1 outline-white/30"
            }`}
          >
            <List size={16} />
            Table
          </button>

        </div>
      </div>
    </div>
  );
};

export default SharedJobsHeader;
