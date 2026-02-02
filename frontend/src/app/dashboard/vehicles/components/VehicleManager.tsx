"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, X } from "lucide-react";
import axios from "axios";
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface";

import VehicleIdentification from "./VehicleIdentification";
import BrandModelInfo from "./BrandModelInfo";
import VehicleNotes from "./VehicleNotes";

interface VehicleManagerProps {
  editId?: string | null;
  onSuccess: () => void;
}

export default function VehicleManager({
  editId,
  onSuccess,
}: VehicleManagerProps) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [formData, setFormData] = useState<
    Partial<ICustomerVehicleRegInterface>
  >({
    vehicleType: "Scooter",
    vehicleBrandId: "",
    vehicleModelId: "",
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
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register/${editId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const data = res.data.data || res.data;

          setFormData({
            ...data,

            vehicleBrandId: data.vehicleBrandId?._id || data.vehicleBrandId,
            vehicleModelId: data.vehicleModelId?._id || data.vehicleModelId,

            vehiclePhoto: data.vehiclePhoto || "",
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
    if (!formData.vehicleBrandId || !formData.vehicleModelId) {
      alert(
        "Please fill all required fields: Brand, Model, and Serial Number.",
      );
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("userId", currentUserId);
      data.append("vehicleBrandId", formData.vehicleBrandId as string);
      data.append("vehicleModelId", formData.vehicleModelId as string);
      data.append("vehicleType", formData.vehicleType as string);

      data.append("note", formData.note || "");

      if (formData.vehiclePhotoFile) {
        data.append("vehiclePhotoFile", formData.vehiclePhotoFile);
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
        alert(
          editId
            ? "Vehicle Updated Successfully!"
            : "Vehicle Registered Successfully!",
        );
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      const errorData = error.response?.data?.message;
      alert(
        typeof errorData === "string"
          ? errorData
          : "Failed to save vehicle profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-32 p-4 relative">
      {/* <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-lg text-white border-0 animate-slideInLeft">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              {editId ? "✏️ Edit Vehicle Profile" : "🚗 Add New Vehicle"}
            </h1>
            <p className="text-blue-100 text-sm">Update the identification and warranty details below.</p>
          </div>
          {editId && (
              <button onClick={onSuccess} className="p-2 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110">
                  <X size={24} />
              </button>
          )}
        </div>
      </div> */}

      <VehicleIdentification formData={formData} setFormData={setFormData} />
      <BrandModelInfo formData={formData} setFormData={setFormData} />
      {/* <WarrantyHistory formData={formData} setFormData={setFormData} /> */}
      <VehicleNotes formData={formData} setFormData={setFormData} />

      <div className="fixed bottom-6 right-8 z-50 animate-float">
        <div className="flex gap-4 items-center bg-white/95 backdrop-blur-md p-3 rounded-3xl shadow-2xl border border-white/50">
          <button
            type="button"
            className="px-6 py-3 text-gray-600 font-bold hover:bg-linear-to-r hover:from-gray-100 hover:to-gray-200 rounded-2xl transition-all hover:scale-105 active:scale-95"
            onClick={onSuccess}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`min-w-[200px] bg-linear-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 hover:shadow-2xl ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
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
