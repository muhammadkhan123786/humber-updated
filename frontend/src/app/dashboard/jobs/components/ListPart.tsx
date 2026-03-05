"use client";
import { useState, useEffect } from "react";
import { Package, Loader2, CheckCircle, Clock, Wrench, Plus, Minus } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

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
  activityId: string;
  refreshKey?: number;
  onPartsUpdate?: () => void;
}

const ListPart = ({ quotationId, activityId, refreshKey, onPartsUpdate }: ListPartProps) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: number }>({});
  const [installingParts, setInstallingParts] = useState<{ [key: string]: boolean }>({});

  const fetchParts = async () => {
      if (!quotationId) {
        setError("Quotation ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required");
          toast.error("Please login to view parts");
          return;
        }

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
        } else {
          const errorMsg = response.data.message || "Failed to fetch parts";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err: any) {
        console.error("Error fetching parts:", err);
        
        let errorMessage = "Failed to fetch parts";
        
        // Handle different error scenarios
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data?.message;
          
          if (status === 401) {
            errorMessage = "Session expired. Please login again.";
          } else if (status === 403) {
            errorMessage = "You don't have permission to view parts.";
          } else if (status === 404) {
            errorMessage = "Quotation not found.";
          } else if (status === 400) {
            errorMessage = message || "Invalid quotation ID.";
          } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = message || "Failed to load parts.";
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = "An unexpected error occurred.";
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchParts();
  }, [quotationId, refreshKey]);

  const handleQuantityChange = (partId: string, part: Part, change: number) => {
    const currentQuantity = selectedParts[partId] || 0;
    const maxAvailable = part.quantity - part.installedQuantity;
    const newQuantity = Math.max(0, Math.min(maxAvailable, currentQuantity + change));

    if (newQuantity === 0) {
      const { [partId]: _, ...rest } = selectedParts;
      setSelectedParts(rest);
    } else {
      setSelectedParts({ ...selectedParts, [partId]: newQuantity });
    }
  };

  const handleInstallPart = async (partId: string) => {
    const quantity = selectedParts[partId];
    
    if (!quantity || quantity === 0) {
      toast.error("Please select quantity to install");
      return;
    }

    try {
      setInstallingParts({ ...installingParts, [partId]: true });
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/technician-work/install-parts`,
        {
          activityId,
          partsUsed: [{ partId, quantity }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Part installed successfully!");
        
        // Update the part locally instead of refetching
        setParts(prevParts => 
          prevParts.map(p => {
            if (p.partId === partId) {
              const newInstalledQuantity = p.installedQuantity + quantity;
              const newStatus = newInstalledQuantity >= p.quantity ? 'COMPLETED' : 
                               newInstalledQuantity > 0 ? 'PARTIAL' : 'PENDING';
              
              return {
                ...p,
                installedQuantity: newInstalledQuantity,
                installationStatus: newStatus,
                installedAt: new Date().toISOString()
              };
            }
            return p;
          })
        );
        
        // Clear selection for this part
        const { [partId]: _, ...rest } = selectedParts;
        setSelectedParts(rest);
        
        // Notify parent component if needed
        if (onPartsUpdate) {
          onPartsUpdate();
        }
      } else {
        toast.error(response.data.message || "Failed to install part");
      }
    } catch (err: any) {
      console.error("Error installing part:", err);
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        
        if (message && message.toLowerCase().includes("activity is not active")) {
          toast.error("Please start the activity first before installing parts.");
        } else if (message && message.toLowerCase().includes("not authorized")) {
          toast.error("You are not authorized to install parts for this activity.");
        } else if (status === 401) {
          toast.error("Session expired. Please login again.");
        } else if (status === 403) {
          toast.error("You don't have permission to install parts.");
        } else if (status === 404) {
          toast.error("Activity or parts not found.");
        } else if (status === 400) {
          toast.error(message || "Invalid request. Please check your selection.");
        } else if (status >= 500) {
          toast.error(message || "Server error. Please try again later.");
        } else {
          toast.error(message || "Failed to install part. Please try again.");
        }
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setInstallingParts({ ...installingParts, [partId]: false });
    }
  };

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

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100">
          {parts.map((part) => {
            const availableQuantity = part.quantity - part.installedQuantity;
            const selectedQuantity = selectedParts[part.partId] || 0;
            const isInstalling = installingParts[part.partId] || false;
            
            return (
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
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-200 mb-3">
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">Discount:</span> {part.discount}%
                  </p>
                </div>
              )}

              {part.installedAt && (
                <div className="mb-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Installed on:</span>{" "}
                    {new Date(part.installedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Quantity Selection and Install Button - Only show if not fully installed */}
              {availableQuantity > 0 && (
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600 font-semibold">Install:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(part.partId, part, -1)}
                      disabled={selectedQuantity === 0 || isInstalling}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="text-lg font-black text-gray-800 min-w-8 text-center">
                      {selectedQuantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange(part.partId, part, 1)}
                      disabled={selectedQuantity >= availableQuantity || isInstalling}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      onClick={() => handleInstallPart(part.partId)}
                      disabled={selectedQuantity === 0 || isInstalling}
                      className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isInstalling ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Installing...
                        </>
                      ) : (
                        <>
                          <Wrench size={14} />
                          Install
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )})}
        </div>
    </div>
  );
};

export default ListPart;
