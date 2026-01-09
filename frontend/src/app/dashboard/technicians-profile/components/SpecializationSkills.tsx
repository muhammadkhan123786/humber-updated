"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Wrench, Plus, Upload, X, FileText, ChevronDown, Loader2, Save } from "lucide-react";
import CertificationList from "./CertificationList";

interface ComponentProps {
  formData: {
    skills: string[];
    certifications: any[]; 
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

  // Local state for Add New Certificate Form
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [tempCert, setTempCert] = useState({
    docType: "",
    file: null as File | null
  });

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
          params: { userId, limit: 100 }
        });

        if (res.data && res.data.data) {
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
    e.target.value = "";
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  // 3. Certification Logic
  const handleSaveCertification = () => {
    if (!tempCert.docType || !tempCert.file) {
      alert("Please select document type and upload a file.");
      return;
    }

    const newCert = {
      id: Date.now().toString(),
      docType: tempCert.docType,
      file: tempCert.file,
      fileName: tempCert.file.name
    };

    setFormData({
      ...formData,
      certifications: [...(formData.certifications || []), newCert]
    });

    // Reset local form state
    setTempCert({ docType: "", file: null });
    setIsAddingCert(false);
  };

  const deleteCertification = (id: string) => {
    const filtered = formData.certifications.filter((c: any) => c.id !== id);
    setFormData({ ...formData, certifications: filtered });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      
      {/* 1. Skills Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "#FE6B1D" }}>
            <Wrench size={22} /> Specialization & Skills
          </h2>
          
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

      <hr className="border-gray-100 mb-8" />

      {/* 2. Certification Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "#FE6B1D" }}>
            <FileText size={22} /> Certification & Documents
          </h2>
          <button 
            type="button"
            onClick={() => setIsAddingCert(true)}
            className="flex items-center gap-2 bg-[#FE6B1D] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#e85a15] transition-all shadow-md"
          >
            <Plus size={18} /> Add New
          </button>
        </div>

        {/* Dynamic Add Form (Shown when Add New is clicked) */}
        {isAddingCert && (
          <div className="mb-6 p-6 border-2 border-orange-100 bg-orange-50/30 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Document Type Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Document Type</label>
                <select 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FE6B1D]"
                  value={tempCert.docType}
                  onChange={(e) => setTempCert({...tempCert, docType: e.target.value})}
                >
                  <option value="">-- Select Type --</option>
                  <option value="Trade License">Trade License</option>
                  <option value="Technical Certificate">Technical Certificate</option>
                  <option value="Identity Document">Identity Document (ID/Passport)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Upload Document Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Upload Document</label>
                <div className="relative h-[50px]">
                  <input 
                    type="file" 
                    accept=".jpg,.png,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) setTempCert({...tempCert, file: e.target.files[0]});
                    }}
                  />
                  <div className="flex items-center justify-between px-4 h-full border border-dashed border-gray-300 bg-white rounded-xl">
                    <span className="text-sm text-gray-500 truncate max-w-[180px]">
                      {tempCert.file ? tempCert.file.name : "Choose File (JPG, PNG, PDF)"}
                    </span>
                    <Upload size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => { setIsAddingCert(false); setTempCert({docType: "", file: null}); }}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveCertification}
                className="flex items-center gap-2 bg-[#FE6B1D] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#e85a15] shadow-sm"
              >
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        )}

        {/* List of Saved Certifications */}
        <CertificationList 
          certifications={formData.certifications} 
          onDelete={deleteCertification} 
        />

        {(!formData.certifications || formData.certifications.length === 0) && !isAddingCert && (
          <div className="w-full py-12 border-2 border-dotted border-gray-100 rounded-3xl text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload size={40} className="text-gray-200" />
              <p className="text-gray-400 text-sm">No documents added yet. Click "Add New" to upload.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}