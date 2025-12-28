"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";
import { IServiceType, ServiceFormData } from "../types";

interface Props {
    editingService: IServiceType | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const ServicesForm = ({ editingService, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [formData, setFormData] = useState<ServiceFormData>({
        MasterServiceType: "",
        description: "",
        isActive: true,
        isDefault: false,
    });

    useEffect(() => {
        if (editingService) {
            setFormData({
                MasterServiceType: editingService.MasterServiceType,
                description: editingService.description || "",
                isActive: editingService.isActive,
                isDefault: editingService.isDefault,
            });
        }
    }, [editingService]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const base64Url = token!.split('.')[1];
            const payloadData = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
            
            const payload = { ...formData, userId: payloadData.userId };

            if (editingService) {
                await axios.put(`${apiUrl}/${editingService._id}`, payload, {
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
                    <h2 className="text-xl font-bold">{editingService ? "📝 Edit Service" : "✨ Add Service Type"}</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Service Type Name *</label>
                        <input
                            required
                            placeholder="e.g. Oil Change, Tire Rotation"
                            className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                            value={formData.MasterServiceType}
                            onChange={(e) => setFormData({ ...formData, MasterServiceType: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            placeholder="Brief description of the service..."
                            className="w-full border rounded-xl p-3 outline-none focus:border-orange-500 h-24 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                            <span className="text-sm font-medium">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
                            <span className="text-sm font-medium">Default</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full text-white py-4 rounded-xl font-bold" style={{ backgroundColor: themeColor }}>
                        <Save size={20} className="inline mr-2" /> {editingService ? "Update Service" : "Save Service"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ServicesForm;