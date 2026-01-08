"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";
import { IRepairStatus, RepairStatusFormData } from "../types";

interface Props {
    editingStatus: IRepairStatus | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const RepairForm = ({ editingStatus, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [formData, setFormData] = useState<RepairStatusFormData>({
        repairStatus: "",
        isActive: true,
        isDefault: false,
    });

    useEffect(() => {
        if (editingStatus) {
            setFormData({
                repairStatus: editingStatus.repairStatus,
                isActive: editingStatus.isActive,
                isDefault: editingStatus.isDefault,
            });
        }
    }, [editingStatus]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const base64Url = token!.split('.')[1];
            const payloadData = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
            
            const payload = { ...formData, userId: payloadData.userId };

            if (editingStatus) {
                await axios.put(`${apiUrl}/${editingStatus._id}`, payload, {
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
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: themeColor }}>
                    <h2 className="text-xl font-bold">{editingStatus ? "📝 Edit Status" : "✨ Add Repair Status"}</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status Name *</label>
                        <input
                            required
                            placeholder="e.g. Pending, In Progress, Completed..."
                            className="w-full border rounded-xl p-3 focus:ring-2 outline-none transition-all border-gray-200 focus:border-orange-500"
                            value={formData.repairStatus}
                            onChange={(e) => setFormData({ ...formData, repairStatus: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox"  className={`w-5 h-5 ${formData.isDefault ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} checked={formData.isActive} disabled={formData.isDefault} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={formData.isDefault}  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
                            <span className="text-sm font-medium text-gray-700">Default</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all" style={{ backgroundColor: themeColor }}>
                        <Save size={20} /> {editingStatus ? "Update Status" : "Save Status"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RepairForm;