"use client";
import React from "react";
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

const DriverSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
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

      <div className="p-6 rounded-xl border border-purple-100 bg-linear-to-r from-indigo-50 to-purple-50 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Shield size={18} className="text-purple-700" />
          <span>Driver Details</span>
        </div>
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
          <FormInput
            label="Years of Experience"
            placeholder="5"
            type="number"
            required
          />
        </div>
      </div>

      <div className="p-6 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Scooter size={18} className="text-blue-700" />
          <span>Vehicle Details</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Vehicle Type *
            </label>
            <select className="w-full h-11 px-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all">
              <option>Select Vehicle Type</option>
              <option>Motorcycle</option>
              <option>Van</option>
              <option>Car</option>
              <option>Bicycle</option>
            </select>
          </div>
          <FormInput label="Model" placeholder="CBR500R" required />
          <FormInput label="Year" placeholder="2024" required />
          <FormInput label="License Plate" placeholder="AB12 CDE" required />
          <FormInput
            label="Insurance Company"
            placeholder="Allianz Insurance"
            required
          />
          <div className="md:col-span-2">
            <FormInput
              label="Insurance Expiry Date"
              type="date"
              icon={<Calendar size={18} />}
              required
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-linear-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 space-y-6">
        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
          <CircleAlert size={18} />
          <span>Emergency Contact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Emergency Contact Name"
            placeholder="Jane Smith"
            required
          />
          <FormInput
            label="Phone Number"
            placeholder="+44 7700 900456"
            icon={<Phone size={18} />}
            required
          />
          <div className="md:col-span-2">
            <FormInput label="Relationship" placeholder="Mother" required />
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
