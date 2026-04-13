"use client";

import React from "react";
import { PhoneInput } from "react-international-phone";


import { Phone, AlertTriangle } from "lucide-react";

// ============================================================
// TYPES
// ============================================================
interface PhoneInputFieldProps {
 
  value: string;
  onChange: (value: string) => void;

  // Optional customization
  label?: string;           // Default: "Phone Number"
  placeholder?: string;     // Default: "Enter phone number"
  defaultCountry?: string;  // Default: "gb"
  showLabel?: boolean;      // Default: true
  showValidation?: boolean; // Default: true
  required?: boolean;       // Default: false
  disabled?: boolean;       // Default: false

  // Style overrides
  containerClassName?: string;
  labelClassName?: string;
  errorMessage?: string;    // Custom error message override
}

// ============================================================
// REUSABLE COMPONENT
// ============================================================
const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  label = "Phone Number",
  placeholder = "Enter phone number",
  defaultCountry = "gb",
  showLabel = true,
  showValidation = true,
  required = false,
  disabled = false,
  containerClassName = "",
  labelClassName = "",
  errorMessage,
}) => {
  const isInvalid = showValidation && value && value.replace(/\D/g, "").length < 7;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {/* Label */}
      {showLabel && (
        <label
          className={`flex items-center gap-2 text-[13px] font-bold text-slate-700 ${labelClassName}`}
        >
          <Phone size={16} className="text-[#3B82F6]" />
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Phone Input */}
      <div style={{ position: "relative", zIndex: 9999 }}>
        <PhoneInput
          defaultCountry={defaultCountry}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}

          // ✅ Container — overflow: visible ZAROORI
          style={{
            display: "flex",
            width: "100%",
            height: "48px",
            borderRadius: "12px",
            border: `3px solid ${isInvalid ? "#FCA5A5" : "#BFDBFE"}`,
            background: disabled ? "#F1F5F9" : "#F0F9FF",
            overflow: "visible",
            position: "relative",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "default",
            transition: "border-color 0.2s",
          }}

          // ✅ Input field
          inputStyle={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            paddingLeft: "12px",
            paddingRight: "12px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#334155",
            outline: "none",
            borderRadius: "0 10px 10px 0",
            cursor: disabled ? "not-allowed" : "text",
          }}

          // ✅ Flag button + FIXED dropdown
          countrySelectorStyleProps={{
            buttonStyle: {
              height: "100%",
              background: disabled ? "#E2E8F0" : "#DBEAFE",
              border: "none",
              borderRight: "2px solid #BFDBFE",
              borderRadius: "10px 0 0 10px",
              padding: "0 10px",
              cursor: disabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: "72px",
              flexShrink: 0,
            },
            // ✅ KEY FIX: position fixed = modal overflow se escape
            dropdownStyleProps: {
              style: {
                position: "fixed",   // overflow-hidden se bahar nikle
                zIndex: 99999,       // modal se upar rahe
                borderRadius: "14px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(59,130,246,0.1)",
                border: "1px solid #DBEAFE",
                background: "white",
                maxHeight: "280px",
                overflowY: "auto",
                overflowX: "hidden",
                minWidth: "300px",
              },
            },
          }}
        />
      </div>

      {/* Validation Error */}
      {isInvalid && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertTriangle size={12} />
          {errorMessage || "Please enter a valid phone number"}
        </p>
      )}
    </div>
  );
};

export default PhoneInputField;


// ============================================================
// USAGE EXAMPLES — Copy paste karo jahan chahiye
// ============================================================

/*

// ─────────────────────────────────────────
// 1. BASIC USE (React Hook Form ke saath)
// ─────────────────────────────────────────
import PhoneInputField from "@/components/ui/PhoneInputField";
import { useState } from "react";

const [phone, setPhone] = useState("");

<PhoneInputField
  value={phone}
  onChange={(val) => {
    setPhone(val);
    setValue("contact.mobileNumber", val); // react-hook-form
  }}
/>


// ─────────────────────────────────────────
// 2. CUSTOMER REGISTRATION FORM
// ─────────────────────────────────────────
<PhoneInputField
  value={phone}
  onChange={(val) => {
    setPhone(val);
    setValue("contact.mobileNumber", val);
  }}
  label="Customer Phone Number"
  required={true}
  defaultCountry="gb"
/>


// ─────────────────────────────────────────
// 3. CALL LOG FORM
// ─────────────────────────────────────────
<PhoneInputField
  value={phone}
  onChange={setPhone}
  label="Customer Phone"
  placeholder="Enter customer number"
  defaultCountry="pk"   // Pakistan ke liye
  required={true}
/>


// ─────────────────────────────────────────
// 4. AGENT FORM (Pakistan number)
// ─────────────────────────────────────────
<PhoneInputField
  value={agentPhone}
  onChange={setAgentPhone}
  label="Agent Mobile"
  defaultCountry="pk"
  required={true}
  showValidation={true}
/>


// ─────────────────────────────────────────
// 5. FOLLOW-UP FORM — label hide karo
// ─────────────────────────────────────────
<PhoneInputField
  value={phone}
  onChange={setPhone}
  showLabel={false}
  placeholder="Callback number"
/>


// ─────────────────────────────────────────
// 6. DISABLED MODE (readonly)
// ─────────────────────────────────────────
<PhoneInputField
  value="+44 7700 900123"
  onChange={() => {}}
  disabled={true}
  label="Registered Phone"
/>


// ─────────────────────────────────────────
// 7. CUSTOM ERROR MESSAGE
// ─────────────────────────────────────────
<PhoneInputField
  value={phone}
  onChange={setPhone}
  required={true}
  errorMessage="Phone number required for follow-up"
/>


// ─────────────────────────────────────────
// 8. CUSTOM CONTAINER STYLING
// ─────────────────────────────────────────
<PhoneInputField
  value={phone}
  onChange={setPhone}
  containerClassName="col-span-2"
  labelClassName="text-purple-700"
/>

*/