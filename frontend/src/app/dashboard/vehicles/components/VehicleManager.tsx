"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, X } from "lucide-react";
import axios from "axios";
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface";

import VehicleIdentification from "./VehicleIdentification";
import BrandModelInfo from "./BrandModelInfo";
import WarrantyHistory from "./WarrantyHistory";
import VehicleNotes from "./VehicleNotes";

interface VehicleManagerProps {
  editId?: string | null;
  onSuccess: () => void;
}

export default function VehicleManager({ editId, onSuccess }: VehicleManagerProps) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [formData, setFormData] = useState<Partial<ICustomerVehicleRegInterface>>({
    vehicleType: "Scooter",
    vehicleBrandId: "",
    vehicleModelId: "",
    serialNumber: "",
    purchaseDate: new Date(),
    warrantyStartDate: new Date(),
    warrantyEndDate: new Date(),
    note: "",
    vehiclePhoto: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setCurrentUserId(storedUserId);

    if (editId) {
      const fetchVehicleDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register/${editId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const data = res.data.data || res.data;

          setFormData({
            ...data,
            // Backend agar object bhej raha hai toh ID extract karein
            vehicleBrandId: data.vehicleBrandId?._id || data.vehicleBrandId,
            vehicleModelId: data.vehicleModelId?._id || data.vehicleModelId,
            // Dates handling
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
            warrantyStartDate: data.warrantyStartDate ? new Date(data.warrantyStartDate) : new Date(),
            warrantyEndDate: data.warrantyEndDate ? new Date(data.warrantyEndDate) : new Date(),
            vehiclePhoto: data.vehiclePhoto || ""
          });
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
          alert("Failed to load vehicle data.");
        }
      };
      fetchVehicleDetails();
    }
  }, [editId]);

  const handleSave = async () => {
    // Validation: customerId yahan se remove kar di gayi hai
    if (!formData.vehicleBrandId || !formData.vehicleModelId || !formData.serialNumber) {
      alert("Please fill all required fields: Brand, Model, and Serial Number.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("userId", currentUserId);
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
      const apiEndpoint = editId 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register/${editId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register`;

      const res = await axios({
        method: editId ? "put" : "post",
        url: apiEndpoint,
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201 || res.status === 200) {
        alert(editId ? "Vehicle Updated Successfully!" : "Vehicle Registered Successfully!");
        onSuccess();
      }

    } catch (error: any) {
      console.error("Error saving vehicle:", error);
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
          <h1 className="text-2xl font-black text-gray-800">
            {editId ? "Edit Vehicle Profile" : "Add New Vehicle"}
          </h1>
          <p className="text-gray-500 text-sm">Update the identification and warranty details below.</p>
        </div>
        {editId && (
            <button onClick={onSuccess} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
            </button>
        )}
      </div>

      <VehicleIdentification formData={formData} setFormData={setFormData} />
      <BrandModelInfo formData={formData} setFormData={setFormData} />
      <WarrantyHistory formData={formData} setFormData={setFormData} />
      <VehicleNotes formData={formData} setFormData={setFormData} />

      <div className="fixed bottom-6 right-8 z-50">
        <div className="flex gap-4 items-center bg-white/70 backdrop-blur-md p-3 rounded-3xl shadow-2xl border border-white/50">
          <button
            type="button"
            className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all"
            onClick={onSuccess}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`min-w-[200px] bg-[#FE6B1D] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110"}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {editId ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={20} />
                {editId ? "Update Vehicle Profile" : "Save Vehicle Profile"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}