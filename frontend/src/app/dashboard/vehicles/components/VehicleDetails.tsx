"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

export default function VehicleDetails({
  vehicleId,
  onClose,
}: {
  vehicleId: string;
  onClose: () => void;
}) {
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register/${vehicleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        let finalData = res.data;
        if (res.data && res.data.data) {
          finalData = res.data.data;
        }
        setVehicle(finalData);
      } catch (error: any) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 flex justify-end p-4 border-b border-gray-100 bg-white">
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center gap-2 text-gray-400 p-20">
              <Loader2 className="animate-spin" size={20} /> Loading...
            </div>
          ) : vehicle ? (
            <div className="space-y-4">
              {/* Photo */}
              <div className="w-full h-72 rounded-t-2xl overflow-hidden border-b border-gray-200 bg-gray-50">
                {vehicle.vehiclePhoto ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${vehicle.vehiclePhoto}`}
                    alt="Vehicle"
                    width={72}
                    height={72}
                    unoptimized
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as any).src =
                        "https://via.placeholder.com/400x224?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-linear-to-br from-gray-100 to-gray-200">
                    <span className="text-sm">No Image Available</span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Model & Brand */}
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {vehicle.vehicleModelId?.name ||
                      vehicle.vehicleModelId?.modelName ||
                      "Unknown Model"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {vehicle.vehicleBrandId?.name ||
                      vehicle.vehicleBrandId?.brandName ||
                      "Unknown Brand"}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-[#FE6B1D] text-xs font-bold rounded-full uppercase">
                    {vehicle.vehicleType}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      vehicle.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vehicle.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Details List */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  {vehicle.serialNumber && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Serial Number
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.serialNumber}
                      </p>
                    </div>
                  )}

                  {vehicle.vehicleRegistrationNumberId && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Registration Number
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.vehicleRegistrationNumberId}
                      </p>
                    </div>
                  )}

                  {vehicle.colorId && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Color
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.colorId?.colorName || vehicle.colorId}
                      </p>
                    </div>
                  )}

                  {vehicle.fuelType && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Fuel Type
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.fuelType}
                      </p>
                    </div>
                  )}

                  {vehicle.yearOfManufacture && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Year
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.yearOfManufacture}
                      </p>
                    </div>
                  )}

                  {vehicle.engineNumber && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Engine Number
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.engineNumber}
                      </p>
                    </div>
                  )}

                  {vehicle.chassisNumber && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Chassis Number
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.chassisNumber}
                      </p>
                    </div>
                  )}

                  {vehicle.transmission && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Transmission
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.transmission}
                      </p>
                    </div>
                  )}

                  {vehicle.mileage && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Mileage
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.mileage} km
                      </p>
                    </div>
                  )}

                  {vehicle.licensePlate && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        License Plate
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {vehicle.licensePlate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 p-20">
              Vehicle not found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
