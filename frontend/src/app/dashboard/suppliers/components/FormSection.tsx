import React from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  icon: LucideIcon;
  number: number;
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
  // Added new optional props
  headerClassName?: string;
  iconClassName?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  icon: Icon,
  number,
  title,
  children,
  theme,
  headerClassName, // Destructure new prop
  iconClassName,   // Destructure new prop
}) => {
  const themes = {
    blue: "bg-blue-50/40 border-blue-50 text-blue-700 icon-blue-600",
    purple: "bg-purple-50/40 border-purple-50 text-purple-700 icon-purple-600",
    green: "bg-[#f0fdf4] border-[#dcfce7] text-[#15803d] icon-[#16a34a]",
    orange: "bg-[#fff7ed] border-[#ffedd5] text-[#c2410c] icon-[#ea580c]",
    red: "bg-red-50/40 border-red-50 text-red-700 icon-red-600",
    indigo: "bg-indigo-50/40 border-indigo-50 text-indigo-700 icon-indigo-600",
    sky: "bg-sky-50/40 border-sky-50 text-sky-700 icon-sky-600",
    teal: "bg-teal-50/40 border-teal-50 text-teal-700 icon-teal-600",
    rose: "bg-rose-50/40 border-rose-50 text-rose-700 icon-rose-600",
  };

  const selectedTheme = themes[theme];
  // Existing icon color logic
  const defaultIconColor = selectedTheme
    .split(" ")
    .find((c) => c.startsWith("icon-"))
    ?.replace("icon-", "");

  return (
    <div className="bg-white rounded-b-2xl  shadow-md border border-slate-100 overflow-hidden">
      <div className={`flex items-center gap-2 p-6 pb-1.5! ${headerClassName || 'bg-linear-to-r from-blue-50 to-cyan-50'}`}>
        <Icon size={20} className={`${iconClassName || defaultIconColor}`} />
        <h4 className="text-xl font-semibold tracking-wide">
          {number}. {title}
        </h4>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default FormSection;
