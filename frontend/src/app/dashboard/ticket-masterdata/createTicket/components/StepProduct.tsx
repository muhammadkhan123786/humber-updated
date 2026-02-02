"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Loader2, Check, Plus, Save } from "lucide-react";
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
  handleAddVehicle?: (vehicleData?: any) => Promise<any>;
}

const StepProduct: React.FC<StepProductProps> = ({
  form,
  vehicles,
  isLoadingVehicles,
  brands,
  models,
  colors,
  handleAddVehicle,
}) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
    trigger,
  } = form;

  const selectedVehicleId = watch("vehicleId");
  const productOwnership = watch("productOwnership") || "Customer Product";
  const selectedManualMake = watch("manualMake");
  const manualProductName = watch("manualProductName");
  const manualModel = watch("manualModel");
  const manualYear = watch("manualYear");
  const manualColor = watch("manualColor");

  const vehicleType = watch("vehicleType");
  const productSerialNumber = watch("productSerialNumber");
  const purchaseDate = watch("purchaseDate");
  const customerId = watch("customerId");
  const userId = watch("userId");

  const [showManualForm, setShowManualForm] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const filteredVehicles = useMemo(() => {
    if (!customerId) return [];

    return vehicles.filter((vehicle) => {
      const vehicleCustomerId =
        typeof vehicle.customerId === "object"
          ? vehicle.customerId._id
          : vehicle.customerId;

      if (productOwnership === "Company product") {
        return (
          vehicle.isVehicleCompanyOwned === true &&
          vehicleCustomerId === customerId
        );
      } else {
        return (
          vehicle.isVehicleCompanyOwned === false &&
          vehicleCustomerId === customerId
        );
      }
    });
  }, [vehicles, customerId, productOwnership]);

  const customerHasVehicles = useMemo(() => {
    if (!customerId) return false;
    return filteredVehicles.length > 0;
  }, [filteredVehicles, customerId]);

  const isManualFormValid = useMemo(() => {
    return Boolean(
      vehicleType &&
      manualProductName &&
      selectedManualMake &&
      manualModel &&
      manualYear &&
      manualColor &&
      productSerialNumber &&
      purchaseDate,
    );
  }, [
    vehicleType,
    manualProductName,
    selectedManualMake,
    manualModel,
    manualYear,
    manualColor,
    productSerialNumber,
    purchaseDate,
  ]);

  const vehicleDetails = vehicles.find((v) => v._id === selectedVehicleId);
  const vehicleOptions = useMemo(() => {
    return filteredVehicles.map((v: any) => ({
      id: v._id,
      label: `${v.vehicleBrandId?.brandName || v.productName} (${v.vehicleModelId?.modelName || v.year})`,
    }));
  }, [filteredVehicles]);

  const brandOptions = brands.map((b: any) => ({
    id: b._id,
    label: b.brandName,
  }));
  const filteredModelOptions = useMemo(() => {
    if (!selectedManualMake) return [];

    return models
      .filter((m: any) => {
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

  const vehicleTypeOptions = [
    { id: "Scooter", label: "Scooter" },
    { id: "Mobility Vehicle", label: "Mobility Vehicle" },
  ];

  const inputClassName = `h-11 px-4 bg-white rounded-xl border border-purple-100 text-sm outline-none transition-all hover:border-purple-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20`;
  const handleAddNewVehicle = async () => {
    console.log("productOwnership:", productOwnership);
    console.log(
      "Is 'Company product'?",
      productOwnership === "Company product",
    );
    console.log(
      "Is 'Customer Product'?",
      productOwnership === "Customer Product",
    );
    if (!customerId) {
      alert("Please select a customer first");
      return;
    }

    if (!isManualFormValid) {
      const isValid = await trigger([
        "vehicleType",
        "manualProductName",
        "manualMake",
        "manualModel",
        "manualYear",
        "manualColor",
        "productSerialNumber",
        "purchaseDate",
      ]);

      if (!isValid) {
        alert("Please fill all required fields correctly");
        return;
      }
    }

    if (!handleAddVehicle) {
      alert("Add vehicle function not available");
      return;
    }

    setIsAddingVehicle(true);
    try {
      const vehicleData = {
        userId,
        customerId,
        vehicleBrandId: selectedManualMake,
        vehicleModelId: manualModel,
        colorId: manualColor,
        serialNumber: productSerialNumber,
        productName: manualProductName,
        year: manualYear,
        vehicleType: vehicleType,
        isVehicleCompanyOwned: productOwnership === "Company product",
        purchaseDate,
      };

      console.log("Sending vehicle data:", vehicleData);

      const result = await handleAddVehicle(vehicleData);

      if (result) {
        alert("Vehicle added successfully!");
        setValue("vehicleId", result._id);
        setShowManualForm(false);
      }
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      alert("Failed to add vehicle. Please try again.");
    } finally {
      setIsAddingVehicle(false);
    }
  };
  useEffect(() => {
    const currentProductOwnership =
      watch("productOwnership") || "Customer Product";
    if (currentProductOwnership !== productOwnership) {
      setValue("vehicleId", "");
      setShowManualForm(false);
    }
  }, [productOwnership, setValue, watch]);
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
              Select or add product details
            </p>
          </div>
        </div>
      </div>
      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Product Ownership *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => {
                setValue("productOwnership", "Company product", {
                  shouldValidate: true,
                });
              }}
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                productOwnership === "Company product"
                  ? "bg-linear-to-br from-blue-500 to-cyan-500 border-transparent text-white shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  productOwnership === "Company product"
                    ? "bg-white/20"
                    : "bg-gray-100"
                }`}
              >
                🏢
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Company Product</p>
                <p
                  className={`text-xs ${
                    productOwnership === "Company product"
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
                >
                  Owned by company
                </p>
              </div>
              {productOwnership === "Company product" && (
                <Check size={20} className="text-white animate-in zoom-in" />
              )}
            </div>

            <div
              onClick={() => {
                setValue("productOwnership", "Customer Product", {
                  shouldValidate: true,
                });
              }}
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                productOwnership === "Customer Product"
                  ? "bg-linear-to-br from-purple-500 to-pink-500 border-transparent text-white shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  productOwnership === "Customer Product"
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
                    productOwnership === "Customer Product"
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
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
        {!customerId && (
          <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-yellow-700 font-medium">
              Please select a customer in Step 1 to view/add products
            </p>
          </div>
        )}
        {customerId && productOwnership === "Company product" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {customerHasVehicles && !showManualForm ? (
              <>
                <label className="flex items-center gap-2 text-indigo-950 text-base font-medium leading-6">
                  Select Company Product *
                  {isLoadingVehicles && (
                    <Loader2
                      className="animate-spin text-[#AD46FF]"
                      size={18}
                    />
                  )}
                </label>
                <Controller
                  name="vehicleId"
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomSelect
                      options={vehicleOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingVehicles
                          ? "Loading..."
                          : "Select a company product"
                      }
                      error={!!errors.vehicleId}
                    />
                  )}
                />
                {errors.vehicleId && (
                  <p className="text-red-500 text-xs">
                    Please select a product
                  </p>
                )}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                  >
                    <Plus size={16} />
                    Add New Company Product
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="text-blue-900 text-sm font-bold font-['Arial']">
                      Enter Company Product Details
                    </div>
                    {customerHasVehicles && (
                      <button
                        type="button"
                        onClick={() => setShowManualForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Back to list
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-indigo-950 text-base font-medium">
                        Vehicle Type *
                      </label>
                      <Controller
                        name="vehicleType"
                        control={form.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <CustomSelect
                            options={vehicleTypeOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Vehicle Type"
                            error={!!errors.vehicleType}
                          />
                        )}
                      />
                      {errors.vehicleType && (
                        <p className="text-red-500 text-xs">
                          Vehicle type is required
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-indigo-950 text-base font-medium">
                        Product Name *
                      </label>
                      <input
                        {...register("manualProductName", { required: true })}
                        placeholder="e.g., Pride Go-Go Elite Traveller"
                        className={`${inputClassName} ${
                          errors.manualProductName ? "border-red-400" : ""
                        }`}
                      />
                      {errors.manualProductName && (
                        <p className="text-red-500 text-xs">
                          Product name is required
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Make *
                        </label>
                        <Controller
                          name="manualMake"
                          control={form.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <CustomSelect
                              options={brandOptions}
                              value={field.value}
                              onChange={(val: any) => {
                                field.onChange(val);
                                setValue("manualModel", "");
                              }}
                              placeholder="Select Make"
                              error={!!errors.manualMake}
                            />
                          )}
                        />
                        {errors.manualMake && (
                          <p className="text-red-500 text-xs">
                            Make is required
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Model *
                        </label>
                        <Controller
                          name="manualModel"
                          control={form.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <CustomSelect
                              options={filteredModelOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={
                                selectedManualMake
                                  ? "Select Model"
                                  : "Select Make first"
                              }
                              disabled={!selectedManualMake}
                              error={!!errors.manualModel}
                            />
                          )}
                        />
                        {errors.manualModel && (
                          <p className="text-red-500 text-xs">
                            Model is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Year *
                        </label>
                        <input
                          {...register("manualYear", { required: true })}
                          placeholder="e.g., 2023"
                          type="number"
                          min="1900"
                          max="2100"
                          className={`${inputClassName} ${
                            errors.manualYear ? "border-red-400" : ""
                          }`}
                        />
                        {errors.manualYear && (
                          <p className="text-red-500 text-xs">
                            Year is required
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Color *
                        </label>
                        <Controller
                          name="manualColor"
                          control={form.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <CustomSelect
                              options={colorOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select Color"
                              error={!!errors.manualColor}
                            />
                          )}
                        />
                        {errors.manualColor && (
                          <p className="text-red-500 text-xs">
                            Color is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-100">
                      <div className="space-y-2">
                        <label className="text-indigo-950 text-base font-medium">
                          Serial Number *
                        </label>
                        <input
                          {...register("productSerialNumber", {
                            required: true,
                          })}
                          placeholder="SN-2024-001"
                          className={`${inputClassName} w-full ${
                            errors.productSerialNumber ? "border-red-400" : ""
                          }`}
                        />
                        {errors.productSerialNumber && (
                          <p className="text-red-500 text-xs">
                            Serial number is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-indigo-950 text-base font-medium">
                          Purchase Date *
                        </label>
                        <input
                          {...register("purchaseDate", { required: true })}
                          type="date"
                          className={`${inputClassName} w-full ${
                            errors.purchaseDate ? "border-red-400" : ""
                          }`}
                        />
                        {errors.purchaseDate && (
                          <p className="text-red-500 text-xs">
                            Purchase date is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center pt-6">
                      <button
                        type="button"
                        onClick={handleAddNewVehicle}
                        disabled={!isManualFormValid || isAddingVehicle}
                        className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-3 min-w-[220px] ${
                          isManualFormValid
                            ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90 hover:shadow-lg hover:scale-[1.02] transition-transform"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isAddingVehicle ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Adding Company Vehicle...
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            Add Company Vehicle
                          </>
                        )}
                      </button>
                    </div>
                    {!isManualFormValid && (
                      <div className="text-center text-gray-500 text-sm pt-2">
                        Please fill all required fields (*) to add vehicle
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {customerId && productOwnership === "Customer Product" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {customerHasVehicles && !showManualForm ? (
              <>
                <label className="flex items-center gap-2 text-indigo-950 text-base font-medium leading-6">
                  Select Customers Product *
                  {isLoadingVehicles && (
                    <Loader2
                      className="animate-spin text-[#AD46FF]"
                      size={18}
                    />
                  )}
                </label>
                <Controller
                  name="vehicleId"
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomSelect
                      options={vehicleOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingVehicles
                          ? "Loading..."
                          : "Select customer's product"
                      }
                      error={!!errors.vehicleId}
                    />
                  )}
                />
                {errors.vehicleId && (
                  <p className="text-red-500 text-xs">
                    Please select a product
                  </p>
                )}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                  >
                    <Plus size={16} />
                    Add New Product
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="text-purple-900 text-sm font-bold font-['Arial']">
                      Enter Product Details Manually
                    </div>
                    {customerHasVehicles && (
                      <button
                        type="button"
                        onClick={() => setShowManualForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Back to list
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-indigo-950 text-base font-medium">
                        Vehicle Type *
                      </label>
                      <Controller
                        name="vehicleType"
                        control={form.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <CustomSelect
                            options={vehicleTypeOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Vehicle Type"
                            error={!!errors.vehicleType}
                          />
                        )}
                      />
                      {errors.vehicleType && (
                        <p className="text-red-500 text-xs">
                          Vehicle type is required
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-indigo-950 text-base font-medium">
                        Product Name *
                      </label>
                      <input
                        {...register("manualProductName", { required: true })}
                        placeholder="e.g., Pride Go-Go Elite Traveller"
                        className={`${inputClassName} ${
                          errors.manualProductName ? "border-red-400" : ""
                        }`}
                      />
                      {errors.manualProductName && (
                        <p className="text-red-500 text-xs">
                          Product name is required
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Make *
                        </label>
                        <Controller
                          name="manualMake"
                          control={form.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <CustomSelect
                              options={brandOptions}
                              value={field.value}
                              onChange={(val: any) => {
                                field.onChange(val);
                                setValue("manualModel", "");
                              }}
                              placeholder="Select Make"
                              error={!!errors.manualMake}
                            />
                          )}
                        />
                        {errors.manualMake && (
                          <p className="text-red-500 text-xs">
                            Make is required
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Model *
                        </label>
                        <Controller
                          name="manualModel"
                          control={form.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <CustomSelect
                              options={filteredModelOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={
                                selectedManualMake
                                  ? "Select Model"
                                  : "Select Make first"
                              }
                              disabled={!selectedManualMake}
                              error={!!errors.manualModel}
                            />
                          )}
                        />
                        {errors.manualModel && (
                          <p className="text-red-500 text-xs">
                            Model is required
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Year & Color */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Year *
                        </label>
                        <input
                          {...register("manualYear", { required: true })}
                          placeholder="e.g., 2023"
                          type="number"
                          min="1900"
                          max="2100"
                          className={`${inputClassName} ${
                            errors.manualYear ? "border-red-400" : ""
                          }`}
                        />
                        {errors.manualYear && (
                          <p className="text-red-500 text-xs">
                            Year is required
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-indigo-950 text-base font-medium">
                          Color *
                        </label>
                        <Controller
                          name="manualColor"
                          control={form.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <CustomSelect
                              options={colorOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select Color"
                              error={!!errors.manualColor}
                            />
                          )}
                        />
                        {errors.manualColor && (
                          <p className="text-red-500 text-xs">
                            Color is required
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Serial Number and Purchase Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-100">
                      <div className="space-y-2">
                        <label className="text-indigo-950 text-base font-medium">
                          Serial Number *
                        </label>
                        <input
                          {...register("productSerialNumber", {
                            required: true,
                          })}
                          placeholder="SN-2024-001"
                          className={`${inputClassName} w-full ${
                            errors.productSerialNumber ? "border-red-400" : ""
                          }`}
                        />
                        {errors.productSerialNumber && (
                          <p className="text-red-500 text-xs">
                            Serial number is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-indigo-950 text-base font-medium">
                          Purchase Date *
                        </label>
                        <input
                          {...register("purchaseDate", { required: true })}
                          type="date"
                          className={`${inputClassName} w-full ${
                            errors.purchaseDate ? "border-red-400" : ""
                          }`}
                        />
                        {errors.purchaseDate && (
                          <p className="text-red-500 text-xs">
                            Purchase date is required
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ADD VEHICLE BUTTON */}
                    <div className="flex justify-center pt-6">
                      <button
                        type="button"
                        onClick={handleAddNewVehicle}
                        disabled={!isManualFormValid || isAddingVehicle}
                        className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-3 min-w-[220px] ${
                          isManualFormValid
                            ? "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 hover:shadow-lg hover:scale-[1.02] transition-transform"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isAddingVehicle ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Adding Vehicle...
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            Add Vehicle to Customer
                          </>
                        )}
                      </button>
                    </div>

                    {/* Validation message */}
                    {!isManualFormValid && (
                      <div className="text-center text-gray-500 text-sm pt-2">
                        Please fill all required fields (*) to add vehicle
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show selected vehicle details */}
        {vehicleDetails && !showManualForm && (
          <div
            className={`self-stretch w-full px-6 pt-6 pb-6 rounded-2xl border grid grid-cols-2 gap-3 ${
              productOwnership === "Company product"
                ? "bg-linear-to-br from-blue-50 to-cyan-50 border-blue-100"
                : "bg-linear-to-br from-purple-50 to-pink-50 border-purple-100"
            }`}
          >
            <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
              <div
                className={`text-xs ${productOwnership === "Company product" ? "text-blue-600" : "text-purple-600"}`}
              >
                Make
              </div>
              <div className="text-gray-700 text-sm ">
                {vehicleDetails.vehicleBrandId?.brandName || "N/A"}
              </div>
            </div>
            <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
              <div
                className={`text-xs ${productOwnership === "Company product" ? "text-blue-600" : "text-purple-600"}`}
              >
                Model
              </div>
              <div className="text-gray-700 text-sm ">
                {vehicleDetails.vehicleModelId?.modelName || "N/A"}
              </div>
            </div>
            <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
              <div
                className={`text-xs ${productOwnership === "Company product" ? "text-blue-600" : "text-purple-600"}`}
              >
                Vehicle Type
              </div>
              <div className="text-gray-700 text-sm ">
                {vehicleDetails.vehicleType || "N/A"}
              </div>
            </div>
            <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
              <div
                className={`text-xs ${productOwnership === "Company product" ? "text-blue-600" : "text-purple-600"}`}
              >
                Serial No.
              </div>
              <div className="text-gray-700 text-sm ">
                {vehicleDetails.serialNumber || "N/A"}
              </div>
            </div>
            <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
              <div
                className={`text-xs ${productOwnership === "Company product" ? "text-blue-600" : "text-purple-600"}`}
              >
                Purchase Date
              </div>
              <div className="text-gray-700 text-sm ">
                {vehicleDetails.purchaseDate
                  ? new Date(vehicleDetails.purchaseDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            <div className="px-3 py-3 bg-white rounded-xl border border-white/40 shadow-sm">
              <div
                className={`text-xs ${productOwnership === "Company product" ? "text-blue-600" : "text-purple-600"}`}
              >
                Ownership
              </div>
              <div className="text-gray-700 text-sm ">
                {vehicleDetails.isVehicleCompanyOwned
                  ? "Company Owned"
                  : "Customer Owned"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepProduct;
