"use client";
import React, { useState } from "react";
import axios from "axios";
import { X, Save, ClipboardList } from "lucide-react";
import { IOrderStatus } from "../../../../../../../common/order.status.interface";

interface Props {
  editingData: IOrderStatus | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl: string;
}

const OrderStatusForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
  apiUrl,
}: Props) => {
  // Initialize state directly from editingData (or default for new)
  const [formData, setFormData] = useState<
    Pick<IOrderStatus, "orderStatus" | "isActive" | "isDefault">
  >(() => ({
    orderStatus: editingData?.orderStatus || "",
    isActive: editingData?.isActive ?? true,
    isDefault: editingData?.isDefault ?? false,
  }));

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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Operation failed");
      } else {
        alert("Operation failed");
      }
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
            <ClipboardList size={24} />{" "}
            {editingData ? "Edit Order Status" : "Add Order Status"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Status Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Status Name *
            </label>
            <input
              required
              placeholder="e.g. Pending, Shipped, Delivered"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all border-gray-200"
              value={formData.orderStatus}
              onChange={(e) =>
                setFormData({ ...formData, orderStatus: e.target.value })
              }
            />
          </div>

          {/* Status Switches */}
          <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className={`w-5 h-5 ${formData.isDefault ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}

                disabled={formData.isDefault}
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
              <span className="text-sm font-medium">Set Default</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ backgroundColor: themeColor }}
          >
            <Save size={20} /> {editingData ? "Update Status" : "Save Status"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderStatusForm;
