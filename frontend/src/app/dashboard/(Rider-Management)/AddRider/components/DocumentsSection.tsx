"use client";
import React, { useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { FileText, Upload, Calendar, FileCheck, X } from "lucide-react";
import FormInput from "../../components/FormInput";
import { RiderFormData } from "@/schema/rider.schema";
import Image from "next/image";

interface FileUploadZoneProps {
  label: string;
  subtext?: string;
  extraHeading?: string;
  name: keyof RiderFormData;
  required?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  subtext,
  extraHeading,
  name,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RiderFormData>();

  const selectedFile = watch(name);
  const error = errors[name];
  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";
  const getPreviewUrl = () => {
    if (!selectedFile) return null;
    if (selectedFile instanceof File) {
      return URL.createObjectURL(selectedFile);
    }
    if (typeof selectedFile === "string" && selectedFile.trim() !== "") {
      return selectedFile.startsWith("http")
        ? selectedFile
        : `${IMAGE_BASE_URL}${selectedFile}`;
    }

    return null;
  };

  const previewUrl = getPreviewUrl();
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(name, file, { shouldValidate: true });
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, "" as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileName = () => {
    if (selectedFile instanceof File) return selectedFile.name;
    if (typeof selectedFile === "string") return selectedFile.split("/").pop();
    return null;
  };

  const fileName = getFileName();

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group
          ${
            fileName
              ? "border-emerald-500 bg-emerald-50/30"
              : error
                ? "border-red-500 bg-red-50/30"
                : "border-gray-200 bg-gray-50/30 hover:bg-blue-50/50 hover:border-blue-300"
          }`}
      >
        {previewUrl &&
        (typeof selectedFile === "string" ||
          (selectedFile instanceof File &&
            selectedFile.type.startsWith("image/"))) ? (
          <div className="relative w-full h-32 mb-2 flex justify-center">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain rounded-lg shadow-sm"
              unoptimized
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute -top-2 right-[35%] z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110
    ${fileName ? "bg-emerald-500 text-white" : "bg-white text-blue-600"}`}
          >
            {fileName ? <FileCheck size={24} /> : <Upload size={24} />}
          </div>
        )}

        <div className="text-center w-full px-4">
          {fileName ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-bold text-emerald-700 truncate max-w-[200px]">
                {fileName}
              </p>
              <button
                type="button"
                onClick={clearFile}
                className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">{subtext}</p>
              {extraHeading && (
                <p className="text-xs text-gray-500 mt-1 tracking-wide italic">
                  {extraHeading}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
};

const DocumentsSection: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RiderFormData>();

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-100">
          <FileText size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Documents & Licenses
          </h2>
          <p className="text-gray-500 text-sm">
            Upload required legal documents
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">Driving License</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="licenseNumber"
            control={control}
            render={({ field }) => (
              <FormInput
                label="License Number"
                placeholder="SMITH901234AB5DE"
                required
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.licenseNumber && (
            <p className="text-sm text-red-500 -mt-4">
              {errors.licenseNumber.message}
            </p>
          )}

          <Controller
            name="licenseExpiryDate"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Expiry Date"
                type="date"
                icon={<Calendar size={18} />}
                required
                min={today}
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.licenseExpiryDate && (
            <p className="text-sm text-red-500 -mt-4">
              {errors.licenseExpiryDate.message}
            </p>
          )}

          <FileUploadZone
            label="Licence Front"
            subtext="Upload Front"
            name="licenseFrontPic"
            required
          />

          <FileUploadZone
            label="Licence Back"
            subtext="Upload Back"
            name="licenseBackPic"
            required
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">Vehicle Insurance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="policyNumber"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Policy Number"
                placeholder="POL123456789"
                required
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.policyNumber && (
            <p className="text-sm text-red-500 -mt-4">
              {errors.policyNumber.message}
            </p>
          )}
          <Controller
            name="insuranceExpiryDate"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Expiry Date"
                type="date"
                icon={<Calendar size={18} />}
                required
                min={today}
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.insuranceExpiryDate && (
            <p className="text-sm text-red-500 -mt-4">
              {errors.insuranceExpiryDate.message}
            </p>
          )}

          <div className="md:col-span-2">
            <FileUploadZone
              label="Insurance Document"
              subtext="Upload Insurance Certificate"
              name="insuranceDocumentPic"
              required
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">
          MOT Certificate (if applicable)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="motCertificateNumber"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Certificate Number"
                placeholder="MOT123456789"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="motExpiryDate"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Expiry Date"
                type="date"
                min={today}
                icon={<Calendar size={18} />}
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />

          <div className="md:col-span-2">
            <FileUploadZone
              label="MOT Certificate"
              subtext="Upload MOT Certificate"
              name="motCertificatePic"
            />
          </div>
        </div>
      </div>
      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">Proof of Address</h3>
        <div className="md:col-span-2">
          <FileUploadZone
            label="Utility Bill or Bank Statement"
            subtext="Upload Utility Bill or Bank Statement"
            extraHeading="Must be dated within last 3 months"
            name="utilityBillPic"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentsSection;
