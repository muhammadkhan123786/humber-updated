"use client";

import React, { useState } from "react";
import { Save, Ruler } from "lucide-react";
import { ISize } from "../../../../../../../common/ISize.interface";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import { createSize, updateSize } from "@/hooks/useSize";
import axios from "axios";

interface Props {
  editingData: ISize | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const SizeForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [formData, setFormData] = useState({
    size: editingData?.size || "",
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
        await updateSize(editingData._id, payload);
      } else {
        await createSize(payload);
      }
      onRefresh();
      onClose();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Operation failed";
      alert(msg);
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Size" : "Add New Size"}
      icon={<Ruler size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Size (e.g., XL, 42, 10-inch)"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
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
          {editingData ? "Update Size" : "Save Size"}
        </button>
      </form>
    </FormModal>
  );
};

export default SizeForm;
