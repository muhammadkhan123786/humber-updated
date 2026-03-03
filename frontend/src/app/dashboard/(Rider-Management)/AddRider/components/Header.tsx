"use client";
import React from "react";
import { Bike, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const riderId = searchParams.get("id");
  const isEditMode = !!riderId;

  const handleBack = () => {
    router.push("/dashboard/riders");
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
              {isEditMode ? "Update Rider" : "Add New Rider"}
            </h1>
            <p className="text-white/90 mt-1 text-lg">
              {isEditMode
                ? "Modify rider information"
                : "Register a new delivery rider"}
            </p>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold border border-white/30 backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
        >
          <ArrowLeft size={18} strokeWidth={3} />
          <span className="text-sm">Back to Riders</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
