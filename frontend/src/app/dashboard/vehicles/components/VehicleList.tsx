"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Search, Loader2, Grid3x3, List, CheckCircle, AlertCircle, FileText, Zap } from "lucide-react";
import Image from "next/image";

interface VehicleListProps {
  displayView: "card" | "table";
  setDisplayView: (view: "card" | "table") => void;
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export default function VehicleList({
  displayView,
  setDisplayView,
  onEdit,
  onViewDetails
}: VehicleListProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let finalData = [];
      if (res.data && res.data.data) {
        finalData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      } else if (Array.isArray(res.data)) {
        finalData = res.data;
      }
      setVehicles(finalData);
      setFilteredVehicles(finalData);
    } catch (error) {
      console.error("Fetch error:", error);
      setVehicles([]);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and Search Logic
  useEffect(() => {
    let result = vehicles;

    // Apply search filter
    if (searchTerm) {
      result = result.filter((v) =>
        v.vehicleModelId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleModelId?.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleBrandId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleBrandId?.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((v) =>
        filterStatus === "active" ? v.isActive : !v.isActive
      );
    }

    setFilteredVehicles(result);
  }, [searchTerm, filterStatus, vehicles]);

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

  // Calculate stats
  const activeVehicles = vehicles.filter(v => v.isActive).length;
  const inactiveVehicles = vehicles.filter(v => !v.isActive).length;
  const totalVehicles = vehicles.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Vehicles Card */}
        <div className="bg-linear-to-br from-green-400 via-green-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <CheckCircle size={32} className="text-white/90 animate-pulse" />

              <div className="text-4xl font-black">{activeVehicles}</div>
              <p className="text-green-50 text-sm">Active Vehicles</p>
            </div>
            <div className="">
              <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Active</span>
            </div>
          </div>
        </div>

        {/* Inactive Vehicles Card */}
        <div className="bg-linear-to-br from-amber-400 via-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <AlertCircle size={32} className="text-white/90 animate-bounce" />
              <div className="text-4xl font-black">{inactiveVehicles}</div>
              <p className="text-amber-50 text-sm">Inactive Vehicles</p>
            </div>
            <div className="">

              <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Inactive</span>
            </div>
          </div>
        </div>

        {/* Total Vehicles Card */}
        <div className="bg-linear-to-br from-blue-400 via-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <Zap size={32} className="text-white/90" />
              <div className="text-4xl font-black">{totalVehicles}</div>
              <p className="text-blue-50 text-sm">Total Fleet Size</p>
            </div>
            <div className="">

              <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Total</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-linear-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <FileText size={32} className="text-white/90" />
              <div className="text-4xl font-black">{filteredVehicles.length}</div>
              <p className="text-pink-50 text-sm">Vehicles Listed</p>
            </div>
            <div className="">
              <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Showing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex-1 relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by brand, model, serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* View Toggle Buttons */}
        <div className="flex gap-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl p-1">
          <button
            onClick={() => setDisplayView("card")}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "card"
              ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <Grid3x3 size={18} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setDisplayView("table")}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "table"
              ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <List size={18} />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600 font-medium">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>

      {/* Card View */}
      {displayView === "card" && (
        <div>
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-gray-400 py-20">
              <Loader2 className="animate-spin" size={24} /> Loading fleet data...
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((v: any) => (
                <div
                  key={v._id}
                  className="bg-linear-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-300 hover:scale-110 hover:-translate-y-2 cursor-pointer transform"
                >
                  {/* Vehicle Image */}
                  <div className="h-48 bg-linear-to-br from-gray-300 via-gray-200 to-gray-300 relative overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                    {v.vehiclePhoto ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${v.vehiclePhoto}`}
                        alt="Vehicle"
                        fill
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                        onError={(e) => { (e.target as any).src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                      />
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-gray-300 text-5xl mb-2">🚗</div>
                        <p className="text-gray-400 text-sm">No Image</p>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Vehicle Details */}
                    <div className="mb-4 animate-fadeInUp">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                        {v.vehicleModelId?.name || v.vehicleModelId?.modelName || "Model"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {v.vehicleBrandId?.name || v.vehicleBrandId?.brandName || "Brand"}
                      </p>
                    </div>

                    {/* Serial Number and Type */}
                    <div className="flex gap-2 mb-4 animate-fadeInUp animation-delay-100">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">Serial</p>
                        <p className="text-sm font-bold text-gray-800">
                          {v.serialNumber}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">Type</p>
                        <span className="inline-block px-2 py-1 bg-linear-to-r from-orange-100 to-red-100 text-red-600 text-xs font-bold rounded-lg hover:from-orange-200 hover:to-red-200 transition-all duration-300">
                          {v.vehicleType}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-4 flex items-center gap-2 p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl animate-fadeInUp animation-delay-200 hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
                      <div className={`w-2.5 h-2.5 rounded-full ${v.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                      <span className={`text-sm font-bold ${v.isActive ? "text-green-600" : "text-gray-600"}`}>
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 animate-fadeInUp animation-delay-300">
                      <button
                        onClick={() => onViewDetails(v._id)}
                        className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        onClick={() => onEdit(v._id)}
                        className="flex-1 bg-linear-to-r from-orange-400 to-red-500 text-white py-2 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="p-2 bg-linear-to-r from-red-400 to-pink-500 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all active:scale-95"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>No vehicles found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {displayView === "table" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-gray-400 py-20">
              <Loader2 className="animate-spin" size={24} /> Loading fleet data...
            </div>
          ) : filteredVehicles.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Photo</th>
                  <th className="px-6 py-4">Vehicle Details</th>
                  <th className="px-6 py-4">Serial Number</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVehicles.map((v: any) => (
                  <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        {v.vehiclePhoto ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${v.vehiclePhoto}`}
                            alt="Vehicle"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as any).src = "https://via.placeholder.com/48?text=N/A"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {v.vehicleModelId?.name || v.vehicleModelId?.modelName || "Model"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {v.vehicleBrandId?.name || v.vehicleBrandId?.brandName || "Brand"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{v.serialNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-linear-to-r from-orange-100 to-red-100 text-red-600 text-xs font-bold rounded-full uppercase">
                        {v.vehicleType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${v.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                        <span className={`text-xs font-bold ${v.isActive ? "text-green-600" : "text-gray-600"}`}>
                          {v.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(v._id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(v._id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all"
                          title="Edit Vehicle"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-linear-to-r hover:from-red-500 hover:to-pink-600 rounded-lg transition-all"
                          title="Delete Vehicle"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>No vehicles found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}