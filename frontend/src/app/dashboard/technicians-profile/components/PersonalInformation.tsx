"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Badge, Briefcase, ChevronDown, Loader2 } from "lucide-react";

interface PersonalProps {
  formData: {
    firstName: string;
    lastName: string;
    employeeId: string;
    role: string;
  };
  setFormData: (data: any) => void;
}

// Backend se aane wale role ka interface
interface TechRole {
  _id: string;
  technicianRole: string; // Aapke backend model ki key
  isActive: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ROLES_API_URL = `${BASE_URL}/technician-roles`;

export default function PersonalInformation({ formData, setFormData }: PersonalProps) {
  const [roles, setRoles] = useState<TechRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Roles from your Master Form API
  useEffect(() => {
    const fetchMasterRoles = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = savedUser.id || savedUser._id;

        const res = await axios.get(ROLES_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId } // Bilkul waise hi jaise aapne client component mein kiya
        });

        // Sirf wahi roles dikhayenge jo "Active" hain
        if (res.data && res.data.data) {
          const activeRoles = res.data.data.filter((r: TechRole) => r.isActive);
          setRoles(activeRoles);
        }
      } catch (err) {
        console.error("Error fetching roles for dropdown:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#FE6B1D]">
        <User size={22} /> Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
}