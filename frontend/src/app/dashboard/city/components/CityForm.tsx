"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, MapPin } from "lucide-react";

interface Props {
    editingData: any | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const CityForm = ({ editingData, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [countries, setCountries] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        countryId: "",
        cityName: "",
        isActive: true,
        isDefault: false,
    });

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        // Countries fetch karein dropdown ke liye
        const fetchCountries = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${BASE_URL}/country`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCountries(res.data.data || []);
            } catch (err) { console.error("Country fetch error", err); }
        };
        fetchCountries();

        if (editingData) {
            setFormData({
                countryId: typeof editingData.countryId === 'object' ? editingData.countryId._id : editingData.countryId,
                cityName: editingData.cityName,
                isActive: editingData.isActive,
                isDefault: editingData.isDefault,
            });
        }
    }, [editingData, BASE_URL]);

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
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: themeColor }}>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MapPin size={24} /> {editingData ? "Edit City" : "Add New City"}
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Country *</label>
                        <select
                            required
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2"
                            style={{ borderColor: '#e5e7eb' }}
                            value={formData.countryId}
                            onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                        >
                            <option value="">Select Country</option>
                            {countries.map((c: any) => (
                                <option key={c._id} value={c._id}>{c.countryName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">City Name *</label>
                        <input
                            required
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2"
                            style={{ borderColor: '#e5e7eb' }}
                            value={formData.cityName}
                            onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
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
                        <Save size={20} /> {editingData ? "Update City" : "Save City"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CityForm;