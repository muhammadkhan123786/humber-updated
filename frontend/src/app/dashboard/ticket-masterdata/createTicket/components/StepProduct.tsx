"use client";

import React, { useMemo } from "react";
import { Loader2, Check } from "lucide-react";
import { Controller } from "react-hook-form";
import { CustomSelect } from "../../../../common-form/CustomSelect";

interface StepProductProps {
  onNext?: () => void;
  onBack?: () => void;
  form: any;
  vehicles: any[];
  isLoadingVehicles: boolean;
  customers: any[];
  brands: any[];
  models: any[];
  colors: any[];
}

const StepProduct: React.FC<StepProductProps> = ({
  form,
  vehicles,
  isLoadingVehicles,
  brands,
  models,
  colors,
}) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const selectedVehicleId = watch("vehicleId");
  const productOwnership = watch("productOwnership") || "Customer Product";

  // LOGIC: Watch the selected Brand (Make) ID from the manual form
  const selectedManualMake = watch("manualMake");

  const vehicleDetails = vehicles.find((v) => v._id === selectedVehicleId);

  // --- MAP OPTIONS ---
  const vehicleOptions = vehicles.map((v: any) => ({
    id: v._id,
    label: `${v.vehicleBrandId?.brandName} (${v.vehicleModelId?.modelName})`,
  }));

  const brandOptions = brands.map((b: any) => ({
    id: b._id,
    label: b.brandName,
  }));

  // LOGIC: Filter models based on selected brand ID, similar to your BrandModelInfo component
  const filteredModelOptions = useMemo(() => {
    if (!selectedManualMake) return [];

    return models
      .filter((m: any) => {
        // Handle both object and string formats for brandId to find match
        const brandId =
          typeof m.brandId === "object" ? m.brandId?._id : m.brandId;
        return brandId === selectedManualMake;
      })
      .map((m: any) => ({
        id: m._id,
        label: m.modelName,
      }));
  }, [models, selectedManualMake]);

  const colorOptions = colors.map((c: any) => ({
    id: c._id,
    label: c.colorName,
  }));

  const inputClassName = `h-11 px-4 bg-white rounded-xl border border-purple-100 text-sm outline-none transition-all hover:border-purple-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20`;

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
        {/* Product Ownership Toggle */}
        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Product Ownership *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() =>
                setValue("productOwnership", "Company product", {
                  shouldValidate: true,
                })
              }
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                productOwnership === "Company product"
                  ? "bg-linear-to-br from-blue-500 to-cyan-500 border-transparent text-white shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${productOwnership === "Company product" ? "bg-white/20" : "bg-gray-100"}`}
              >
                🏢
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Company Product</p>
                <p
                  className={`text-xs ${productOwnership === "Company product" ? "text-white/80" : "text-gray-400"}`}
                >
                  Owned by company
                </p>
              </div>
              {productOwnership === "Company product" && (
                <Check size={20} className="text-white animate-in zoom-in" />
              )}
            </div>

            <div
              onClick={() =>
                setValue("productOwnership", "Customer Product", {
                  shouldValidate: true,
                })
              }
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                productOwnership === "Customer Product"
                  ? "bg-linear-to-br from-purple-500 to-pink-500 border-transparent text-white shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${productOwnership === "Customer Product" ? "bg-white/20" : "bg-gray-100"}`}
              >
                👤
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Customer Product</p>
                <p
                  className={`text-xs ${productOwnership === "Customer Product" ? "text-white/80" : "text-gray-400"}`}
                >
                  Owned by customer
                </p>
              </div>
              {productOwnership === "Customer Product" && (
                <Check size={20} className="text-white animate-in zoom-in" />
              )}
            </div>
          </div>
        </div>

        {/* MANUAL FORM FOR CUSTOMER PRODUCT */}
        {productOwnership === "Customer Product" && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 flex flex-col gap-4">
              <div className="text-purple-900 text-sm font-bold font-['Arial']">
                Enter Product Details Manually
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-indigo-950 text-base font-medium">
                    Product Name *
                  </label>
                  <input
                    {...register("manualProductName")}
                    placeholder="e.g., Pride Go-Go Elite Traveller"
                    className={inputClassName}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BRAND SELECT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-indigo-950 text-base font-medium">
                      Make *
                    </label>
                    <Controller
                      name="manualMake"
                      control={form.control}
                      render={({ field }) => (
                        <CustomSelect
                          options={brandOptions}
                          value={field.value}
                          onChange={(val: any) => {
                            field.onChange(val);
                            setValue("manualModel", "");
                          }}
                          placeholder="Select Make"
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-indigo-950 text-base font-medium">
                      Model *
                    </label>
                    <Controller
                      name="manualModel"
                      control={form.control}
                      render={({ field }) => (
                        <CustomSelect
                          options={filteredModelOptions} // Logic: Use filtered options
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={
                            selectedManualMake
                              ? "Select Model"
                              : "Select Make first"
                          }
                          disabled={!selectedManualMake}
                        />
                      )}
                    />
                  </div>
                  {/* YEAR INPUT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-indigo-950 text-base font-medium">
                      Year *
                    </label>
                    <input
                      {...register("manualYear")}
                      placeholder="e.g., 2023"
                      className={inputClassName}
                    />
                  </div>
                  {/* COLOR SELECT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-indigo-950 text-base font-medium">
                      Color *
                    </label>
                    <Controller
                      name="manualColor"
                      control={form.control}
                      render={({ field }) => (
                        <CustomSelect
                          options={colorOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Color"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPANY PRODUCT DROPDOWN */}
        {productOwnership === "Company product" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <label className="flex items-center gap-2 text-indigo-950 text-base font-medium leading-6">
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
                  onChange={field.onChange}
                  placeholder={
                    isLoadingVehicles ? "Searching..." : "Select a product"
                  }
                  error={!!errors.vehicleId}
                />
              )}
            />
            {vehicleDetails && (
              <div className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 grid grid-cols-2 gap-3">
                <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
                  <div className="text-purple-600 text-xs">Make</div>
                  <div className="text-gray-700 text-sm font-bold">
                    {vehicleDetails.vehicleBrandId?.brandName}
                  </div>
                </div>
                <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
                  <div className="text-purple-600 text-xs">Model</div>
                  <div className="text-gray-700 text-sm font-bold">
                    {vehicleDetails.vehicleModelId?.modelName}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-indigo-950 text-base font-medium">
              Serial Number *
            </label>
            <input
              {...register("productSerialNumber", { required: true })}
              placeholder="SN-2024-001"
              className={`${inputClassName} w-full ${errors.productSerialNumber ? "border-red-400" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-indigo-950 text-base font-medium">
              Purchase Date *
            </label>
            <input
              {...register("purchaseDate", { required: true })}
              type="date"
              className={`${inputClassName} w-full ${errors.purchaseDate ? "border-red-400" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProduct;
