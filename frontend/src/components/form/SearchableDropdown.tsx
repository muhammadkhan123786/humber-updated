import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

/* =======================
   Types & Interfaces
======================= */

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface SearchableDropdownProps {
  value: string | number | null;
  onChange: (event: { target: { value: string | number } }) => void;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

/* =======================
   Component
======================= */

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Search or select...",
  label,
  className = "",
  disabled = false,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* =======================
     Filter Options
  ======================= */

  const filteredOptions = options?.filter((option) =>
    option?.label?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  /* =======================
     Display Selected Label
  ======================= */

  const displayText =
    value !== null
      ? options.find((opt) => opt.value === value)?.label || placeholder
      : placeholder;

  /* =======================
     Close on Outside Click
  ======================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  /* =======================
     Handle Select
  ======================= */

  const handleSelect = (optionValue: string | number) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  /* =======================
     Clear Search & Close
  ======================= */

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setSearchTerm("");
    } else {
      onChange({ target: { value: "" } });
    }
    inputRef.current?.focus();
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Input Trigger */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : displayText}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true);
                setSearchTerm("");
              }
            }}
            placeholder={placeholder}
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
              pr-10
            `}
          />

          {/* Icons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {((isOpen && searchTerm) || (!isOpen && value !== null)) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm
                      transition-colors
                      ${
                        value === option.value
                          ? "bg-orange-50 dark:bg-blue-500/10 text-orange-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                  No results found
                </div>
                
              )}
              
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchableDropdown;