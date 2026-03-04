"use client";
import { useState, useEffect } from "react";
import { Package, Loader2, CheckCircle, Clock, Wrench } from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Part {
  _id: string;
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  installationStatus: string;
  installedAt?: string;
  installedBy?: string;
  installedQuantity: number;
}

interface ListPartProps {
  quotationId: string;
}

const ListPart = ({ quotationId }: ListPartProps) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      if (!quotationId) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/technician-work/get-parts-to-change/${quotationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setParts(response.data.partsAvailableToChange);
        }
      } catch (err: any) {
        console.error("Error fetching parts:", err);
        setError(err.response?.data?.message || "Failed to fetch parts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParts();
  }, [quotationId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "PARTIAL":
        return "bg-gradient-to-r from-orange-500 to-amber-600 text-white";
      case "PENDING":
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle size={16} />;
      case "PARTIAL":
        return <Wrench size={16} />;
      case "PENDING":
        return <Clock size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-linear-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-6 border border-indigo-200 shadow-md">
        <div className="flex flex-col items-center py-8">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="mt-4 text-gray-600 font-semibold">Loading parts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-md">
        <p className="text-red-600 font-semibold text-center">⚠️ {error}</p>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-md">
        <div className="text-center">
          <Package className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-semibold">No parts available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-5 border border-indigo-200 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Package className="text-indigo-600" size={24} />
        <h3 className="text-lg font-bold text-gray-800">Parts for Installation</h3>
        <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {parts.length} {parts.length === 1 ? "Part" : "Parts"}
        </span>
      </div>

      <div className="space-y-3">
        {parts.map((part) => (
          <div
            key={part._id}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-base font-bold text-gray-800 mb-1">{part.partName}</h4>
                <p className="text-xs text-gray-500">Part ID: {part.partId.slice(-6).toUpperCase()}</p>
              </div>
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(
                  part.installationStatus
                )}`}
              >
                {getStatusIcon(part.installationStatus)}
                {part.installationStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                <p className="text-[10px] text-blue-600 font-semibold uppercase mb-1">Quantity</p>
                <p className="text-sm font-bold text-gray-800">{part.quantity}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                <p className="text-[10px] text-purple-600 font-semibold uppercase mb-1">Unit Price</p>
                <p className="text-sm font-bold text-gray-800">${part.unitPrice.toFixed(2)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                <p className="text-[10px] text-green-600 font-semibold uppercase mb-1">Total</p>
                <p className="text-sm font-bold text-gray-800">${part.total.toFixed(2)}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                <p className="text-[10px] text-orange-600 font-semibold uppercase mb-1">Installed</p>
                <p className="text-sm font-bold text-gray-800">
                  {part.installedQuantity}/{part.quantity}
                </p>
              </div>
            </div>

            {part.discount > 0 && (
              <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Discount:</span> {part.discount}%
                </p>
              </div>
            )}

            {part.installedAt && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Installed on:</span>{" "}
                  {new Date(part.installedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListPart;
