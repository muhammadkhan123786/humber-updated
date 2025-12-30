"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";
import { IVehicleModel, ModelFormData } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface Props {
    editingModel: IVehicleModel | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const ModalForm = ({ editingModel, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [brands, setBrands] = useState<{_id: string, brandName: string}[]>([]);
    const [formData, setFormData] = useState<ModelFormData>({
        brandId: "",
        modelName: "",
        isActive: true,
        isDefault: false,
    });

    useEffect(() => {
        // Fetch Brands for Dropdown
        const fetchBrands = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${BASE_URL}/vehiclebrand`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) setBrands(res.data.data);
            } catch (err) { console.error("Error fetching brands", err); }
        };
        fetchBrands();

        if (editingModel) {
            setFormData({
                brandId: typeof editingModel.brandId === 'object' ? editingModel.brandId._id : editingModel.brandId,
                modelName: editingModel.modelName,
                isActive: editingModel.isActive,
                isDefault: editingModel.isDefault,
            });
        }
    }, [editingModel]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const base64Url = token!.split('.')[1];
            const payloadData = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
            
            const payload = { ...formData, userId: payloadData.userId };

            if (editingModel) {
                await axios.put(`${apiUrl}/${editingModel._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(apiUrl, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            onRefresh();
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: themeColor }}>
                    <h2 className="text-xl font-bold">{editingModel ? "📝 Edit Model" : "✨ Add New Model"}</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Select Brand *</label>
                        <select 
                            required
                            className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                            value={formData.brandId}
                            onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                        >
                            <option value="">Choose a Brand</option>
                            {brands.map(b => <option key={b._id} value={b._id}>{b.brandName}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Model Name *</label>
                        <input
                            required
                            className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                            value={formData.modelName}
                            onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                            <span>Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
                            <span>Default</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full text-white py-4 rounded-xl font-bold" style={{ backgroundColor: themeColor }}>
                        <Save size={20} className="inline mr-2" /> {editingModel ? "Update" : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ModalForm;