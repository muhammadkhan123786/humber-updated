"use client";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Bike,
  Shield,
  Phone,
  Calendar,
  Scooter,
  CircleAlert,
} from "lucide-react";
import FormInput from "../../components/FormInput";
import { useRider } from "@/hooks/useRider";
import { RiderFormData } from "@/schema/rider.schema";

const DriverSection: React.FC = () => {
  const { vehicleTypes, loadingDropdowns } = useRider();
  const {
    control,
    formState: { errors },
  } = useFormContext<RiderFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-100">
          <Bike size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Driver & Vehicle Information
          </h2>
          <p className="text-gray-500 text-sm">
            Driver license and vehicle details
          </p>
        </div>
      </div>

      {/* Driver Details Section */}
      <div className="p-6 rounded-xl border border-purple-100 bg-linear-to-r from-indigo-50 to-purple-50 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-lg text-purple-900">
          <Shield size={18} className="text-purple-700" />
          <span>Driver Details</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* License Number */}
          <div className="space-y-1">
            <Controller
              name="licenseNumber"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="License Number"
                  placeholder="SMITH901234AB5DE"
                  required
                  {...field}
                  error={!!errors.licenseNumber}
                />
              )}
            />
            {errors.licenseNumber && (
              <p className="text-xs text-red-500 pl-1">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-1">
            <Controller
              name="licenseExpiryDate"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Expiry Date"
                  type="date"
                  icon={<Calendar size={18} />}
                  required
                  {...field}
                  error={!!errors.licenseExpiryDate}
                />
              )}
            />
            {errors.licenseExpiryDate && (
              <p className="text-xs text-red-500 pl-1">
                {errors.licenseExpiryDate.message}
              </p>
            )}
          </div>

          {/* Years of Experience */}
          <div className="space-y-1">
            <Controller
              name="yearsOfExperience"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Years of Experience"
                  placeholder="5"
                  type="number"
                  required
                  value={field.value?.toString() || ""}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  error={!!errors.yearsOfExperience}
                />
              )}
            />
            {errors.yearsOfExperience && (
              <p className="text-xs text-red-500 pl-1">
                {errors.yearsOfExperience.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details Section */}
      <div className="p-6 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-lg text-blue-900">
          <Scooter size={18} className="text-blue-700" />
          <span>Vehicle Details</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Vehicle Type */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-semibold text-gray-700">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <Controller
              name="vehicleTypeId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value || ""}
                  className={`w-full h-11 px-4 border-2 rounded-xl text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                    errors.vehicleTypeId
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-100 focus:border-blue-500"
                  } bg-gray-50`}
                  disabled={loadingDropdowns}
                >
                  <option value="">
                    {loadingDropdowns ? "Loading..." : "Select Vehicle Type"}
                  </option>
                  {vehicleTypes?.map((type: any) => (
                    <option key={type._id} value={type._id}>
                      {type.vehicleType}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.vehicleTypeId && (
              <p className="text-xs text-red-500 pl-1">
                {errors.vehicleTypeId.message}
              </p>
            )}
          </div>

          {/* Model */}
          <div className="space-y-1">
            <Controller
              name="modelId"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Model"
                  placeholder="CBR500R"
                  required
                  {...field}
                  error={!!errors.modelId}
                />
              )}
            />
            {errors.modelId && (
              <p className="text-xs text-red-500 pl-1">
                {errors.modelId.message}
              </p>
            )}
          </div>

          {/* Year */}
          <div className="space-y-1">
            <Controller
              name="vehicleYear"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Year"
                  placeholder="2024"
                  required
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 4),
                    )
                  }
                  error={!!errors.vehicleYear}
                />
              )}
            />
            {errors.vehicleYear && (
              <p className="text-xs text-red-500 pl-1">
                {errors.vehicleYear.message}
              </p>
            )}
          </div>

          {/* License Plate */}
          <div className="space-y-1">
            <Controller
              name="licensePlate"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="License Plate"
                  placeholder="AB12 CDE"
                  required
                  {...field}
                  error={!!errors.licensePlate}
                />
              )}
            />
            {errors.licensePlate && (
              <p className="text-xs text-red-500 pl-1">
                {errors.licensePlate.message}
              </p>
            )}
          </div>

          {/* Insurance Company */}
          <div className="space-y-1">
            <Controller
              name="insuranceCompany"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Insurance Company"
                  placeholder="Allianz Insurance"
                  required
                  {...field}
                  error={!!errors.insuranceCompany}
                />
              )}
            />
            {errors.insuranceCompany && (
              <p className="text-xs text-red-500 pl-1">
                {errors.insuranceCompany.message}
              </p>
            )}
          </div>

          {/* Policy Number */}
          <div className="space-y-1">
            <Controller
              name="policyNumber"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Policy Number"
                  placeholder="POL123456"
                  required
                  {...field}
                  error={!!errors.policyNumber}
                />
              )}
            />
            {errors.policyNumber && (
              <p className="text-xs text-red-500 pl-1">
                {errors.policyNumber.message}
              </p>
            )}
          </div>

          {/* Insurance Expiry */}
          <div className="md:col-span-2 space-y-1">
            <Controller
              name="insuranceExpiryDate"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Insurance Expiry Date"
                  type="date"
                  icon={<Calendar size={18} />}
                  required
                  {...field}
                  error={!!errors.insuranceExpiryDate}
                />
              )}
            />
            {errors.insuranceExpiryDate && (
              <p className="text-xs text-red-500 pl-1">
                {errors.insuranceExpiryDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="p-6 bg-linear-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 space-y-6">
        <div className="flex items-center gap-2 text-amber-700 font-bold text-lg">
          <CircleAlert size={18} />
          <span>Emergency Contact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Emergency Name */}
          <div className="space-y-1">
            <Controller
              name="emergencyContactNumber"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Emergency Contact Name"
                  placeholder="Jane Smith"
                  required
                  {...field}
                  error={!!errors.emergencyContactNumber}
                />
              )}
            />
            {errors.emergencyContactNumber && (
              <p className="text-xs text-red-500 pl-1">
                {errors.emergencyContactNumber.message}
              </p>
            )}
          </div>

          {/* Emergency Phone (The one you mentioned) */}
          <div className="space-y-1">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Phone Number"
                  placeholder="+44 7700 900456"
                  icon={<Phone size={18} />}
                  required
                  type="Number"
                  {...field}
                  error={!!errors.phoneNumber}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 pl-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-1">
            <Controller
              name="relationShip"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Relationship"
                  placeholder="Mother"
                  required
                  {...field}
                  error={!!errors.relationShip}
                />
              )}
            />
            {errors.relationShip && (
              <p className="text-xs text-red-500 pl-1">
                {errors.relationShip.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 flex gap-4">
        <div className="text-emerald-600 mt-1">
          <CircleAlert size={20} />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Vehicle Requirements:</h4>
          <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
            <li>Vehicle must be roadworthy and legal</li>
            <li>Valid MOT certificate required (if applicable)</li>
            <li>Comprehensive insurance coverage needed</li>
            <li>Regular maintenance is riders responsibility</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default DriverSection;
