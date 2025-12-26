import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";
import { IVehicleBrand, BrandFormData } from "../types";

interface Props {
    editingBrand: IVehicleBrand | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const BrandForm = ({ editingBrand, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [formData, setFormData] = useState<BrandFormData>({
        brandName: "",
        isActive: true,
        isDefault: false,
        order: 0,
    });

    useEffect(() => {
        if (editingBrand) {
            setFormData({
                brandName: editingBrand.brandName,
                isActive: editingBrand.isActive,
                isDefault: editingBrand.isDefault,
                order: editingBrand.order || 0,
            });
        }
    }, [editingBrand]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Session expired. Please login again.");
                return;
            }

            // 1. Token Decode logic (userId nikalne ke liye)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payloadData = JSON.parse(window.atob(base64));
            const userId = payloadData.userId; // Aapke console ke mutabiq

            if (!userId) {
                alert("User context missing. Please login again.");
                return;
            }

            // 2. Payload prepare karein
            const payload = {
                brandName: formData.brandName,
                isDefault: formData.isDefault,
                isActive: formData.isActive,
                userId: userId, // Backend controller requirement
            };

            let response;

            if (editingBrand) {
                // --- UPDATE LOGIC ---
                // Aapka backend brandId params mein mang raha hai: /api/vehiclebrand/:brandId
                response = await axios.put(`${apiUrl}/${editingBrand._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // --- CREATE LOGIC ---
                response = await axios.post(apiUrl, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.status === 200 || response.status === 201) {
                onRefresh(); // Table refresh karein
                onClose();   // Modal band karein
            }
        } catch (err: any) {
            console.error("Form Submission Error:", err.response?.data);
            const errorMsg = err.response?.data?.message || "Operation failed";
            alert(errorMsg);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: themeColor }}>
                    <h2 className="text-xl font-bold">{editingBrand ? "📝 Edit Brand" : "✨ Add New Brand"}</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name *</label>
                        <input
                            required
                            placeholder="e.g. Toyota, Honda..."
                            className="w-full border rounded-xl p-3 focus:ring-2 outline-none transition-all border-gray-200 focus:border-orange-500"
                            value={formData.brandName}
                            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-orange-500 cursor-pointer"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black">Active</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-orange-500 cursor-pointer"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black">Set Default</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                        style={{ backgroundColor: themeColor }}
                    >
                        <Save size={20} /> {editingBrand ? "Update Changes" : "Save Brand"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BrandForm;