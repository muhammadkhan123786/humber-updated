"use client";
import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import VehicleList from "./VehicleList";
import VehicleManager from "./VehicleManager";

export default function VehicleClientWrapper() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            {view === "list" ? "Vehicles Fleet" : view === "add" ? "Register Vehicle" : "Edit Vehicle"}
          </h1>
          <p className="text-gray-500">
            {view === "list" 
              ? "View and manage all registered customer vehicles." 
              : "Enter the details below to update the vehicle profile."}
          </p>
        </div>

        <button
          onClick={() => {
            setView(view === "list" ? "add" : "list");
            setSelectedVehicleId(null);
          }}
          className={`${
            view === "list" ? "bg-[#FE6B1D] text-white" : "bg-white text-gray-600 border"
          } px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95`}
        >
          {view === "list" ? (
            <>
              <Plus size={20} /> Add New Vehicle
            </>
          ) : (
            <>
              <ArrowLeft size={20} /> Back to List
            </>
          )}
        </button>
      </div>

      {/* Logic to Switch Components */}
      {view === "list" ? (
        <VehicleList 
          onEdit={(id: string) => {
            setSelectedVehicleId(id);
            setView("edit");
          }} 
        />
      ) : (
        <VehicleManager 
          editId={selectedVehicleId} 
          onSuccess={() => setView("list")} 
        />
      )}
    </div>
  );
}