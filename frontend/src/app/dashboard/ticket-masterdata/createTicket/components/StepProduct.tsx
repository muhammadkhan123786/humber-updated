"use client";

import React from "react";
import { Loader2, Building2, User, Check } from "lucide-react";
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
    setValue,
    formState: { errors },
  } = form;

  const selectedVehicleId = watch("vehicleId");
  const selectedCustomerId = watch("customerId");
  const productOwnership = watch("productOwnership") || "company"; // Default to company

  const vehicleDetails = vehicles.find((v) => v._id === selectedVehicleId);
  const selectedCustomer = customers.find(
    (c: any) => c._id === selectedCustomerId,
  );

  const ownershipTypeDescription =
    selectedCustomer?.customerType === "domestic"
      ? "Customer Owned"
      : selectedCustomer?.customerType === "corporate"
        ? "Company Owned"
        : "";

  const vehicleOptions = vehicles.map((v: any) => ({
    id: v._id,
    label: `${v.vehicleBrandId?.brandName} (${v.vehicleModelId?.modelName})`,
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

      <div className="p-10 space-y-8">
        {/* Select Mobility Scooter */}
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
        </div>

        {vehicleDetails && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl outline-1 outline-offset-1 outline-purple-100 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch h-5 inline-flex justify-start items-start">
                <div className="flex-1 text-purple-900 text-sm font-bold font-['Arial'] leading-5">
                  Product Details
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
                    label: "Ownership Status",
                    value: ownershipTypeDescription,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-3 bg-white/60 rounded-xl flex flex-col justify-start items-start gap-1 border border-white/40 shadow-sm"
                  >
                    <div className="self-stretch h-4 inline-flex justify-start items-start">
                      <div className="flex-1 text-purple-600 text-xs font-normal font-['Arial'] leading-4">
                        {item.label}
                      </div>
                    </div>
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

        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Product Ownership *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setValue("productOwnership", "company")}
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                productOwnership === "company"
                  ? "bg-linear-to-br from-blue-500 to-cyan-500 border-transparent text-white shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors duration-300 ${
                  productOwnership === "company" ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                🏢
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Our Product</p>
                <p
                  className={`text-xs ${
                    productOwnership === "company"
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
                >
                  Owned by company
                </p>
              </div>
              {productOwnership === "company" && (
                <Check
                  size={20}
                  className="text-white animate-in zoom-in duration-300"
                />
              )}
            </div>

            {/* Customer Product Box */}
            <div
              onClick={() => setValue("productOwnership", "customer")}
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                productOwnership === "customer"
                  ? "bg-linear-to-br from-purple-500 to-pink-500 border-transparent text-white shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors duration-300 ${
                  productOwnership === "customer"
                    ? "bg-white/20"
                    : "bg-gray-100"
                }`}
              >
                👤
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Customer Product</p>
                <p
                  className={`text-xs ${
                    productOwnership === "customer"
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
                >
                  Owned by customer
                </p>
              </div>
              {productOwnership === "customer" && (
                <Check
                  size={20}
                  className="text-white animate-in zoom-in duration-300"
                />
              )}
            </div>
          </div>
        </div>

        {/* Serial Number Input */}
        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Serial Number *
          </label>
          <input
            // {...form.register("serialNumber")}
            type="text"
            placeholder="Enter serial number (e.g., SN-2024-001)"
            className="flex h-12 w-full rounded-md border-2 border-purple-100 bg-gray-50/50 px-3 py-1 text-base md:text-sm outline-none transition-all hover:border-pink-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
          />
        </div>

        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Purchase Date *
          </label>
          <div className="relative">
            <input
              {...form.register("purchaseDate")}
              type="date"
              className="flex h-12 w-full rounded-md border-2 border-purple-100 bg-gray-50/50 px-3 py-1 text-base md:text-sm outline-none transition-all hover:border-pink-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProduct;
