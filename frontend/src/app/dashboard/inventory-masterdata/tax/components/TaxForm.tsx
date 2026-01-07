"use client";
import React, { useState } from "react";
import { Save, Receipt } from "lucide-react";
import { ITax } from "../../../../../../../common/ITax.interface";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import { createTax, updateTax } from "@/hooks/useTax";
import axios from "axios";

interface Props {
  editingData: ITax | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl?: string;
}

interface TaxFormState {
  taxName: string;
  percentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isDefault: boolean;
}

const TaxForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
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

  const [dateError, setDateError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous error
    setDateError("");

    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        setDateError("End Date cannot be before Start Date.");
        return;
      }
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        ...formData,
        userId: savedUser.id || savedUser._id,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      };
      if (editingData && editingData._id) {
        await updateTax(editingData._id, payload);
      } else {
        await createTax(payload);
      }
      onRefresh();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Operation failed");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Operation failed");
      }
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Tax" : "Add New Tax"}
      icon={<Receipt size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Tax Name"
          value={formData.taxName}
          onChange={(e) =>
            setFormData({ ...formData, taxName: e.target.value })
          }
          required
        />
        <FormInput
          label="Percentage (%)"
          type="number"
          step="0.01"
          value={formData.percentage}
          onChange={(e) =>
            setFormData({
              ...formData,
              percentage: parseFloat(e.target.value) || 0,
            })
          }
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <FormInput
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </div>
        {dateError && <p className="text-red-500 text-sm">{dateError}</p>}{" "}
        {/* <-- show error */}
        <div className="flex gap-4">
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
          {editingData ? "Update Tax" : "Save Tax"}
        </button>
      </form>
    </FormModal>
  );
};

export default TaxForm;
