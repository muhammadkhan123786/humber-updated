"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Calendar, FileCheck, X } from "lucide-react";
import FormInput from "../../components/FormInput";

const FileUploadZone = ({
  label,
  subtext,
  extraHeading,
  name,
}: {
  label: string;
  subtext?: string;
  extraHeading?: string;
  name: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log(`File for ${name}:`, e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} *
      </label>

      <input
        type="file"
        name={name}
        ref={fileInputRef}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />

      <div
        onClick={handleZoneClick}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group
          ${
            selectedFile
              ? "border-emerald-500 bg-emerald-50/30"
              : "border-gray-200 bg-gray-50/30 hover:bg-blue-50/50 hover:border-blue-300"
          }`}
      >
        <div
          className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110
          ${selectedFile ? "bg-emerald-500 text-white" : "bg-white text-blue-600"}`}
        >
          {selectedFile ? <FileCheck size={24} /> : <Upload size={24} />}
        </div>

        <div className="text-center w-full px-4">
          {selectedFile ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-bold text-emerald-700 truncate max-w-[200px]">
                {selectedFile.name}
              </p>
              <button
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
    </div>
  );
};

const DocumentsSection: React.FC = () => {
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
          <FormInput
            label="License Number"
            placeholder="SMITH901234AB5DE"
            required
          />
          <FormInput
            label="Expiry Date"
            type="date"
            icon={<Calendar size={18} />}
            required
          />
          <FileUploadZone
            label="Licence Front"
            subtext="Upload Front"
            name="license_front"
          />
          <FileUploadZone
            label="Licence Back"
            subtext="Upload Back"
            name="license_back"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">Vehicle Insurance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Policy Number"
            placeholder="POL123456789"
            required
          />
          <FormInput
            label="Expiry Date"
            type="date"
            icon={<Calendar size={18} />}
            required
          />
          <div className="md:col-span-2">
            <FileUploadZone
              label="Insurance Document"
              subtext="Upload Insurance Certificate"
              name="insurance_doc"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">
          MOT Certificate (if applicable)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Certificate Number" placeholder="MOT123456789" />
          <FormInput
            label="Expiry Date"
            type="date"
            icon={<Calendar size={18} />}
          />
          <div className="md:col-span-2">
            <FileUploadZone
              label="MOT Certificate"
              subtext="Upload MOT Certificate"
              name="mot_cert"
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
            name="proof_of_address"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentsSection;
