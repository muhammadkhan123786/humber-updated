"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  type?: string;
}

const FormInput: React.FC<InputProps> = ({
  label,
  required,
  icon,
  multiline = false,
  rows = 3,
  error = false,
  value,
  type = "text",
  ...props
}) => {
  const safeValue = value ?? "";

  const baseStyles = `w-full bg-gray-50 border-2 rounded-xl
                      text-gray-800 text-sm outline-none transition-all
                      placeholder:text-gray-400
                      focus:bg-white focus:ring-4 focus:ring-blue-500/10
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${icon ? "pl-11 pr-4" : "px-4"}
                      ${
                        error
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-100 focus:border-blue-500"
                      }`;

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative group">
        {icon && (
          <div
            className={`absolute left-4 transition-colors
              ${multiline ? "top-4" : "top-1/2 -translate-y-1/2"}
              ${error ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}
            `}
          >
            {icon}
          </div>
        )}

        {multiline ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            value={safeValue}
            rows={rows}
            className={`${baseStyles} py-3 resize-none`}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={type}
            value={safeValue}
            className={`${baseStyles} h-9.5 py-2`}
          />
        )}
      </div>
    </div>
  );
};

export default FormInput;
