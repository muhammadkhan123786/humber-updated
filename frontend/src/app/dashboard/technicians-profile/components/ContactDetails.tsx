"use client";
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

// Inline Interface to keep it clean
interface ContactProps {
  formData: {
    email: string;
    phone: string;
    address: string;
  };
  setFormData: (data: any) => void;
}

export default function ContactDetails({ formData, setFormData }: ContactProps) {
  // Common handler to reduce repetitive code
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: "#FE6B1D" }}>
        <Mail size={22} /> Contact Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Email Address</label>
          <input 
            type="email" name="email" required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D]"
            placeholder="john@example.com"
            value={formData.email} onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="tel" name="phone" required
              className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D]"
              placeholder="+1 (555) 000000"
              value={formData.phone} onChange={handleChange}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600 block mb-1">Physical Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" name="address" required
              className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D]"
              placeholder="123 Service St, Mechanic City, TX"
              value={formData.address} onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}