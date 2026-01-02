import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormInput = ({ label, ...props }: Props) => (
  <div>
    <label className="block text-sm font-semibold mb-2 text-gray-700">{label} *</label>
    <input
      {...props}
      className="w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all border-gray-200 focus:border-[#FE6B1D]"
    />
  </div>
);