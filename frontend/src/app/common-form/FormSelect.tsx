import React from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            {...props}
            className={`w-full p-3 rounded-xl border bg-white transition-all outline-none appearance-none cursor-pointer pr-10 ${className} ${
              error
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
            }`}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && <span className="text-red-500 text-xs ml-1">{error}</span>}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
