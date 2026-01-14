"use client";
import { useEffect, useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface";

interface Props {
  formData: Partial<ICustomerVehicleRegInterface>;
  setFormData: any;
}

export default function VehicleIdentification({ formData, setFormData }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Logic for Edit Mode Preview ---
  useEffect(() => {
    if (formData.vehiclePhoto) {
      // 1. Check if it's a new upload (Base64)
      if (formData.vehiclePhoto.startsWith('data:')) {
        setImagePreview(formData.vehiclePhoto);
      } 
      // 2. Check if it's already a full URL (External or already processed)
      else if (formData.vehiclePhoto.startsWith('http')) {
        setImagePreview(formData.vehiclePhoto);
      }
      // 3. Backend path (e.g., uploads/image.jpg) - Combine with Base URL
      else {
        const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
        // Ensure no double slashes
        const cleanPath = formData.vehiclePhoto.startsWith('/') 
          ? formData.vehiclePhoto 
          : `/${formData.vehiclePhoto}`;
        
        setImagePreview(`${baseUrl}${cleanPath}`);
      }
    } else {
      setImagePreview(null);
    }
  }, [formData.vehiclePhoto]);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, vehiclePhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setFormData({ ...formData, vehiclePhoto: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Vehicle Visuals & Type</h2>
          <p className="text-xs text-gray-400">Identify the vehicle type and upload a reference photo.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {["Scooter", "Mobility Vehicle"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, vehicleType: type as any })}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                formData.vehicleType === type ? "bg-white text-[#FE6B1D] shadow-sm" : "text-gray-500"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div 
          onClick={handleBoxClick}
          className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#FE6B1D] cursor-pointer transition-all group overflow-hidden min-h-[250px] bg-gray-50/30"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {imagePreview ? (
            <>
              {/* Important: Using unoptimized img for standard URL/Base64 handling */}
              <img 
                src={imagePreview} 
                alt="Vehicle Preview" 
                className="absolute inset-0 w-full h-full object-contain p-2 bg-white" 
                onError={(e) => {
                  (e.target as any).src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full">Change Photo</p>
              </div>
              <button 
                type="button"
                onClick={removeImage}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors z-10"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                <UploadCloud className="text-gray-300 group-hover:text-orange-400 transition-colors" size={48} />
              </div>
              <p className="text-base font-bold text-gray-700">Upload Vehicle Photo</p>
              <p className="text-xs text-gray-400 mt-1">Drag and drop or click to browse (PNG, JPG up to 10MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}