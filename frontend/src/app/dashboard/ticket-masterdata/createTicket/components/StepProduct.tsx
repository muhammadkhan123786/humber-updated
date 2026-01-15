"use client";

import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  Info,
  ShoppingBag,
} from "lucide-react";
import { Controller } from "react-hook-form";

interface StepProductProps {
  onNext: () => void;
  onBack: () => void;
  form: any;
  vehicles: any[];
  isLoadingVehicles: boolean;
}

const StepProduct: React.FC<StepProductProps> = ({
  onNext,
  onBack,
  form,
  vehicles,
  isLoadingVehicles,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const selectedVehicleId = watch("vehicleId");

  const vehicleDetails = vehicles.find((v) => v._id === selectedVehicleId);

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500">
      <div
        className="p-8 text-white w-full"
        style={{
          display: "inline-grid",
          height: "66px",
          rowGap: "6px",
          columnGap: "6px",
          gridTemplateRows: "minmax(0, 16fr) minmax(0, 1fr)",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          borderRadius: "12px 12px 0 0",
          background: "linear-gradient(90deg, #AD46FF 0%, #F6339A 100%)",
        }}
      >
        <div className="flex justify-between items-center h-full">
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none">
              Product
            </h2>
          </div>
          <ShoppingBag className="opacity-20" size={32} />
        </div>
      </div>

      <div className="p-10 space-y-10">
        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex justify-between items-center">
            Select Mobility Scooter *
            {isLoadingVehicles && (
              <Loader2 className="animate-spin text-[#AD46FF]" size={18} />
            )}
          </label>

          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={
                  isLoadingVehicles ||
                  (vehicles.length === 0 && !isLoadingVehicles)
                }
                className="w-full p-5 rounded-3xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-bold outline-none focus:ring-2 ring-purple-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingVehicles ? (
                  <option>Searching records...</option>
                ) : (
                  <>
                    <option value="">
                      {vehicles.length === 0
                        ? "No vehicles registered for this customer"
                        : "Select a vehicle"}
                    </option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.vehicleBrandId?.brandName}{" "}
                        {v.vehicleModelId?.modelName} — Serial: {v.serialNumber}
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}
          />
          {errors.vehicleId && (
            <p className="text-red-500 text-sm font-bold flex items-center gap-1">
              <Info size={14} /> {errors.vehicleId.message}
            </p>
          )}
        </div>

        {vehicleDetails ? (
          <div className="space-y-4">
            <h3 className="text-[#9810FA] font-bold text-sm ml-2">
              Part Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-3xl bg-white/50">
              {[
                {
                  label: "Brand",
                  value: vehicleDetails.vehicleBrandId?.brandName,
                },
                {
                  label: "Model",
                  value: vehicleDetails.vehicleModelId?.modelName,
                },
                { label: "Serial Number", value: vehicleDetails.serialNumber },
                { label: "Type", value: vehicleDetails.vehicleType },
                { label: "Note", value: vehicleDetails.note || "N/A" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#F4F9FB] p-5 rounded-2xl border border-white shadow-sm transition-all hover:shadow-md"
                >
                  <span className="block text-[11px] font-semibold text-[#9810FA] mb-1">
                    {item.label}
                  </span>
                  <span className="text-[#1A1C1E] font-medium text-[15px] block">
                    {item.value || "Not Set"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !isLoadingVehicles &&
          vehicles.length > 0 && (
            <div className="p-12 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 text-sm italic font-medium bg-white/30">
              Information about the vehicle will appear here once selected.
            </div>
          )
        )}
        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 rounded-[10px] font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
          >
            <ChevronLeft size={20} /> Previous
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!selectedVehicleId || isLoadingVehicles}
            className={`flex items-center gap-2 px-10 py-4 font-black text-white transition-all ${
              selectedVehicleId && !isLoadingVehicles
                ? "hover:opacity-90 scale-[1.02] active:scale-[0.98]"
                : "cursor-not-allowed opacity-50"
            }`}
            style={{
              borderRadius: "10px",
              background:
                selectedVehicleId && !isLoadingVehicles
                  ? "linear-gradient(90deg, #AD46FF 0%, #F6339A 100%)"
                  : "#E5E7EB",
              boxShadow:
                selectedVehicleId && !isLoadingVehicles
                  ? "0 10px 15px -3px rgba(173, 70, 255, 0.2), 0 4px 6px -4px rgba(246, 51, 154, 0.2)"
                  : "none",
            }}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepProduct;
