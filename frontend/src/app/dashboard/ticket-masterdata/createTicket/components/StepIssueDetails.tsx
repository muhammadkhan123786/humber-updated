"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Info, Upload, X, Film } from "lucide-react";
import { Controller } from "react-hook-form";

const StepIssueDetails = ({ onNext, onBack, form, isLoading }: any) => {
  const { control, watch, setValue } = form;
  const description = watch("issue_Details");
  const images = watch("vehicleRepairImages") || [];
  const videos = watch("vehicleRepairVideo") || [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log(files);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      const newLocalBlobUrls = imageFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setValue("vehicleRepairImages", [...images, ...newLocalBlobUrls], {
        shouldValidate: true,
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    setValue("vehicleRepairImages", newImages, { shouldValidate: true });
  };

  const removeVideo = () => {
    setValue("vehicleRepairVideo", [], { shouldValidate: true });
  };

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500">
      <div
        className="p-8 text-white w-full flex items-center h-[66px] rounded-t-xl"
        style={{
          background: "linear-gradient(90deg, #FF6900 0%, #FB2C36 100%)",
        }}
      >
        <h2 className="text-xl font-bold tracking-tight">Issue Details</h2>
      </div>

      <div className="p-10 space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Fault Description *
          </label>
          <Controller
            name="issue_Details"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full p-6 rounded-3xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-medium outline-none focus:ring-2 ring-orange-100 min-h-[150px] resize-none"
                placeholder="What seems to be the problem?"
              />
            )}
          />
          <p className="text-gray-400 text-xs flex items-center gap-1 font-bold">
            <Info size={14} /> Be as descriptive as possible.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 ml-1">
            Upload Photos or Videos (Optional)
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-48 rounded-3xl border-2 border-dashed border-[#FF6900]/30 bg-[#FFF9F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF4ED] transition-all overflow-hidden"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-200"
              style={{
                background: "linear-gradient(135deg, #FF6900 0%, #FB2C36 100%)",
              }}
            >
              <Upload size={32} strokeWidth={2.5} />
            </div>
            <p className="text-[#1E293B] font-bold text-sm">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-400 text-[11px] mt-1">
              PNG, JPG, MP4 up to 10MB
            </p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mt-6">
            {images.map((path: string, index: number) => {
              const isLocalBlob = path.startsWith("blob:");
              const isFullUrl = path.startsWith("http");

              let displayUrl = path;
              if (!isLocalBlob && !isFullUrl) {
                const cleanPath = path.startsWith("/")
                  ? path.substring(1)
                  : path;
                displayUrl = `${BASE_URL}/${cleanPath}`;
                console.log("Display URL", displayUrl);
              }

              return (
                <div
                  key={`${displayUrl}-${index}`}
                  className="relative aspect-square rounded-[20px] overflow-hidden border-2 border-white shadow-sm group"
                >
                  <Image
                    src={displayUrl}
                    alt={`Preview ${index}`}
                    fill
                    unoptimized={true}
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
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">
                      EXISTING
                    </div>
                  )}
                </div>
              );
            })}

            {videos.length > 0 && (
              <div className="relative aspect-square rounded-[20px] border border-blue-100 bg-blue-50 flex items-center justify-center group">
                <div className="flex flex-col items-center">
                  <Film size={24} className="text-blue-500 mb-1" />
                  <span className="text-[10px] font-bold text-blue-400">
                    VIDEO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideo();
                  }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px]"
                >
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                    <X size={18} className="text-white" />
                  </div>
                </button>
              </div>
            )}
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

        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black bg-gray-50 text-gray-400 hover:bg-gray-100"
          >
            <ChevronLeft size={20} /> Previous
          </button>

          <button
            onClick={onNext}
            disabled={!description || description.length < 5 || isLoading}
            className="flex items-center gap-2 px-10 py-4 font-black text-white rounded-[10px] transition-all"
            style={{
              background:
                description?.length >= 5
                  ? "linear-gradient(90deg, #FF6900 0%, #FB2C36 100%)"
                  : "#E5E7EB",
              boxShadow:
                description?.length >= 5
                  ? "0 10px 15px -3px rgba(255, 105, 0, 0.25)"
                  : "none",
            }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Next <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepIssueDetails;
