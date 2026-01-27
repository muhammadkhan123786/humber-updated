"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Info, Upload, X } from "lucide-react";
import { Controller } from "react-hook-form";

interface Props {
  onNext?: (formData: any) => void;
  onBack?: () => void;
  form: any;
  isLoading: boolean;
}

const StepIssueDetails: React.FC<Props> = ({ form }) => {
  const { control, watch, setValue } = form;

  const images = watch("vehicleRepairImages") || [];
  const videos = watch("vehicleRepairVideo") || [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const videoFiles = files.filter((f) => f.type.startsWith("video/"));

    const newImageUrls = imageFiles.map((f) => URL.createObjectURL(f));
    const newVideoUrls = videoFiles.map((f) => URL.createObjectURL(f));

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

    if (newVideoUrls.length > 0) {
      setValue("vehicleRepairVideo", [...videos, ...newVideoUrls], {
        shouldValidate: true,
      });
      setValue(
        "vehicleRepairVideoFile",
        [...(watch("vehicleRepairVideoFile") || []), ...videoFiles],
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
          <label className="text-indigo-950 text-base font-bold font-['Arial'] leading-6">
            Fault or Accident Description{" "}
            <span className="text-red-500">*</span>
          </label>

          <Controller
            name="issue_Details"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                required
                className="
          w-full mt-2 p-6
          rounded-3xl
          bg-[#F8FAFF]
          border border-[#EEF2FF]
          text-[#1E293B] font-medium
          outline-none
          focus:ring-2 focus:ring-orange-100
          focus:border-orange-300
          min-h-[150px]
          resize-none
          placeholder:text-slate-400
        "
                placeholder="Describe the issue in detail..."
              />
            )}
          />

          <div className="flex items-start gap-2 text-gray-500 text-xs font-normal font-['Arial'] leading-4">
            <Info size={12} strokeWidth={1.5} className="mt-0.5" />
            <span>
              Provide as much detail as possible to help technicians understand
              the issue
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 ml-1">
            Upload Photos or Videos (Optional)
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-48 rounded-3xl border-2 border-dashed border-[#FF6900]/30 bg-[#FFF9F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF4ED] transition-all"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 bg-linear-to-br from-[#FF6900] to-[#FB2C36] shadow-lg shadow-orange-200">
              <Upload size={32} />
            </div>
            <p className="text-[#1E293B] font-bold text-sm">
              Click to upload or drag and drop
            </p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mt-6">
            {images.map((path: string, index: number) => {
              const isLocalBlob = path.startsWith("blob:");
              const isFullUrl = path.startsWith("http");
              let displayUrl = path;
              if (!isLocalBlob && !isFullUrl) {
                displayUrl = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
              }

              return (
                <div
                  key={`${displayUrl}-${index}`}
                  className="relative aspect-square rounded-[20px] overflow-hidden border-2 border-white shadow-sm group"
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
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={14} />
                  </button>
                  {!isLocalBlob && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-1 font-bold">
                      EXISTING
                    </div>
                  )}
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
