import React from "react";
import { ChevronDown } from "lucide-react";

interface OptionObject {
  label: string;
  value: string | number;
}

interface FormFieldProps {
  label: string;
  name?: string;
  value?: any;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  type?: "text" | "email" | "number" | "date" | "select" | "textarea";
  placeholder?: string;
  options?: (string | OptionObject)[];
  defaultValue?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean; // 👈 Add this to fix the TypeScript error
   min?: string;   // ✅ ADD THIS
  max?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  options,
  defaultValue,
  className = "",
  required = false,
  multiple = false,
 min,
  max,
}) => {
  const commonProps = {
    name,
    value,
    onChange,
    placeholder,
    required,
     min,
  max,
    className:
      "w-full bg-white border border-[#d0d5dd] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 transition-all",
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[14px] font-medium text-[#475467]">{label}</label>
      <div className="relative">
        {type === "select" ? (
          <>
            <select
              {...commonProps}
              multiple={multiple} // 👈 Pass it to the select element
              // If multiple is true, we remove 'appearance-none' so user can see it's a list
              className={`${commonProps.className} ${!multiple ? "appearance-none pr-10" : "min-h-[120px]"} cursor-pointer`}
            >
              {!multiple && (
                <option value="" disabled>
                  Select an option
                </option>
              )}
              {options?.map((opt) => {
                const optValue = typeof opt === "string" ? opt : opt.value;
                const optLabel = typeof opt === "string" ? opt : opt.label;
                return (
                  <option key={optValue} value={optValue} className="py-1">
                    {optLabel}
                  </option>
                );
              })}
            </select>

            {/* Only show the Chevron icon if it's a single select */}
            {!multiple && (
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
                size={18}
              />
            )}
          </>
        ) : type === "textarea" ? (
          <textarea
            {...(commonProps as any)}
            className={`${commonProps.className} min-h-[120px] py-3 resize-none`}
          />
        ) : (
          <input {...commonProps} type={type} defaultValue={defaultValue} />
        )}
      </div>
    </div>
  );
};

export default FormField;
