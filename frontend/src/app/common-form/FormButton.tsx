import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  themeColor: string;
}

export const FormButton = ({ label, icon, loading, themeColor, ...props }: ButtonProps) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    style={{ backgroundColor: themeColor }}
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : icon}
    {loading ? "Processing..." : label}
  </button>
);
