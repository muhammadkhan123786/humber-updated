"use client";

import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  MapPin,
  CheckCircle,
  CircleCheckBig,
} from "lucide-react";
import { useRider } from "@/hooks/useRider";
import { RiderFormData } from "@/schema/rider.schema";

const EmploymentDetails: React.FC = () => {
  // Yahan 'loadingDropdowns' ko badal kar 'loading' kar diya gaya hai
  const { jobTypes, availabilities, cities, loading } = useRider();

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RiderFormData>();

  const selectedAvailabilities = watch("availbilitiesIds") || [];
  const selectedZones = watch("zones") || [];

  const toggleSelection = (
    id: string,
    currentArray: string[],
    fieldName: "availbilitiesIds" | "zones",
  ) => {
    const newArray = currentArray.includes(id)
      ? currentArray.filter((item) => item !== id)
      : [...currentArray, id];
    setValue(fieldName, newArray, { shouldValidate: true });
  };

  // Check for 'loading' instead of 'loadingDropdowns'
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading employment data...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
          <Briefcase size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Employment Details
          </h2>
          <p className="text-gray-500 text-sm">
            Work preferences and availability
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700">
          Employment Type
        </label>
        <Controller
          name="employeementTypeId"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(jobTypes as any[])?.map((type: any) => (
                <button
                  key={type._id}
                  type="button"
                  onClick={() => field.onChange(type._id)}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    field.value === type._id
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                      : "border-gray-100 bg-gray-50/30 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {type.jobTypeName}
                  </span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.employeementTypeId && (
          <p className="text-sm text-red-500">
            {errors.employeementTypeId.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700">
          Availability
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(availabilities as any[])?.map((avail: any) => {
            const isSelected = selectedAvailabilities.includes(avail._id);
            return (
              <button
                key={avail._id}
                type="button"
                onClick={() =>
                  toggleSelection(
                    avail._id,
                    selectedAvailabilities,
                    "availbilitiesIds",
                  )
                }
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 text-indigo-700"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {avail.name || "Day"}
                    </span>
                    {avail.fromTime && avail.toTime && (
                      <span className="text-xs text-gray-500">
                        {avail.fromTime} - {avail.toTime}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle size={18} className="text-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
        {errors.availbilitiesIds && (
          <p className="text-sm text-red-500">
            {errors.availbilitiesIds.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700">
          Preferred Delivery Zones
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(cities as any[])?.map((city: any) => {
            const isSelected = selectedZones.includes(city._id);
            return (
              <button
                key={city._id}
                type="button"
                onClick={() =>
                  toggleSelection(city._id, selectedZones, "zones")
                }
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 text-indigo-700"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span className="text-sm font-medium">
                    {city.cityName || city.name}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle size={18} className="text-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
        {errors.zones && (
          <p className="text-sm text-red-500">{errors.zones.message}</p>
        )}
      </div>

      <div className="p-6 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 flex items-start gap-4">
        <div className="text-emerald-600 mt-1">
          <CircleCheckBig size={22} />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Almost Done!</h4>
          <p className="text-xs">
            Review all information before submitting. You can update your
            preferences anytime from your rider profile.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmploymentDetails;
