"use client";
import React, { useState } from "react";
import axios from "axios";
import { X, Save, AlertTriangle, Check } from "lucide-react";

interface Props {
  editingData: any | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl: string;
}

const PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#D946EF",
  "#F43F5E",
  "#64748B",
  "#475569",
];

const PriorityLevelForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
  apiUrl,
}: Props) => {
  const [formData, setFormData] = useState({
    serviceRequestPrioprity: editingData?.serviceRequestPrioprity || "",
    description: editingData?.description || "",

    backgroundColor: editingData?.backgroundColor || "",
    isActive: editingData ? editingData.isActive : true,
    isDefault: editingData ? editingData.isDefault : false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.backgroundColor) {
      alert("Please select a label color.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = { ...formData, userId: savedUser.id || savedUser._id };

      if (editingData) {
        await axios.put(`${apiUrl}/${editingData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(apiUrl, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div
          className="p-6 text-white flex justify-between items-center"
          style={{ backgroundColor: themeColor }}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle size={24} />{" "}
            {editingData ? "Edit Priority" : "Add Priority Level"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Priority Name *
            </label>
            <input
              required
              placeholder="e.g. Urgent, High, Low"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all"
              value={formData.serviceRequestPrioprity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceRequestPrioprity: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Description *
            </label>
            <textarea
              required
              placeholder="Describe the urgency level..."
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all h-20 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Label Color *{" "}
              {!formData.backgroundColor && (
                <span className="text-xs text-red-400 font-normal">
                  (Required)
                </span>
              )}
            </label>
            <div className="grid grid-cols-6 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, backgroundColor: color })
                  }
                  className={`w-10 h-10 rounded-xl border-2 shadow-sm flex items-center justify-center transition-all hover:scale-110 ${
                    formData.backgroundColor === color
                      ? "border-gray-800 scale-110"
                      : "border-white"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {formData.backgroundColor === color && (
                    <Check size={18} className="text-white drop-shadow-md" />
                  )}
                </button>
              ))}
              <div className="relative w-10 h-10">
                <input
                  type="color"
                  value={formData.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className={`w-full h-full rounded-xl border-2 flex items-center justify-center text-xs font-bold ${
                    !PRESET_COLORS.includes(formData.backgroundColor) &&
                    formData.backgroundColor !== ""
                      ? "border-gray-800"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: !PRESET_COLORS.includes(
                      formData.backgroundColor
                    )
                      ? formData.backgroundColor
                      : "#f3f4f6",
                  }}
                >
                  {!PRESET_COLORS.includes(formData.backgroundColor) &&
                  formData.backgroundColor !== "" ? (
                    <Check size={18} className="text-white drop-shadow-md" />
                  ) : (
                    "+"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-orange-500"
                checked={formData.isActive}
                disabled={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-orange-500"
                checked={formData.isDefault}
                onChange={(e) => {
                  const isDef = e.target.checked;
                  setFormData({
                    ...formData,
                    isDefault: isDef,
                    isActive: isDef ? true : formData.isActive,
                  });
                }}
              />
              <span className="text-sm font-medium">Default</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ backgroundColor: themeColor }}
          >
            <Save size={20} />{" "}
            {editingData ? "Update Priority" : "Save Priority"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default PriorityLevelForm;
