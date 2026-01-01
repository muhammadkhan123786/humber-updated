"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { User, Badge, Briefcase, ChevronDown, Loader2, Camera, Upload } from "lucide-react";

interface PersonalProps {
  formData: {
    firstName: string;
    lastName: string;
    employeeId: string;
    role: string;
    profilePhoto: File | null; // Naya field photo ke liye
  };
  setFormData: (data: any) => void;
}

interface TechRole {
  _id: string;
  technicianRole: string;
  isActive: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ROLES_API_URL = `${BASE_URL}/technician-roles`;

export default function PersonalInformation({ formData, setFormData }: PersonalProps) {
  const [roles, setRoles] = useState<TechRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMasterRoles = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = savedUser.id || savedUser._id;

        const res = await axios.get(ROLES_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId }
        });

        if (res.data && res.data.data) {
          const activeRoles = res.data.data.filter((r: TechRole) => r.isActive);
          setRoles(activeRoles);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size should be less than 3MB");
        return;
      }
      setFormData({ ...formData, profilePhoto: file });

      // Preview dikhane ke liye
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-[#FE6B1D]">
        <User size={22} /> Personal Information
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* LEFT SIDE: Profile Photo Upload Component */}
        <div className="w-full md:w-auto flex flex-col items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <User size={48} strokeWidth={1.5} />
                </div>
              )}
            </div>
            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept=".jpeg,.jpg,.png"
              className="hidden"
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-gray-700">Profile Photo</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">
              Allowed *.jpeg, *.jpg, *.png <br /> Max size of 3 MB
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 px-4 rounded-xl border border-gray-200 transition-all shadow-sm active:scale-95"
          >
            <Upload size={14} /> Upload New Photo
          </button>
        </div>

        {/* RIGHT SIDE: Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">First Name</label>
            <input
              type="text" name="firstName" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] transition-all"
              placeholder="John" value={formData.firstName} onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Last Name</label>
            <input
              type="text" name="lastName" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] transition-all"
              placeholder="Doe" value={formData.lastName} onChange={handleChange}
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Employee ID</label>
            <div className="relative">
              <Badge className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text" name="employeeId" required
                className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] transition-all"
                placeholder="TECH-2024-001" value={formData.employeeId} onChange={handleChange}
              />
            </div>
          </div>

          {/* Dynamic Role Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <select
                name="role"
                required
                disabled={isLoading}
                className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] transition-all appearance-none cursor-pointer disabled:opacity-50"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">{isLoading ? "Fetching roles..." : "Select Role"}</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.technicianRole}>
                    {role.technicianRole}
                  </option>
                ))}
              </select>
              {isLoading ? (
                <Loader2 className="absolute right-3 top-3.5 animate-spin text-gray-400" size={18} />
              ) : (
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}