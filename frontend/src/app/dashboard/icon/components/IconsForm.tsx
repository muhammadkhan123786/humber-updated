"use client";

import React, { useState, useRef } from "react";
import { Image, Save, Upload, X } from "lucide-react";
import { IIcons } from "../../../../../../common/master-interfaces/IIcons.interface";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { createIcon, updateIcon } from "@/hooks/useIcons";

interface Props {
  editingData: IIcons | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const IconsForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [formData, setFormData] = useState({
    iconName: editingData?.iconName || "",
    icon: editingData?.icon || "",
    isActive: editingData?.isActive ?? true,
    isDefault: editingData?.isDefault ?? false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.icon) return alert("Please select an icon file");
    
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { ...formData, userId: savedUser.id || savedUser._id };

    if (editingData?._id) await updateIcon(editingData._id, payload);
    else await createIcon(payload);
    
    onRefresh();
    onClose();
  };

  return (
    <FormModal title={editingData ? "Edit Icon" : "Add New Icon"} icon={<Image size={24} />} onClose={onClose} themeColor={themeColor}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput 
          label="Icon Name" 
          value={formData.iconName} 
          onChange={(e) => setFormData({...formData, iconName: e.target.value})} 
          required 
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Icon File (From Computer)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
          >
            {formData.icon ? (
              <div className="relative group">
                <img src={formData.icon} alt="Preview" className="h-20 w-20 object-contain" />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setFormData({...formData, icon: ""}); }}>
                  <X size={14}/>
                </div>
              </div>
            ) : (
              <>
                <Upload className="text-gray-400 mb-2" size={30} />
                <p className="text-sm text-gray-500">Click to upload icon image</p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="flex gap-6 p-4 bg-blue-50/50 rounded-xl">
          <FormToggle label="Active" checked={formData.isActive} onChange={(val) => setFormData({...formData, isActive: val})} />
          <FormToggle label="Default" checked={formData.isDefault} onChange={(val) => setFormData({...formData, isDefault: val})} />
        </div>

        <button type="submit" className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all" style={{ backgroundColor: themeColor }}>
          <Save size={20} /> {editingData ? "Update Icon" : "Save Icon"}
        </button>
      </form>
    </FormModal>
  );
};

export default IconsForm;