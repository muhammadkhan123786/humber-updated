"use client";
import { useState } from "react";
import PersonalInformation from "./PersonalInformation";
import ContactDetails from "./ContactDetails";
import SpecializationSkills from "./SpecializationSkills";
import StatusAvailability from "./StatusAvailability";
import { Save } from "lucide-react";

export default function TechnicianProfileManager() {
  const [formData, setFormData] = useState({
    // Personal Info (Updated with new fields)
    firstName: "", 
    lastName: "", 
    employeeId: "", 
    role: "",
    profilePhoto: null,
    joiningDate: "",      // New
    jobType: "Full Time", // New (Default value)
    salary: "",           // New
    salaryPeriod: "Per Month", // New (Default value)
    
    // Contact Info
    email: "", 
    phone: "", 
    address: "",

    // Skills & Docs
    skills: [], 
    certifications: [], // Array for multiple certifications
    
    // Status & Availability
    isActive: true,
    serviceZones: [],
  });

  const handleSave = async () => {
    // Console log for debugging
    console.log("Full Form Data to be Sent:", formData);
    
    // Basic Validation
    if (!formData.firstName || !formData.email || !formData.employeeId) {
        alert("Please fill in the required fields: First Name, Email, and Employee ID.");
        return;
    }

    // Yahan aap apna API logic likh sakte hain
    // Tip: Use FormData for sending files (profilePhoto and certifications)
    alert(`Success! Technician ${formData.firstName} profile prepared with ${formData.certifications.length} documents.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#FE6B1D]">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Create Technician Profile</h1>
          <p className="text-gray-500">Enter personal, professional, and contact details</p>
        </div>
      </div>

      {/* Form Sections */}
      <PersonalInformation formData={formData} setFormData={setFormData} />
      
      <ContactDetails formData={formData} setFormData={setFormData} />
      
      <StatusAvailability formData={formData} setFormData={setFormData} />

      <SpecializationSkills formData={formData} setFormData={setFormData} />
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-[#FE6B1D] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#e85a15] transition-all shadow-xl active:scale-95"
        >
          <Save size={20} /> Save Technician Profile
        </button>
      </div>
    </div>
  );
}