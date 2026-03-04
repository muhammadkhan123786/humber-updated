"use client";
import { useState } from "react";
import { Package, Plus, Minus, Wrench, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Part {
  _id: string;
  partId: string;
  partName: string;
  quantity: number;
  installedQuantity: number;
  installationStatus: string;
}

interface InstallPartsProps {
  activityId: string;
  parts: Part[];
  onInstallSuccess: () => void;
}

const InstallParts = ({ activityId, parts, onInstallSuccess }: InstallPartsProps) => {
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: number }>({});
  const [isInstalling, setIsInstalling] = useState(false);

  // Filter parts that can be installed (not fully installed)
  const installableParts = parts.filter(
    (part) => part.installedQuantity < part.quantity
  );

  const handleQuantityChange = (partId: string, change: number) => {
    const part = parts.find((p) => p.partId === partId);
    if (!part) return;

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

  const getTotalSelectedQuantity = () => {
    return Object.values(selectedParts).reduce((sum, qty) => sum + qty, 0);
  };

  const handleInstallParts = async () => {
    if (Object.keys(selectedParts).length === 0) {
      toast.error("Please select at least one part to install");
      return;
    }

    try {
      setIsInstalling(true);
      const token = localStorage.getItem("token");

      const partsUsed = Object.entries(selectedParts).map(([partId, quantity]) => ({
        partId,
        quantity,
      }));

      const response = await axios.post(
        `${BASE_URL}/technician-work/install-parts`,
        {
          activityId,
          partsUsed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Parts installed successfully!");
        setSelectedParts({});
        onInstallSuccess();
      }
    } catch (err: any) {
      console.error("Error installing parts:", err);
      toast.error(err.response?.data?.message || "Failed to install parts");
    } finally {
      setIsInstalling(false);
    }
  };

  if (installableParts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-md">
        <div className="text-center">
          <Package className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-semibold">All parts are already installed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-xl p-5 border border-emerald-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wrench className="text-emerald-600" size={24} />
          <h3 className="text-lg font-bold text-gray-800">Install Parts</h3>
        </div>
        {getTotalSelectedQuantity() > 0 && (
          <span className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full animate-pulse">
            {getTotalSelectedQuantity()} Selected
          </span>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {installableParts.map((part) => {
          const availableQuantity = part.quantity - part.installedQuantity;
          const selectedQuantity = selectedParts[part.partId] || 0;

          return (
            <div
              key={part._id}
              className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-800">{part.partName}</h4>
                  <p className="text-xs text-gray-500">
                    Available: {availableQuantity} (Total: {part.quantity})
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-semibold">Select Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(part.partId, -1)}
                    disabled={selectedQuantity === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="text-xl font-black text-gray-800 min-w-[40px] text-center">
                    {selectedQuantity}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(part.partId, 1)}
                    disabled={selectedQuantity >= availableQuantity}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Install Button */}
      <button
        onClick={handleInstallParts}
        disabled={isInstalling || getTotalSelectedQuantity() === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isInstalling ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Installing...
          </>
        ) : (
          <>
            <Wrench size={20} />
            Install Selected Parts ({getTotalSelectedQuantity()})
          </>
        )}
      </button>
    </div>
  );
};

export default InstallParts;
