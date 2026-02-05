import React from "react";

interface Props {
  label: string;
  value?: string;
}

export const FormDisplay = ({ label, value }: Props) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {label}
      </label>

      <div
        className="w-full h-10 px-3 bg-gray-100 border border-gray-100
                   rounded-[10px] text-sm font-bold text-gray-500
                   flex items-center"
      >
        {value || "-"}
      </div>
    </div>
  );
};
