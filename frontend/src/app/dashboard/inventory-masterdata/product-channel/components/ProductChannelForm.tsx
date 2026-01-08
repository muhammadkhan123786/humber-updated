"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, Tv } from "lucide-react";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { IChannel } from "../../../../../../../common/IChannel.interface";

interface FormProps {
    editingData: IChannel | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

export default function ProductChannelForm({ editingData, onClose, onRefresh, themeColor, apiUrl }: FormProps) {
    const [formData, setFormData] = useState<Partial<IChannel>>({
        channelName: "",
        isActive: true,
        isDefault: false,
    });

    useEffect(() => {
        if (editingData) {
            setFormData({
                channelName: editingData.channelName,
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

            if (editingData && (editingData as any)._id) {
                await axios.put(`${apiUrl}/${(editingData as any)._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            onRefresh();
            onClose();
        } catch (err: any) { alert(err.response?.data?.message || "Operation failed"); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: themeColor }}>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Tv size={24} /> {editingData ? "Edit Channel" : "Add Channel"}</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <FormInput
                        label="Channel Name"
                        value={formData.channelName || ""}
                        onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                        required
                    />
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
                    <button type="submit" className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>
                        <Save size={20} /> {editingData ? "Update Channel" : "Save Channel"}
                    </button>
                </form>
            </div>
        </div>
    );
}