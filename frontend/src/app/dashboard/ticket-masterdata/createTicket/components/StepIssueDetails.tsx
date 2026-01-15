"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Info, Upload, X, Film } from "lucide-react";
import { Controller } from "react-hook-form";
interface ImageItem {
  file?: File; // for preview
  path: string; // string to send to backend
}

const StepIssueDetails = ({ onNext, onBack, form, isLoading }: any) => {
  const { control, watch, setValue } = form;
  const description = watch("issue_Details");
  const images = watch("vehicleRepairImages") || [];
  const videos = watch("vehicleRepairVideo") || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      // Update preview
      setPreviewImages([...previewImages, ...imageFiles]);

      // Update form with strings only
      const paths = imageFiles.map((file) => `/uploads/${file.name}`);
      setValue("vehicleRepairImages", [...(images || []), ...paths], {
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
        className="p-8 text-white w-full"
        style={{
          display: "inline-grid",
          height: "66px",
          rowGap: "6px",
          columnGap: "6px",
          gridTemplateRows: "minmax(0, 16fr) minmax(0, 1fr)",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          borderRadius: "12px 12px 0 0",
          background: "linear-gradient(90deg, #FF6900 0%, #FB2C36 100%)",
        }}
      >
        <h2 className="text-xl font-bold tracking-tight leading-none">
          Issue Details
        </h2>
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
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 ml-1">
              Upload Photos or Videos (Optional)
            </label>

            {/* Main Upload Dropzone Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-48 rounded-3xl border-2 border-dashed border-[#FF6900]/30 bg-[#FFF9F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF4ED] transition-all overflow-hidden"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-200"
                style={{
                  background:
                    "linear-gradient(135deg, #FF6900 0%, #FB2C36 100%)",
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

            {/* File Previews Grid */}
            <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mt-6">
              {previewImages.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-[20px] overflow-hidden"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    onClick={() => {
                      const newPreviews = previewImages.filter(
                        (_, i) => i !== index
                      );
                      setPreviewImages(newPreviews);

                      const newFormImages = images.filter(
                        (_: any, i: any) => i !== index
                      );
                      setValue("vehicleRepairImages", newFormImages, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    X
                  </button>
                </div>
              ))}

              {videos.length > 0 && (
                <div className="relative aspect-square rounded-[20px] overflow-hidden border border-blue-100 bg-blue-50 flex items-center justify-center group">
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
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
        </div>

        {/* Actions */}
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
            className={`flex items-center gap-2 px-10 py-4 font-black text-white transition-all ${
              description?.length >= 5
                ? "hover:opacity-90 scale-[1.02] active:scale-[0.98]"
                : "cursor-not-allowed opacity-50 shadow-none"
            }`}
            style={{
              borderRadius: "10px",
              background:
                description?.length >= 5
                  ? "linear-gradient(90deg, #FF6900 0%, #FB2C36 100%)"
                  : "#E5E7EB", // Gray-200
              boxShadow:
                description?.length >= 5
                  ? "0 10px 15px -3px rgba(255, 105, 0, 0.25), 0 4px 6px -4px rgba(251, 44, 54, 0.25)"
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
