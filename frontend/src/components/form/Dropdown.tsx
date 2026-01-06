// "use client";

// import React, { useState, useRef } from "react";
// import { ChevronDown, Check } from "lucide-react";

// export interface DropdownOption {
//   value: string;
//   label: string;
// }

// export interface DropdownProps {
//   label?: string;
//   options: DropdownOption[];
//   value?: string | string[];
//   multiple?: boolean;
//   onChange?: (value: string | string[]) => void;
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
//   error?: string;
// }

// const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
//   (
//     {
//       label,
//       options,
//       value,
//       onChange,
//       multiple,
//       placeholder = "Select...",
//       className = "",
//       disabled = false,
//       error,
//     },
//     ref
//   ) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     // 2. Logic to determine what to display in the button
//     // const getDisplayLabel = () => {
//     //   if (multiple && Array.isArray(value)) {
//     //     if (value.length === 0) return placeholder;
//     //     return `${value.length} selected`; // Or map to labels
//     //   }
//     //   const selectedOption = options.find((opt) => opt.value === value);
//     //   return selectedOption ? selectedOption.label : placeholder;
//     // };

// const getDisplayLabel = () => {
//   if (multiple && Array.isArray(value)) {
//     if (value.length === 0) return placeholder;

//     // Filter options to find those that match the selected values, then extract their labels
//     const selectedLabels = options
//       .filter((opt) => value.includes(opt.value))
//       .map((opt) => opt.label);

//     return selectedLabels.join(', ');
//   }

//   // Fallback for single select mode
//   const selectedOption = options.find((opt) => opt.value === value);
//   return selectedOption ? selectedOption.label : placeholder;
// };
    
//     // 3. Handle Selection logic
//     const handleSelect = (optionValue: string) => {
//       if (multiple) {
//         const currentValues = Array.isArray(value) ? value : [];
//         const newValues = currentValues.includes(optionValue)
//           ? currentValues.filter((v) => v !== optionValue) // Remove if exists
//           : [...currentValues, optionValue]; // Add if not exists
//         onChange?.(newValues);
//       } else {
//         onChange?.(optionValue);
//         setIsOpen(false);
//       }
//     };

//     const isSelected = (optionValue: string) => {
//       return multiple && Array.isArray(value)
//         ? value.includes(optionValue)
//         : value === optionValue;
//     };

//     // ... (Keep your useEffect for clicking outside)

//     return (
//       <div ref={ref} className={`relative ${className}`}>
//         {label && (
//           <label className="block text-sm font-medium mb-2">{label}</label>
//         )}

//         <div ref={dropdownRef} className="relative">
//           <button
//             type="button"
//             onClick={() => !disabled && setIsOpen(!isOpen)}
//             className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg ${
//               error ? "border-red-500" : "border-gray-200"
//             }`}
//           >
//             <span className="truncate">{getDisplayLabel()}</span>
//             <ChevronDown
//               className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//             />
//           </button>

//           {isOpen && (
//             <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
//               {options.map((option) => (
//                 <button
//                   key={option.value}
//                   type="button"
//                   onClick={() => handleSelect(option.value)}
//                   className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${
//                     isSelected(option.value)
//                       ? "bg-orange-50 text-orange-600"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <span>{option.label}</span>
//                   {isSelected(option.value) && <Check className="w-4 h-4" />}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//         {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//       </div>
//     );
//   }
// );

// Dropdown.displayName = "Dropdown";

// export default Dropdown;



'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      placeholder = 'Select...',
      className = '',
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div ref={ref} className={`relative ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}

        <div ref={dropdownRef} className="relative">
          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
              w-full flex items-center justify-between gap-2
              px-4 py-2 text-sm font-medium
              bg-white dark:bg-slate-800
              border border-gray-200 dark:border-slate-700
              rounded-lg shadow-sm
              text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-slate-700
              focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500
              transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm
                      transition-colors
                      ${
                        selectedValue === option.value
                          ? 'bg-orange-50 dark:bg-blue-500/10 text-orange-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;