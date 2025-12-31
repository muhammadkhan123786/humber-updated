"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Wrench, Plus, Upload, X, FileText, ChevronDown, Loader2 } from "lucide-react";

interface ComponentProps {
  formData: {
    skills: string[];
    certFile: File | null;
  };
  setFormData: any;
}

interface MasterService {
  _id: string;
  MasterServiceType: string;
  isActive: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MASTER_SERVICES_API = `${BASE_URL}/service-types-master`;

export default function SpecializationSkills({ formData, setFormData }: ComponentProps) {
  const [masterServices, setMasterServices] = useState<MasterService[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Master Services for Dropdown
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = savedUser.id || savedUser._id;

        const res = await axios.get(MASTER_SERVICES_API, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId, limit: 100 } // Sare active services mangwa lo
        });

        if (res.data && res.data.data) {
          // Sirf active services ko dropdown mein dikhana hai
          const activeServices = res.data.data.filter((s: MasterService) => s.isActive);
          setMasterServices(activeServices);
        }
      } catch (err) {
        console.error("Master Services Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  // 2. Add Skill from Dropdown
  const handleSelectSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.skills.includes(selectedValue)) {
      setFormData({ 
        ...formData, 
        skills: [...formData.skills, selectedValue] 
      });
    }
    // Reset dropdown to default
    e.target.value = "";
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      
      {/* 1. Skills Section Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "#FE6B1D" }}>
            <Wrench size={22} /> Specialization & Skills
          </h2>
          
          {/* Dropdown Input replaced the Button/Modal */}
          <div className="relative min-w-[250px]">
            <select 
              className="w-full p-3 pr-10 bg-orange-50 border border-orange-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FE6B1D] text-[#FE6B1D] font-bold appearance-none cursor-pointer transition-all"
              onChange={handleSelectSkill}
              defaultValue=""
              disabled={loading}
            >
              <option value="" disabled>{loading ? "Loading..." : "+ Select Technical Skill"}</option>
              {masterServices.map((service) => (
                <option 
                  key={service._id} 
                  value={service.MasterServiceType}
                  disabled={formData.skills.includes(service.MasterServiceType)}
                >
                  {service.MasterServiceType}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-[#FE6B1D]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        {/* Render Skills as Chips */}
        <div className="flex flex-wrap gap-3">
          {formData.skills.map((skill: string, index: number) => (
            <div key={index} className="group flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl hover:bg-[#FE6B1D] hover:text-white transition-all shadow-sm">
              <span className="text-sm font-bold">{skill}</span>
              <button 
                type="button" 
                onClick={() => removeSkill(index)} 
                className="text-orange-300 group-hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {formData.skills.length === 0 && (
            <div className="w-full py-8 border-2 border-dotted border-gray-100 rounded-2xl text-center">
              <p className="text-gray-400 text-sm italic">No skills selected. Use the dropdown to add your expertise.</p>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-8" />

      {/* 2. Certification Section (Keeping as per your original design) */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: "#FE6B1D" }}>
          <FileText size={22} /> Certification & Documents
        </h2>
        
        <div className="relative group">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) setFormData({...formData, certFile: e.target.files[0]});
            }}
          />
          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 group-hover:border-[#FE6B1D] transition-all bg-gray-50/50 group-hover:bg-orange-50/30">
            <div className="p-4 bg-white shadow-md rounded-2xl text-[#FE6B1D] group-hover:rotate-12 transition-transform">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-700">Drop your certification here</p>
              <p className="text-sm text-gray-400">PDF or Images up to 5MB</p>
            </div>
            
            {formData.certFile && (
              <div className="mt-2 bg-[#FE6B1D] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <FileText size={16} />
                <span className="text-sm font-bold truncate max-w-[150px]">{formData.certFile.name}</span>
                <X size={16} className="cursor-pointer" onClick={(e) => { e.preventDefault(); setFormData({...formData, certFile: null}); }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}