"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { User, Badge, Briefcase, ChevronDown, Loader2, Upload, Calendar, Banknote } from "lucide-react";

interface PersonalProps {
  formData: {
   person: {
      firstName: string;
      lastName: string;
    };
    employeeId: string;
    role: string;
    profilePhoto: File | null;
    joiningDate: string;
    jobType: string;
    salary: string;
    salaryPeriod: string;
  };
  setFormData: (data: any) => void;
}

interface TechRole {
  _id: string;
  technicianRole: string;
  isActive: boolean;
}

interface JobType {
  _id: string;
  jobTypeName: string;
  isActive: boolean;
  isDefault: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ROLES_API_URL = `${BASE_URL}/technician-roles`;
const JOB_TYPES_API_URL = `${BASE_URL}/job-types`;

export default function PersonalInformation({ formData, setFormData }: PersonalProps) {
  const [roles, setRoles] = useState<TechRole[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingJobTypes, setIsLoadingJobTypes] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || savedUser._id;
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Technician Roles
      try {
        setIsLoadingRoles(true);
        const res = await axios.get(ROLES_API_URL, { headers, params: { userId } });
        if (res.data?.data) {
          setRoles(res.data.data.filter((r: TechRole) => r.isActive));
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      } finally {
        setIsLoadingRoles(false);
      }

      // Fetch Job Types
      try {
        setIsLoadingJobTypes(true);
        const res = await axios.get(JOB_TYPES_API_URL, { headers, params: { userId } });
        if (res.data?.data) {
          const activeJobTypes = res.data.data.filter((j: JobType) => j.isActive);
          setJobTypes(activeJobTypes);

          // Agar koi Job Type "isDefault" hai aur formData mein abhi kuch nahi hai, toh usey set karein
          const defaultType = activeJobTypes.find((j: JobType) => j.isDefault);
          if (defaultType && !formData.jobType) {
            setFormData((prev: any) => ({ ...prev, jobType: defaultType.jobTypeName }));
          }
        }
      } catch (err) {
        console.error("Error fetching job types:", err);
      } finally {
        setIsLoadingJobTypes(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size should be less than 3MB");
        return;
      }
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-[#FE6B1D]">
        <User size={22} /> Personal Information
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT SIDE: Profile Photo */}
        <div className="w-full lg:w-auto flex flex-col items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 min-w-[180px]">
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
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept=".jpeg,.jpg,.png" className="hidden" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700">Profile Photo</p>
            <p className="text-[10px] text-gray-400 mt-1">Max size 3 MB</p>
          </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 px-4 rounded-xl border border-gray-200 transition-all shadow-sm active:scale-95">
            <Upload size={14} /> Upload
          </button>
        </div>

        {/* RIGHT SIDE: Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          {/* Row 1: Names */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">First Name</label>
            <input type="text" name="firstName" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] transition-all" placeholder="John" value={formData.person.firstName} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Last Name</label>
            <input type="text" name="lastName" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] transition-all" placeholder="Doe" value={formData.person.lastName} onChange={handleChange} />
          </div>

          {/* Row 2: ID and Role */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Employee ID</label>
            <div className="relative">
              <Badge className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="text" name="employeeId" required className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D]" placeholder="TECH-001" value={formData.employeeId} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <select name="role" required className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] appearance-none cursor-pointer" value={formData.role} onChange={handleChange}>
                <option value="">{isLoadingRoles ? "Loading roles..." : "Select Role"}</option>
                {roles.map((r) => <option key={r._id} value={r.technicianRole}>{r.technicianRole}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Row 3: Joining Date and Dynamic Job Type */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Joining Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="date" name="joiningDate" className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D]" value={formData.joiningDate} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Job Type</label>
            <div className="relative">
              <select name="jobType" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] appearance-none cursor-pointer" value={formData.jobType} onChange={handleChange}>
                <option value="">{isLoadingJobTypes ? "Loading job types..." : "Select Job Type"}</option>
                {jobTypes.map((j) => (
                  <option key={j._id} value={j.jobTypeName}>
                    {j.jobTypeName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Row 4: Salary & Period */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 block mb-1">Salary & Period</label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Banknote className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="number"
                  name="salary"
                  placeholder="Enter Amount"
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={formData.salary}
                  onChange={handleChange}
                  onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                />
              </div>
              <div className="relative md:w-1/3">
                <select name="salaryPeriod" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] appearance-none cursor-pointer" value={formData.salaryPeriod} onChange={handleChange}>
                  <option value="Per Month">Per Month</option>
                  <option value="Per Week">Per Week</option>
                  <option value="Per Year">Per Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}