"use client";
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import axios from "axios";
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface";

import VehicleIdentification from "./VehicleIdentification";
import BrandModelInfo from "./BrandModelInfo";
import WarrantyHistory from "./WarrantyHistory";
import VehicleNotes from "./VehicleNotes";

export default function VehicleManager() {
  const [loading, setLoading] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string>("");
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);

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
  });

  const handleSave = async () => {
    if (!formData.customerId || !formData.vehicleBrandId || !formData.vehicleModelId || !formData.serialNumber) {
      alert("Please fill all required fields: Customer, Brand, Model, and Serial Number.");
      return;
    }

    if (!currentUserId) {
      alert("User session not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // 1. FIXED: userId ko append karein (Kyunki backend validation ise maang rahi hai)
      // Agar aapke paas auth state hai to wahan se lein, warna testing ke liye hardcode karein
      data.append("userId", currentUserId);
      // 2. FIXED: purchaseYear aur makeYear ko sirf numeric string (4 chars) mein bhejein

      data.append("customerId", formData.customerId as string);
      data.append("vehicleBrandId", formData.vehicleBrandId as string);
      data.append("vehicleModelId", formData.vehicleModelId as string);
      data.append("vehicleType", formData.vehicleType as string);
      data.append("serialNumber", formData.serialNumber as string);
      data.append("note", formData.note || "");

      const formatDate = (dateValue: any) => {
        if (!dateValue) return "";
        const d = new Date(dateValue);
        return isNaN(d.getTime()) ? "" : d.toISOString();
      };

      data.append("purchaseDate", formatDate(formData.purchaseDate));
      data.append("warrantyStartDate", formatDate(formData.warrantyStartDate));
      data.append("warrantyEndDate", formatDate(formData.warrantyEndDate));

      // Image Handling
      if (formData.vehiclePhoto && formData.vehiclePhoto.startsWith('data:image')) {
        const response = await fetch(formData.vehiclePhoto);
        const blob = await response.blob();
        data.append("vehiclePhoto", blob, "vehicle_image.jpg");
      }

      const token = localStorage.getItem("token");
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register`;

      const res = await axios.post(apiEndpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201 || res.status === 200) {
        alert("Vehicle Profile Registered Successfully!");
      }

    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      // Backend validation errors ko dikhane ke liye
      const errorData = error.response?.data?.message;
      alert(typeof errorData === 'string' ? errorData : "Failed to save vehicle profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-32 p-4 relative">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#FE6B1D]">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Add New Vehicle</h1>
          <p className="text-gray-500 text-sm">Fill in the identification and warranty details below.</p>
        </div>
      </div>

      <VehicleIdentification formData={formData} setFormData={setFormData} />
      <BrandModelInfo formData={formData} setFormData={setFormData} />
      <WarrantyHistory formData={formData} setFormData={setFormData} />
      <VehicleNotes formData={formData} setFormData={setFormData} />

      {/* Save Button Container */}
      <div className="fixed bottom-6 right-8 z-50">
        <div className="flex gap-4 items-center bg-white/70 backdrop-blur-md p-3 rounded-3xl shadow-2xl border border-white/50">
          <button
            type="button"
            className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`min-w-[200px] bg-[#FE6B1D] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110"
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
                Save Vehicle Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}