"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, ClipboardCheck } from "lucide-react";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormModal } from "@/app/common-form/FormModal";
import { IItemsConditions } from "../../../../../../../common/IItems.conditions.interface";

interface FormProps {
    editingData: IItemsConditions | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

export default function ItemConditionForm({ editingData, onClose, onRefresh, themeColor, apiUrl }: FormProps) {
    const [formData, setFormData] = useState<Partial<IItemsConditions>>({
        itemConditionName: "",
        isActive: true,
        isDefault: false,
    });

    useEffect(() => {
        if (editingData) setFormData({ ...editingData });
    }, [editingData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const payload = { ...formData, userId: savedUser.id || savedUser._id };

            if (editingData?._id) {
                await axios.put(`${apiUrl}/${editingData._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            onRefresh();
            onClose();
        } catch (err: any) { alert(err.response?.data?.message || "Operation failed"); }
    };

    return (
        <FormModal
            title={editingData ? "Edit Item Condition" : "Add Item Condition"}
            icon={<ClipboardCheck size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                    label="Condition Name"
                    placeholder="e.g. New, Used, Refurbished"
                    value={formData.itemConditionName || ""}
                    onChange={(e) => setFormData({ ...formData, itemConditionName: e.target.value })}
                    required
                />

                {/* Toggle Section as per your requested structure */}
                <div className="bg-gray-50">
                    <div className="flex">
                        <div>
                            <FormToggle
                                label="Active"
                                checked={!!formData.isActive}
                                onChange={(val) => setFormData({ ...formData, isActive: val })}
                                disabled={formData.isDefault}
                            />

                        </div>
                        <div>
                            <FormToggle
                                label="Default"
                                checked={!!formData.isDefault}
                                onChange={(val) => setFormData({ ...formData, isDefault: val })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                    style={{ backgroundColor: themeColor }}
                >
                    <Save size={20} /> {editingData ? "Update Condition" : "Save Condition"}
                </button>
            </form>
        </FormModal>
    );
}