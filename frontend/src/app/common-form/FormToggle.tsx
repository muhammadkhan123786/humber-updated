"use client";
import React from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean; // Naya prop
}

export const FormToggle = ({ label, checked, onChange, disabled }: Props) => (
  <label 
    className={`flex items-center gap-2 p-4 rounded-xl flex-1 transition-all 
      ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : 'cursor-pointer bg-gray-50 hover:bg-gray-100'}`}
  >
    <input 
      type="checkbox" 
      className={`w-5 h-5 accent-[#FE6B1D] ${disabled ? '' : 'cursor-pointer'}`} 
      checked={checked} 
      onChange={(e) => !disabled && onChange(e.target.checked)} // Disabled ho to change na ho
      disabled={disabled}
    />
    <span className="text-sm font-semibold text-gray-700 select-none">
      {label} {disabled && checked && <span className="text-[10px] text-orange-500 ml-1"></span>}
    </span>
  </label>
);