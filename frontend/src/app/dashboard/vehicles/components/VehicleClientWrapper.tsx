"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import VehicleList from "./VehicleList";
import VehicleManager from "./VehicleManager";
import VehicleDetails from "./VehicleDetails";

export default function VehicleClientWrapper() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [displayView, setDisplayView] = useState<"card" | "table">("card");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              {view === "list"
                ? "🚗 Vehicles Fleet"
                : view === "add"
                  ? "🚗 Add New Vehicle"
                  : "✏️ Edit Vehicle"}
            </h1>
            <p className="text-blue-100 text-lg">
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
              view === "list"
                ? "bg-linear-to-r from-orange-500 to-red-600 text-white hover:shadow-xl"
                : "bg-white text-purple-600 border-2 border-white hover:bg-blue-50"
            } px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95`}
          >
            {view === "list" ? (
              <>
                <Plus size={20} /> Add New Vehicle
              </>
            ) : (
              <>Back to List</>
            )}
          </button>
        </div>
      </div>

      {/* Logic to Switch Components */}
      {view === "list" ? (
        <VehicleList
          displayView={displayView}
          setDisplayView={setDisplayView}
          onEdit={(id: string) => {
            setSelectedVehicleId(id);
            setView("edit");
          }}
          onViewDetails={(id: string) => {
            setSelectedVehicleId(id);
            setShowDetailsModal(true);
          }}
        />
      ) : (
        <VehicleManager
          editId={selectedVehicleId}
          onSuccess={() => setView("list")}
        />
      )}

      {/* Vehicle Details Modal */}
      {showDetailsModal && selectedVehicleId && (
        <VehicleDetails
          vehicleId={selectedVehicleId}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedVehicleId(null);
          }}
        />
      )}
    </div>
  );
}
