"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Check, Upload, X, CheckIcon, ShieldCheck } from "lucide-react";
import { Controller } from "react-hook-form";
import { CustomSelect } from "@/app/common-form/CustomSelect";

interface Props {
  onNext?: (formData: any) => void;
  onBack?: () => void;
  form: any;
  isLoading: boolean;
  decisions?: any[];
  insurances?: any[];
}

const StepIssueDetails: React.FC<Props> = ({ form, insurances = [] }) => {
  const { control, watch, setValue } = form;

  const images = watch("vehicleRepairImages") || [];
  const selectedDecisionId = watch("decisionId") || null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";

  const DECISION_OPTIONS = [
    {
      id: "Covered",
      label: "Covered under Warranty/Insurance",
      description: "No charge to customer",

      activeBg: "bg-gradient-to-r from-green-500 to-emerald-500",
      icon: <CheckIcon size={20} />,
    },
    {
      id: "Chargeable",
      label: "Chargeable Repair",
      description: "Customer will be charged",

      activeBg: "bg-gradient-to-r from-blue-500 to-sky-500",
      icon: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg ">
          £
        </div>
      ),
    },
    {
      id: "Mixed",
      label: "Mixed",
      description: "Partial warranty/insurance coverage",

      activeBg: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
      icon: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
          ⚡
        </div>
      ),
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const newImageUrls = imageFiles.map((f) => URL.createObjectURL(f));

    if (newImageUrls.length > 0) {
      setValue("vehicleRepairImages", [...images, ...newImageUrls], {
        shouldValidate: true,
      });
      setValue(
        "vehicleRepairImagesFile",
        [...(watch("vehicleRepairImagesFile") || []), ...imageFiles],
        { shouldValidate: true },
      );
    }
  };

  const removeImage = (index: number) => {
    const targetImage = images[index];
    const newImages = images.filter((_: string, i: number) => i !== index);
    setValue("vehicleRepairImages", newImages, { shouldValidate: true });

    if (targetImage.startsWith("blob:")) {
      const currentFiles = watch("vehicleRepairImagesFile") || [];
      const blobIndex = images
        .slice(0, index)
        .filter((img: string) => img.startsWith("blob:")).length;
      const newFiles = currentFiles.filter(
        (_: any, i: number) => i !== blobIndex,
      );
      setValue("vehicleRepairImagesFile", newFiles, { shouldValidate: true });
    }
  };
  const insuranceOptions = insurances
    .filter((ins: any) => ins?.insuranceCompanyName)
    .map((ins: any) => ({
      id: ins._id,
      label: ins.insuranceCompanyName,
    }));

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500">
      <div
        className="p-8 text-white w-full flex items-center h-[66px] rounded-t-xl"
        style={{
          background: "linear-gradient(90deg, #FF6900 0%, #FB2C36 100%)",
        }}
      >
        <div>
          <h2 className="text-xl font-bold pt-3 tracking-tight">
            Issue Details
          </h2>
          <p
            className="leading-none opacity-90 pt-2"
            style={{ fontSize: "12px", fontWeight: 400 }}
          >
            Describe the problem
          </p>
        </div>
      </div>

      <div className="p-10 space-y-8">
        <div className="space-y-3">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Fault or Accident Description{" "}
            <span className="text-red-500">*</span>
          </label>
          <Controller
            name="issue_Details"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="flex w-full min-h-16 px-3 py-2 rounded-md border-2 border-orange-100 bg-white text-base md:text-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-orange-300 focus:border-blue-400 focus:ring-[3px] focus:ring-blue-400/20 resize-none"
                placeholder="Describe the issue in detail..."
              />
            )}
          />

          <div className="flex items-center gap-2 text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span className="text-xs font-normal font-['Arial']">
              Provide as much detail as possible to help technicians understand
              the issue
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-indigo-950 text-base font-medium font-['Arial'] leading-6">
            Decision *
          </label>

          <div className="flex flex-col gap-3">
            {DECISION_OPTIONS.map((item) => {
              const isSelected = selectedDecisionId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() =>
                    setValue("decisionId", item.id, { shouldValidate: true })
                  }
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? `${item.activeBg} border-transparent shadow-lg scale-[1.01] text-white`
                      : "bg-white border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <div
                      className={`text-base font-medium font-['Arial'] ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-xs font-normal ${
                        isSelected ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="bg-white/20 rounded-full p-1">
                      <Check size={18} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDecisionId && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setValue("decisionId", undefined)}
                className="text-gray-400 text-xs font-medium hover:text-red-500 transition-colors"
              >
                Clear Decision
              </button>
            </div>
          )}
        </div>
        {(selectedDecisionId === "Covered" ||
          selectedDecisionId === "Mixed") && (
          <div className="space-y-4 p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-blue-500 rounded-full text-white shrink-0">
                <ShieldCheck size={25} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-blue-900">
                  Insurance Information
                </h3>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Required for warranty/insurance claims
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-5">
                {/* Insurance Company */}
                <div className="space-y-2">
                  <label className="text-blue-900 font-medium text-base">
                    Insurance Company *
                  </label>
                  <Controller
                    name="insuranceId"
                    control={control}
                    rules={{ required: "Insurance company is required" }}
                    render={({ field, fieldState }) => (
                      <CustomSelect
                        options={insuranceOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select insurance company"
                        error={fieldState.error}
                      />
                    )}
                  />
                </div>

                {/* Insurance Reference Number */}
                <div className="space-y-2">
                  <label className="text-blue-900 font-medium text-base">
                    Insurance Reference Number *
                  </label>
                  <Controller
                    name="insuranceReferenceNumber"
                    control={control}
                    rules={{
                      required: "Insurance reference number is required",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter insurance reference number"
                          className="w-full h-11 px-4 bg-white rounded-xl border border-blue-200 text-sm outline-none transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                  <p className="text-blue-600 text-xs italic mt-1">
                    This reference number will be used for insurance claim
                    processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 ml-1">
            Upload Photos or Videos
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-40 rounded-3xl border-2 border-dashed border-[#FF6900]/30 bg-[#FFF9F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF4ED] transition-all"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-3 bg-linear-to-br from-[#FF6900] to-[#FB2C36] shadow-md shadow-orange-200">
              <Upload size={24} />
            </div>
            <p className="text-[#1E293B] font-bold text-sm">
              Tap to upload media
            </p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((path: string, index: number) => {
              const isLocalBlob = path.startsWith("blob:");
              const isFullUrl = path.startsWith("http");
              let displayUrl = path;
              if (!isLocalBlob && !isFullUrl) {
                displayUrl = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
              }
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-white shadow-sm group"
                >
                  <Image
                    src={displayUrl}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default StepIssueDetails;
