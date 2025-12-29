"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";

interface Props {
    editingData: any | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SubServicesForm = ({ editingData, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [masterServices, setMasterServices] = useState([]);
    const [formData, setFormData] = useState({
        masterServiceId: "",
        subServiceName: "",
        cost: 0,
        notes: "",
        isActive: true,
        isDefault: false,
    });

    useEffect(() => {
        // Fetch Master Services for Dropdown
       const fetchMaster = async () => {
    try {
        const token = localStorage.getItem("token");
        // Hardcoded URL ki jagah dynamic URL:
        const res = await axios.get(`${BASE_URL}/service-types-master`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMasterServices(res.data.data || []);
    } catch (err) { 
        console.error("Master fetch error", err); 
    }
};
        fetchMaster();

        if (editingData) {
            setFormData({
                masterServiceId: typeof editingData.masterServiceId === 'object' ? editingData.masterServiceId._id : editingData.masterServiceId,
                subServiceName: editingData.subServiceName,
                cost: editingData.cost || 0,
                notes: editingData.notes || "",
                isActive: editingData.isActive,
                isDefault: editingData.isDefault,
            });
        }
    }, [editingData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const payload = { ...formData, userId: savedUser.id || savedUser._id };

            if (editingData) {
                await axios.put(`${apiUrl}/${editingData._id}`, payload, {
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
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: themeColor }}>
                    <h2 className="text-xl font-bold">{editingData ? "📝 Edit Sub-Service" : "✨ Add Sub-Service"}</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Master Service Type *</label>
                        <select
                            required
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2"
                            style={{ borderColor: '#e5e7eb' }}
                            value={formData.masterServiceId}
                            onChange={(e) => setFormData({ ...formData, masterServiceId: e.target.value })}
                        >
                            <option value="">Select a Category</option>
                            {masterServices.map((m: any) => (
                                <option key={m._id} value={m._id}>{m.MasterServiceType}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Sub-Service Name *</label>
                            <input
                                required
                                className="w-full border rounded-xl p-3 outline-none focus:ring-2"
                                value={formData.subServiceName}
                                onChange={(e) => setFormData({ ...formData, subServiceName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Estimated Cost</label>
                            <input
                                type="number"
                                className="w-full border rounded-xl p-3 outline-none focus:ring-2"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Notes / Details</label>
                        <textarea
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 h-24 resize-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

                    <button type="submit" className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2" style={{ backgroundColor: themeColor }}>
                        <Save size={20} /> {editingData ? "Update Sub-Service" : "Save Sub-Service"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubServicesForm;