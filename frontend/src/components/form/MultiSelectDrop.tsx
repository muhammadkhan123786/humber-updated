"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string | string[];
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      multiple,
      placeholder = "Select...",
      className = "",
      disabled = false,
      error,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 2. Logic to determine what to display in the button
    // const getDisplayLabel = () => {
    //   if (multiple && Array.isArray(value)) {
    //     if (value.length === 0) return placeholder;
    //     return `${value.length} selected`; // Or map to labels
    //   }
    //   const selectedOption = options.find((opt) => opt.value === value);
    //   return selectedOption ? selectedOption.label : placeholder;
    // };

const getDisplayLabel = () => {
  if (multiple && Array.isArray(value)) {
    if (value.length === 0) return placeholder;

    // Filter options to find those that match the selected values, then extract their labels
    const selectedLabels = options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label);

    return selectedLabels.join(', ');
  }

  // Fallback for single select mode
  const selectedOption = options.find((opt) => opt.value === value);
  return selectedOption ? selectedOption.label : placeholder;
};
    
    // 3. Handle Selection logic
    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue) // Remove if exists
          : [...currentValues, optionValue]; // Add if not exists
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };

    const isSelected = (optionValue: string) => {
      return multiple && Array.isArray(value)
        ? value.includes(optionValue)
        : value === optionValue;
    };

    // ... (Keep your useEffect for clicking outside)

    return (
      <div ref={ref} className={`relative ${className}`}>
        {label && (
          <label className="block text-sm font-medium mb-2">{label}</label>
        )}

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg ${
              error ? "border-red-500" : "border-gray-200"
            }`}
          >
            <span className="truncate">{getDisplayLabel()}</span>
            <ChevronDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${
                    isSelected(option.value)
                      ? "bg-orange-50 text-orange-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected(option.value) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;