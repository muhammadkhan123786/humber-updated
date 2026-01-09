"use client";
import React from "react";

interface Props {
  label: string;
  checked: boolean | undefined;
  onChange: (val: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export const FormToggle = ({ label, checked, onChange, description,disabled }: Props) => (
  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-4 rounded-xl flex-1 transition-colors">
    <input
      type="checkbox"
      className={`w-5 h-5 accent-[#FE6B1D] ${disabled ? "" : "cursor-pointer"}`}
      checked={checked}
      onChange={(e) => !disabled && onChange(e.target.checked)} // Disabled ho to change na ho
      disabled={disabled}
    />
    <span className="text-sm font-semibold text-gray-700 select-none">
      {label}{" "}
      {disabled && checked && (
        <span className="text-[10px] text-orange-500 ml-1"></span>
      )}
    </span>
    {description && <p>{description}</p>}
  </label>
);
