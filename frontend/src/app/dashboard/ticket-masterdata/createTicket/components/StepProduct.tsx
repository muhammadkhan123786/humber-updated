"use client";

import React from "react";
import { Loader2, Info } from "lucide-react";
import { Controller } from "react-hook-form";

import { CustomSelect } from "../../../../common-form/CustomSelect";

interface StepProductProps {
  onNext?: () => void;
  onBack?: () => void;
  form: any;
  vehicles: any[];
  isLoadingVehicles: boolean;
  customers: any[];
}

const StepProduct: React.FC<StepProductProps> = ({
  form,
  vehicles,
  isLoadingVehicles,
  customers,
}) => {
  const {
    watch,
    formState: { errors },
  } = form;

  const selectedVehicleId = watch("vehicleId");
  const selectedCustomerId = watch("customerId");

  const vehicleDetails = vehicles.find((v) => v._id === selectedVehicleId);
  const selectedCustomer = customers.find(
    (c: any) => c._id === selectedCustomerId,
  );

  const ownershipType =
    selectedCustomer?.customerType === "domestic"
      ? "Customer Owned"
      : selectedCustomer?.customerType === "corporate"
        ? "Company Owned"
        : "";

  const vehicleOptions = vehicles.map((v: any) => ({
    id: v._id,
    label: `${v.vehicleBrandId?.brandName} (${v.vehicleModelId?.modelName}) - ${v.serialNumber}`,
  }));

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
            <h2 className="text-xl pt-4 font-bold tracking-tight leading-none">
              Product
            </h2>
            <p
              className="leading-none opacity-90 pt-2"
              style={{ fontSize: "12px", fontWeight: 400 }}
            >
              Select ticket source and customer
            </p>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-10">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Select Mobility Scooter *
            {isLoadingVehicles && (
              <Loader2 className="animate-spin text-[#AD46FF]" size={18} />
            )}
          </label>

          <Controller
            name="vehicleId"
            control={form.control}
            render={({ field }) => (
              <CustomSelect
                options={vehicleOptions}
                value={field.value}
                onChange={(id: string) => {
                  field.onChange(id);
                }}
                placeholder={
                  isLoadingVehicles
                    ? "Searching records..."
                    : "Select a product"
                }
                error={!!errors.vehicleId}
              />
            )}
          />

          {errors.vehicleId && (
            <p className="text-red-500 text-sm font-bold flex items-center gap-1">
              <Info size={14} /> {errors.vehicleId.message}
            </p>
          )}
        </div>

        {vehicleDetails && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl  outline-1 outline-offset-1 outline-purple-100 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch h-5 inline-flex justify-start items-start">
                <div className="flex-1 text-purple-900 text-sm font-bold font-['Arial'] leading-5">
                  Part Details
                </div>
              </div>
              <div className="self-stretch grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    label: "Make",
                    value: vehicleDetails.vehicleBrandId?.brandName,
                  },
                  {
                    label: "Model",
                    value: vehicleDetails.vehicleModelId?.modelName,
                  },
                  {
                    label: "Year",
                    value: vehicleDetails?.purchaseDate
                      ? new Date(vehicleDetails.purchaseDate).getFullYear()
                      : "N/A",
                  },
                  {
                    label: "Serial Number",
                    value: vehicleDetails.serialNumber,
                  },

                  {
                    label: "Ownership",
                    value: ownershipType,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-3 bg-white/60 rounded-xl flex flex-col justify-start items-start gap-1 border border-white/40 shadow-sm"
                  >
                    {/* Label */}
                    <div className="self-stretch h-4 inline-flex justify-start items-start">
                      <div className="flex-1 text-purple-600 text-xs font-normal font-['Arial'] leading-4">
                        {item.label}
                      </div>
                    </div>
                    {/* Value */}
                    <div className="self-stretch min-h-5 inline-flex justify-start items-start">
                      <div className="flex-1 text-gray-700 text-sm font-normal font-['Arial'] capitalize leading-5 truncate">
                        {item.value || "Not Set"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepProduct;
