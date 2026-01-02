import React from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const FormToggle = ({ label, checked, onChange }: Props) => (
  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-4 rounded-xl flex-1 transition-colors">
    <input 
      type="checkbox" 
      className="w-5 h-5 accent-[#FE6B1D] cursor-pointer" 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)} 
    />
    <span className="text-sm font-semibold text-gray-700 select-none">
      {label}
    </span>
  </label>
);