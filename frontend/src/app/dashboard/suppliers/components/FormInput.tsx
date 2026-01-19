import React from "react";
import { ChevronDown } from "lucide-react";

interface OptionObject {
  label: string;
  value: string | number;
}
interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "number" | "date" | "select" | "textarea";
  placeholder?: string;
  options?: (string | OptionObject)[];
  defaultValue?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  placeholder,
  options,
  defaultValue,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[14px] font-medium text-[#475467]">{label}</label>
      <div className="relative">
        {type === "select" ? (
          <>
            <select className="form-input-style appearance-none cursor-pointer pr-10">
              {options?.map((opt) => {
                if (typeof opt === "string") {
                  return (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  );
                }
                return (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                );
              })}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
              size={18}
            />
          </>
        ) : type === "textarea" ? (
          <textarea
            className="form-input-style min-h-[120px] py-3 resize-none"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className="form-input-style"
          />
        )}
      </div>
    </div>
  );
};

export default FormField;
