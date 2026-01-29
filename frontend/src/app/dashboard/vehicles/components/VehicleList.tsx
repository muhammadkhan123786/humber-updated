"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Grid3x3,
  List,
  CheckCircle,
  AlertCircle,
  FileText,
  Zap,
} from "lucide-react";
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
  onViewDetails,
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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      let finalData = [];
      if (res.data && res.data.data) {
        finalData = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];
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

  useEffect(() => {
    let result = vehicles;

    if (searchTerm) {
      result = result.filter(
        (v) =>
          v.vehicleModelId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          v.vehicleModelId?.modelName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          v.vehicleBrandId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          v.vehicleBrandId?.brandName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((v) =>
        filterStatus === "active" ? v.isActive : !v.isActive,
      );
    }

    setFilteredVehicles(result);
  }, [searchTerm, filterStatus, vehicles]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-vehicle-register/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 200 || res.status === 204) {
        alert("Vehicle deleted successfully!");
        setVehicles((prev) => prev.filter((v) => v._id !== id));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const activeVehicles = vehicles.filter((v) => v.isActive).length;
  const inactiveVehicles = vehicles.filter((v) => !v.isActive).length;
  const totalVehicles = vehicles.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-green-400 via-green-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
          <CheckCircle size={32} className="mb-2 opacity-90" />
          <div className="text-4xl font-black">{activeVehicles}</div>
          <p className="text-green-50 text-sm font-bold">Active Vehicles</p>
        </div>
        <div className="bg-linear-to-br from-amber-400 via-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
          <AlertCircle size={32} className="mb-2 opacity-90" />
          <div className="text-4xl font-black">{inactiveVehicles}</div>
          <p className="text-amber-50 text-sm font-bold">Inactive Vehicles</p>
        </div>
        <div className="bg-linear-to-br from-blue-400 via-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
          <Zap size={32} className="mb-2 opacity-90" />
          <div className="text-4xl font-black">{totalVehicles}</div>
          <p className="text-blue-50 text-sm font-bold">Total Fleet</p>
        </div>
        <div className="bg-linear-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
          <FileText size={32} className="mb-2 opacity-90" />
          <div className="text-4xl font-black">{filteredVehicles.length}</div>
          <p className="text-pink-50 text-sm font-bold">Showing Results</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by brand or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setDisplayView("card")}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "card" ? "bg-blue-600 text-white shadow-md" : "text-gray-600"}`}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setDisplayView("table")}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${displayView === "table" ? "bg-blue-600 text-white shadow-md" : "text-gray-600"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Card View */}
      {displayView === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v: any) => (
            <div
              key={v._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="h-48 bg-gray-200 relative">
                {v.vehiclePhoto ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${v.vehiclePhoto}`}
                    alt="Vehicle"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    🚗 No Image
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">
                  {v.vehicleModelId?.name ||
                    v.vehicleModelId?.modelName ||
                    "N/A"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {v.vehicleBrandId?.name ||
                    v.vehicleBrandId?.brandName ||
                    "N/A"}
                </p>

                <div className="flex justify-between items-center mb-5">
                  <span className="px-3 py-1 bg-orange-100 text-red-600 text-xs font-bold rounded-lg uppercase">
                    {v.vehicleType}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${v.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    />
                    <span
                      className={`text-sm font-bold ${v.isActive ? "text-green-600" : "text-gray-600"}`}
                    >
                      {v.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails(v._id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => onEdit(v._id)}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-2 bg-red-500 text-white rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {displayView === "table" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-xs font-bold text-gray-500 uppercase">
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Vehicle Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.map((v: any) => (
                <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={
                          v.vehiclePhoto
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${v.vehiclePhoto}`
                            : "https://via.placeholder.com/48"
                        }
                        alt="Vehicle"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {v.vehicleModelId?.name || v.vehicleModelId?.modelName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {v.vehicleBrandId?.name || v.vehicleBrandId?.brandName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-orange-100 text-red-600 text-xs font-bold rounded-full uppercase">
                      {v.vehicleType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${v.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                      />
                      <span
                        className={`text-xs font-bold ${v.isActive ? "text-green-600" : "text-gray-600"}`}
                      >
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(v._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(v._id)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
