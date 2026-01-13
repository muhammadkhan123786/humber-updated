"use client";
import { useState } from "react";
import { Save, Loader2, X } from "lucide-react";
// Interface import path as per your image structure
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface"; 

import VehicleIdentification from "./VehicleIdentification";
import BrandModelInfo from "./BrandModelInfo";
import WarrantyHistory from "./WarrantyHistory";
import VehicleNotes from "./VehicleNotes";

export default function VehicleManager() {
  const [loading, setLoading] = useState(false);
  
  // Initial state based on ICustomerVehicleRegInterface
  const [formData, setFormData] = useState<Partial<ICustomerVehicleRegInterface>>({
    vehicleType: "Scooter",
    customerId: "",
    vehicleBrandId: "",
    vehicleModelId: "",
    serialNumber: "",
    purchaseDate: new Date(),
    warrantyStartDate: new Date(),
    warrantyEndDate: new Date(),
    note: "",
    vehiclePhoto: "",
    makeYear: new Date().getFullYear(),
    purchaseYear: new Date().getFullYear(),
    userId: "current-user-id" 
  });

  const handleSave = async () => {
    // Basic validation check
    if (!formData.customerId || !formData.vehicleBrandId || !formData.serialNumber) {
        alert("Please fill required fields (Customer, Make, and Serial Number)");
        return;
    }

    setLoading(true);
    try {
      console.log("Saving Vehicle Data to Backend:", formData);
      
      // Artificial delay for loading effect
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Yahan aapki actual API call hogi:
      // await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicles`, formData);
      
      alert("Vehicle Profile Saved Successfully!");
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Failed to save vehicle profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-32 p-4 relative">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#FE6B1D]">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Create Vehicle Profile</h1>
          <p className="text-gray-500 text-sm">Fill in the details to register a new vehicle in the system.</p>
        </div>
      </div>

      {/* Form Components */}
      <VehicleIdentification formData={formData} setFormData={setFormData} />
      <BrandModelInfo formData={formData} setFormData={setFormData} />
      <WarrantyHistory formData={formData} setFormData={setFormData} />
      <VehicleNotes formData={formData} setFormData={setFormData} />

      {/* Bottom Right Floating/Sticky Save Bar */}
      <div className=" bottom-1 right-1 left-6 md:left-auto flex justify-end">
        <div className=" backdrop-blur-md  rounded-3xl shadow-2xl border border-gray-100 flex gap-4 items-center">
         
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className={`min-w-[180px] bg-[#FE6B1D] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Technician Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}