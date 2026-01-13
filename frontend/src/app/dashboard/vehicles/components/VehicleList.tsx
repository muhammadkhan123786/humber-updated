"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Search } from "lucide-react";

export default function VehicleList({ onEdit }: { onEdit: (id: string) => void }) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    console.log("Fetching vehicles from API...");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Full API Response:", res.data); // Debugging ke liye

      // FIX: GenericController aksar { success: true, data: [...] } bhejta hai
      let finalData = [];
      if (res.data && res.data.data) {
        finalData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      } else if (Array.isArray(res.data)) {
        finalData = res.data;
      }

      setVehicles(finalData);
    } catch (error) {
      console.error("Fetch error:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4">Vehicle Detail</th>
            <th className="px-6 py-4">Serial Number</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading fleet data...</td></tr>
          ) : vehicles.length > 0 ? (
            vehicles.map((v: any) => (
              <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  {/* Agar populate sahi kaam kar raha hai toh name dikhega, warna ID */}
                  <div className="font-bold text-gray-800">
                    {typeof v.vehicleModelId === 'object' ? v.vehicleModelId?.name : "Model ID: " + v.vehicleModelId}
                  </div>
                  <div className="text-xs text-gray-400">
                    {typeof v.vehicleBrandId === 'object' ? v.vehicleBrandId?.name : "Brand ID: " + v.vehicleBrandId}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{v.serialNumber}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-orange-50 text-[#FE6B1D] text-[10px] font-black rounded-full uppercase">
                    {v.vehicleType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit(v._id)} className="p-2 text-gray-400 hover:text-[#FE6B1D] hover:bg-orange-50 rounded-xl transition-all">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="p-10 text-center text-gray-400">No vehicles found in database.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}