import React from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const FormToggle = ({ label, checked, onChange }: Props) => (
  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1">
    <input 
      type="checkbox" 
      className="w-5 h-5 accent-[#FE6B1D]" 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)} 
    />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);