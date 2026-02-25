"use client";
import React, { useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  MapPin,
  Camera,
  UploadCloud,
} from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../../components/FormInput";
import Image from "next/image";

const PersonalInfoForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
          <User size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            Personal Information
          </h2>
          <p className="text-gray-500 text-sm">Basic details about the rider</p>
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Profile Photo *
        </label>
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-inner flex items-center justify-center text-gray-400 overflow-hidden relative group">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                className="object-cover transition-transform group-hover:scale-110"
                unoptimized
                priority
              />
            ) : (
              <Camera size={32} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm w-fit active:scale-95"
            >
              <UploadCloud size={18} className="text-blue-600" />
              {previewUrl ? "Change Photo" : "Upload Photo"}
            </button>
            <p className="text-[10px] text-gray-400 pl-1">
              JPG, PNG or GIF (max. 5MB)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="First Name" placeholder="John" required />
        <FormInput label="Last Name" placeholder="Smith" required />

        <FormInput
          label="Email Address"
          placeholder="john.smith@example.com"
          icon={<Mail size={18} />}
          required
        />
        <FormInput
          label="Phone Number"
          placeholder="+44 7700 900123"
          icon={<Phone size={18} />}
          required
        />

        <FormInput
          label="Date of Birth"
          type="date"
          icon={<Calendar size={18} />}
          required
        />
        <FormInput
          label="National Insurance Number"
          placeholder="AB123456C"
          icon={<ShieldCheck size={18} />}
          required
        />

        <div className="md:col-span-2">
          <FormInput
            label="Address"
            placeholder="123 High Street, Apartment 4B..."
            icon={<MapPin size={18} />}
            required
            multiline={true}
            rows={3}
          />
        </div>

        <FormInput label="City" placeholder="London" required />
        <FormInput label="Postcode" placeholder="SW1A 1AA" required />
      </div>
    </motion.div>
  );
};

export default PersonalInfoForm;
