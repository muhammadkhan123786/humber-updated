"use client";

import React, { useState } from "react";
import { Save, Palette } from "lucide-react";
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
        <FormInput
          label="Color Name"
          placeholder="e.g. Royal Blue"
          value={formData.colorName}
          onChange={(e) =>
            setFormData({ ...formData, colorName: e.target.value })
          }
          required
        />
        <div className="flex gap-6">
          <FormToggle
            label="Active"
            checked={formData.isActive}
            onChange={(val) => setFormData({ ...formData, isActive: val })}
          />
          <FormToggle
            label="Default"
            checked={formData.isDefault}
            onChange={(val) => setFormData({ ...formData, isDefault: val })}
          />
        </div>
        <button
          type="submit"
          className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
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
