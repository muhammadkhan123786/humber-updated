"use client";
import { useState } from "react";
import PersonalInformation from "./PersonalInformation";
import ContactDetails from "./ContactDetails";
import SpecializationSkills from "./SpecializationSkills";
import StatusAvailability from "./StatusAvailability"; // Naya component
import { Save } from "lucide-react";

export default function TechnicianProfileManager() {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "", 
    lastName: "", 
    employeeId: "", 
    role: "",
    
    // Contact Info
    email: "", 
    phone: "", 
    address: "",
    // Skills & Docs
    skills: [], 
    certFile: null,
    // Status & Availability (Naya State)
    isActive: true,
    serviceZones: [] ,
    profilePhoto: null,
  });

  const handleSave = () => {
    // Backend API hit karte waqt ye formData use hoga
    console.log("Saving Technician Data:", formData);
    alert("Technician profile with availability saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#FE6B1D]">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Create Technician Profile</h1>
          <p className="text-gray-500">Add detailed information for the technical staff</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#FE6B1D] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95"
        >
          <Save size={20} /> Save Profile
        </button>
      </div>

      {/* Form Sections */}
      <PersonalInformation formData={formData} setFormData={setFormData} />
      
      <ContactDetails formData={formData} setFormData={setFormData} />
      
      <StatusAvailability formData={formData} setFormData={setFormData} />

      <SpecializationSkills formData={formData} setFormData={setFormData} />
      
      {/* Save Button at Bottom too (Optional but Good UX) */}
      {/* <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-[#FE6B1D] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all active:scale-95"
        >
          Finalize & Save Technician
        </button>
      </div> */}
    </div>
  );
}