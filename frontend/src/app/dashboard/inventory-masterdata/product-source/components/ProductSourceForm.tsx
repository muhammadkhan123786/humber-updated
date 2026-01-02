"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Database } from "lucide-react";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormModal } from "@/app/common-form/FormModal";
import { IProductSource } from "../../../../../../../common/IProduct.source.interface";

export default function ProductSourceForm({ editingData, onClose, onRefresh, themeColor, apiUrl }: any) {
    const [formData, setFormData] = useState<Partial<IProductSource>>({
        productSource: "",
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
        } catch (err: any) { alert(err.response?.data?.message || "Action failed"); }
    };

    return (
        <FormModal
            title={editingData ? "Edit Source" : "Add Source"}
            icon={<Database size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                    label="Product Source Name"
                    placeholder="e.g. Warehouse, Supplier A"
                    value={formData.productSource || ""}
                    onChange={(e) => setFormData({ ...formData, productSource: e.target.value })}
                    required
                />
                <div className="bg-gray-50">
                    <div className="flex">
                        <div>
                            <FormToggle
                                label="Active"
                                checked={!!formData.isActive}
                                onChange={(val) => setFormData({ ...formData, isActive: val })}
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
                    <Save size={20} /> {editingData ? "Update Source" : "Save Source"}
                </button>
            </form>
        </FormModal>
    );
}