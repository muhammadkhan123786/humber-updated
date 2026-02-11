"use client";
import { BrickWall, Briefcase, List } from "lucide-react";
interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
}
const TechnicianHeader = ({ activeView, setActiveView }: HeaderProps) => {
  return (
    <div className="w-full h-auto min-h-32 px-6 py-8 md:px-8 border-0 shadow-2xl bg-linear-to-r from-orange-600 via-red-600 to-pink-600 flex items-center justify-between overflow-hidden relative rounded-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-6 z-10">
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg items-center justify-center shadow-xl animate-[spin_10s_linear_infinite]">
          <Briefcase className="text-white" size={32} />
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Technician Job List
          </h1>
          <p className="text-white/90 mt-1 text-lg">
            Track and manage all technician assignments
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 z-10">
        <button
          onClick={() => setActiveView("grid")}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all shadow-sm h-10 px-5 py-2 outline-none cursor-pointer ${
            activeView === "grid"
              ? "bg-white text-red-600"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          <BrickWall size={18} className="shrink-0" />
          Grid
        </button>

        <button
          onClick={() => setActiveView("table")}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all shadow-sm h-10 px-5 py-2 outline-none cursor-pointer ${
            activeView === "table"
              ? "bg-white text-red-600"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          <List size={18} className="shrink-0" />
          Table
        </button>
      </div>
    </div>
  );
};

export default TechnicianHeader;
