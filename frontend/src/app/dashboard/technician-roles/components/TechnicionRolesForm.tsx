"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, ShieldCheck } from "lucide-react";

interface Props {
  editingData: any | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl: string;
}

const TechnicianRolesForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
  apiUrl,
}: Props) => {
  const [formData, setFormData] = useState({
    technicianRole: "", // Matching backend model key
    isActive: true,
    isDefault: false,
  });

  useEffect(() => {
    if (editingData) {
      setFormData({
        technicianRole: editingData.technicianRole || "",
        isActive: editingData.isActive,
        isDefault: editingData.isDefault,
      });
    }
  }, [editingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <ShieldCheck size={24} />{" "}
            {editingData ? "Edit Role" : "Add Technician Role"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Role Name *
            </label>
            <input
              required
              placeholder="e.g. Senior Mechanic, Electrician"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all"
              style={{ borderColor: "#e5e7eb" }}
              value={formData.technicianRole}
              onChange={(e) =>
                setFormData({ ...formData, technicianRole: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className={`w-5 h-5 ${
                  formData.isDefault
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
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
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
              />
              <span className="text-sm font-medium">Default</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ backgroundColor: themeColor }}
          >
            <Save size={20} /> {editingData ? "Update Role" : "Save Role"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechnicianRolesForm;
