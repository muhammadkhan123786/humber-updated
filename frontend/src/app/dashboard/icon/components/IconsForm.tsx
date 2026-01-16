"use client";
import React, { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Save, Upload, X } from "lucide-react";
import { IIcons } from "../../../../../../common/master-interfaces/IIcons.interface";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createIcon, updateIcon } from "@/hooks/useIcons";

interface Props {
  editingData: IIcons | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const IconsForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [formData, setFormData] = useState({
    iconName: "",
    icon: "",
    isActive: true,
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingData) {
      setFormData({
        iconName: editingData.iconName,
        icon: editingData.icon,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, icon: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.icon) return alert("Please select an icon file");
    
    setIsSubmitting(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = { ...formData, userId: savedUser.id || savedUser._id };

      if (editingData?._id) await updateIcon(editingData._id, payload);
      else await createIcon(payload);
      
      onRefresh();
      onClose();
    } catch (error) {
      alert("Error saving icon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal 
      title={editingData ? "Edit Icon" : "Add New Icon"} 
      icon={<ImageIcon size={24} />} 
      onClose={onClose} 
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        <FormInput 
          label="Icon Name *" 
          placeholder="e.g. Shopping Cart"
          value={formData.iconName} 
          onChange={(e) => setFormData({...formData, iconName: e.target.value})} 
          required 
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Icon File (Preview) *</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all bg-gray-50 group"
          >
            {formData.icon ? (
              <div className="relative">
                <img src={formData.icon} alt="Preview" className="h-24 w-24 object-contain" />
                <button 
                  type="button"
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setFormData({...formData, icon: ""}); }}
                >
                  <X size={16}/>
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="text-blue-500" size={32} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Click to upload icon image</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG or JPG (Max 2MB)</p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <FormToggle 
            label="Active" 
            checked={formData.isActive} 
            onChange={(val) => setFormData({...formData, isActive: val})} 
          />
          <FormToggle 
            label="Default" 
            checked={formData.isDefault} 
            onChange={(val) => setFormData({...formData, isDefault: val})} 
          />
        </div>

        <FormButton 
          type="submit" 
          label={editingData ? "Update Icon" : "Create"} 
          icon={<Save size={20} />} 
          loading={isSubmitting}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default IconsForm;