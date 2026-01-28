import React from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  icon: LucideIcon;
  number?: number;
  title: string;
  children: React.ReactNode;
  theme:
    | "blue"
    | "purple"
    | "green"
    | "orange"
    | "red"
    | "indigo"
    | "sky"
    | "teal"
    | "rose";
}

const FormSection: React.FC<FormSectionProps> = ({
  icon: Icon,
  number,
  title,
  children,
  theme,
}) => {
  const iconThemes = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    orange: "text-orange-600",
    red: "text-red-600",
    indigo: "text-indigo-600",
    sky: "text-sky-600",
    teal: "text-teal-600",
    rose: "text-rose-600",
  };

  return (
    <div className="mb-8">
      {" "}
      {/* Removed the card styling */}
      {/* HEADER */}
      <div className="flex items-center gap-2.5 mb-4">
        <Icon size={18} className={iconThemes[theme]} />
        <h3 className="text-[13px] font-black uppercase tracking-wider text-slate-700">
          {number} {title}
        </h3>
      </div>
      {/* CONTENT */}
      <div>{children}</div>
    </div>
  );
};

export default FormSection;
