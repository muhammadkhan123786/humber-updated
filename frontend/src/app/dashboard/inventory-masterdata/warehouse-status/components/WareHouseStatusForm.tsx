"use client";

import React, { useState } from "react";
import { Save, Box } from "lucide-react";
import { IWarehouseStatus } from "../../../../../../../common/IWarehouse.status.interface";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import {
  createWarehouseStatus,
  updateWarehouseStatus,
} from "@/hooks/useWareHouse.Status";
import axios from "axios";

interface Props {
  editingData: IWarehouseStatus | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const WareHouseForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
}: Props) => {
  const [formData, setFormData] = useState({
    wareHouseStatus: editingData?.wareHouseStatus || "",
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
        await updateWarehouseStatus(editingData._id, payload);
      } else {
        await createWarehouseStatus(payload);
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
      title={editingData ? "Edit Warehouse Status" : "Add Warehouse Status"}
      icon={<Box size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Warehouse Status Name"
          placeholder="e.g. Available, Out of Stock, Reserved"
          value={formData.wareHouseStatus}
          onChange={(e) =>
            setFormData({ ...formData, wareHouseStatus: e.target.value })
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
          <Save size={20} />
          {editingData ? "Update Status" : "Save Status"}
        </button>
      </form>
    </FormModal>
  );
};

export default WareHouseForm;
