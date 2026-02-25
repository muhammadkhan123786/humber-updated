"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  MapPin,
  CheckCircle,
  CircleCheckBig,
} from "lucide-react";

type EmploymentType =
  | "Full-Time"
  | "Part-Time"
  | "Self-Employed"
  | "Contractor";

const EmploymentDetails: React.FC = () => {
  const [empType, setEmpType] = useState<EmploymentType>("Full-Time");
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    [],
  );
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const toggleSelection = (item: string, state: string[], setState: any) => {
    setState(
      state.includes(item) ? state.filter((i) => i !== item) : [...state, item],
    );
  };

  const availabilityOptions = [
    { label: "Morning (6am-12pm)", icon: <Clock size={18} /> },
    { label: "Afternoon (12pm-6pm)", icon: <Clock size={18} /> },
    { label: "Evening (6pm-12am)", icon: <Clock size={18} /> },
    { label: "Night (12am-6am)", icon: <Clock size={18} /> },
    { label: "Weekends", icon: <Clock size={18} /> },
    { label: "Holidays", icon: <Clock size={18} /> },
  ];

  const deliveryZones = [
    "North London",
    "South London",
    "East London",
    "West London",
    "Central London",
    "Greater Manchester",
    "Birmingham City Centre",
  ];

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
          Employment Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              "Full-Time",
              "Part-Time",
              "Self-Employed",
              "Contractor",
            ] as EmploymentType[]
          ).map((type) => (
            <button
              key={type}
              onClick={() => setEmpType(type)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                empType === type
                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                  : "border-gray-100 bg-gray-50/30 text-gray-500 hover:border-gray-200"
              }`}
            >
              <Briefcase size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {type}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700">
          Availability *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availabilityOptions.map((opt) => {
            const isSelected = selectedAvailability.includes(opt.label);
            return (
              <button
                key={opt.label}
                onClick={() =>
                  toggleSelection(
                    opt.label,
                    selectedAvailability,
                    setSelectedAvailability,
                  )
                }
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 text-indigo-700"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {opt.icon}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                {isSelected && (
                  <CheckCircle size={18} className="text-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700">
          Preferred Delivery Zones *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deliveryZones.map((zone) => {
            const isSelected = selectedZones.includes(zone);
            return (
              <button
                key={zone}
                onClick={() =>
                  toggleSelection(zone, selectedZones, setSelectedZones)
                }
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 text-indigo-700"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span className="text-sm font-medium">{zone}</span>
                </div>
                {isSelected && (
                  <CheckCircle size={18} className="text-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
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
