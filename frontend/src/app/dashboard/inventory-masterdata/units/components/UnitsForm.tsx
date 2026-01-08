"use client";
import React, { useState } from "react";
import { Save, Ruler } from "lucide-react";
import { IUnit } from "../../../../../../../common/IUnit.interface";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import { createUnit, updateUnit } from "@/hooks/useUnits";
import axios from "axios";

interface Props {
  editingData: IUnit | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const UnitsForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [formData, setFormData] = useState({
    unitName: editingData?.unitName || "",
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
        await updateUnit(editingData._id, payload);
      } else {
        await createUnit(payload);
      }
      onRefresh();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err))
        alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Unit" : "Add New Unit"}
      icon={<Ruler size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Unit Name (e.g. Kg, Pcs, Liter)"
          value={formData.unitName}
          onChange={(e) =>
            setFormData({ ...formData, unitName: e.target.value })
          }
          required
        />
        <div className="flex gap-4 p-1">
          <FormToggle
            label="Active"
            checked={formData.isActive}
            onChange={(val) => setFormData({ ...formData, isActive: val })}
          />
          <FormToggle
            label="Set as Default"
            checked={formData.isDefault}
            onChange={(val) => setFormData({ ...formData, isDefault: val })}
          />
        </div>
        <button
          type="submit"
          className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={20} /> {editingData ? "Update Unit" : "Save Unit"}
        </button>
      </form>
    </FormModal>
  );
};
export default UnitsForm;
