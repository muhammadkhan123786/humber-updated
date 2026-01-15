"use client";

import React, { useState } from "react";
import { Save, Palette, Pipette } from "lucide-react";
import { IColor } from "../../../../../../../common/IColor.interface";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import { createColor, updateColor } from "@/hooks/useColors";
import axios from "axios";

interface Props {
  editingData: IColor | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const ColorsForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [formData, setFormData] = useState({
    colorName: editingData?.colorName || "",
    colorCode: editingData?.colorCode || "#FE6B1D", // Default color
    isActive: editingData?.isActive ?? true,
    isDefault: editingData?.isDefault ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        ...formData,
        userId: savedUser.id || savedUser._id,
      };

      if (editingData?._id) {
        await updateColor(editingData._id, payload);
      } else {
        await createColor(payload);
      }
      onRefresh();
      onClose();
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Operation failed";
      alert(errorMsg);
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Color" : "Add New Color"}
      icon={<Palette size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Color Name"
            placeholder="e.g. Royal Blue"
            value={formData.colorName}
            onChange={(e) =>
              setFormData({ ...formData, colorName: e.target.value })
            }
            required
          />

          {/* Color Picker Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Pipette size={16} /> Select Color
            </label>
            <div className="flex items-center gap-3 h-[50px]">
              <input
                type="color"
                value={formData.colorCode}
                onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                className="w-16 h-full p-1 rounded-lg border border-gray-200 cursor-pointer bg-white"
              />
              <input
                type="text"
                value={formData.colorCode}
                onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                className="flex-1 h-full px-3 border border-gray-200 rounded-lg outline-none font-mono uppercase text-sm focus:ring-2 focus:ring-orange-300"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
          <FormToggle
            label="Active Status"
            checked={formData.isActive}
            onChange={(val) => setFormData({ ...formData, isActive: val })}
            disabled={formData.isDefault}
          />
          <FormToggle
            label="Set as Default"
            checked={formData.isDefault}
            onChange={(val) => setFormData({ ...formData, isDefault: val })}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={20} />
          {editingData ? "Update Color" : "Save Color"}
        </button>
      </form>
    </FormModal>
  );
};

export default ColorsForm;