"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Search, Loader2 } from "lucide-react";

export default function VehicleList({ 
  onEdit, 
  onViewDetails 
}: { 
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Backend GenericController aksar data 'res.data.data' mein bhejta hai
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

  // DELETE FUNCTION
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200 || res.status === 204) {
        alert("Vehicle deleted successfully!");
        // List refresh karein bina page reload kiye
        setVehicles((prev) => prev.filter((v) => v._id !== id));
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete vehicle.");
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
            <th className="px-6 py-4">Photo</th>
            <th className="px-6 py-4">Vehicle Detail</th>
            <th className="px-6 py-4">Serial Number</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan={5} className="p-10 text-center">
                <div className="flex justify-center items-center gap-2 text-gray-400">
                  <Loader2 className="animate-spin" size={20} /> Loading fleet data...
                </div>
              </td>
            </tr>
          ) : vehicles.length > 0 ? (
            vehicles.map((v: any) => (
              
              <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
               
                {/* Photo Column */}
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                    
                    {v.vehiclePhoto ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${v.vehiclePhoto}`}
                        alt="Vehicle"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).src = "https://via.placeholder.com/40?text=No+Img"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">N/A</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">
                    {/* Backend populate names use karein agar available hain */}
                    {v.vehicleModelId?.name || v.vehicleModelId?.modelName || "Model ID: " + v.vehicleModelId}
                  </div>
                  <div className="text-xs text-gray-400">
                    {v.vehicleBrandId?.name || v.vehicleBrandId?.brandName || "Brand ID: " + v.vehicleBrandId}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{v.serialNumber}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-orange-50 text-[#FE6B1D] text-[10px] font-black rounded-full uppercase">
                    {v.vehicleType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {v.isActive ? "Active" : "Inactive"}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(v._id)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(v._id)}
                      className="p-2 text-gray-400 hover:text-[#FE6B1D] hover:bg-orange-50 rounded-xl transition-all"
                      title="Edit Vehicle"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Vehicle"
                    >
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