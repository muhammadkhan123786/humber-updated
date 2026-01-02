"use client";

import React, { useState } from "react";
import axios from "axios";
import { X, Save, Receipt } from "lucide-react";
import { ITax } from "../../../../../../../common/ITax.interface";

interface Props {
  editingData: ITax | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl: string;
}
interface TaxFormState {
  taxName: string;
  percentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isDefault: boolean;
}
const TaxForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
  apiUrl,
}: Props) => {
  const [formData, setFormData] = useState<TaxFormState>(() => ({
    taxName: editingData?.taxName || "",
    percentage: editingData?.percentage || 0,
    startDate: editingData?.startDate
      ? new Date(editingData.startDate).toISOString().split("T")[0]
      : "",
    endDate: editingData?.endDate
      ? new Date(editingData.endDate).toISOString().split("T")[0]
      : "",
    isActive: editingData?.isActive ?? true,
    isDefault: editingData?.isDefault ?? false,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        ...formData,
        userId: savedUser.id || savedUser._id,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      };

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
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Operation failed";
      alert(msg || "Operation failed");
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
            <Receipt size={24} />
            {editingData ? "Edit Tax" : "Add New Tax"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Tax Name *
            </label>
            <input
              required
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 border-gray-200"
              value={formData.taxName}
              onChange={(e) =>
                setFormData({ ...formData, taxName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Percentage (%) *
            </label>
            <input
              required
              type="number"
              step="0.01"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 border-gray-200"
              value={formData.percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  percentage: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 border-gray-200"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                End Date
              </label>
              <input
                type="date"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 border-gray-200"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FE6B1D]"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FE6B1D]"
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
            <Save size={20} /> {editingData ? "Update Tax" : "Save Tax"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaxForm;
