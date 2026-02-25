"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus, Bike } from "lucide-react";

const RiderBanner: React.FC = () => {
  const router = useRouter();

  const handleAddRider = () => {
    router.push("/dashboard/AddRider");
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between p-7 rounded-2xl shadow-lg"
        style={{
          background: "linear-gradient(90deg, #0061FF 0%, #009D85 100%)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
            <Bike
              className="w-10 h-10 text-white animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              All Riders
            </h1>
            <p className="text-white/90 mt-1 text-lg">
              Manage your delivery fleet
            </p>
          </div>
        </div>
        <button
          onClick={handleAddRider}
          className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all hover:bg-blue-50 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="text-sm">Add New Rider</span>
        </button>
      </div>
    </div>
  );
};

export default RiderBanner;
