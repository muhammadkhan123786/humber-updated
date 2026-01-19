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
}

const FormSection: React.FC<FormSectionProps> = ({
  icon: Icon,
  number,
  title,
  children,
  theme,
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
  const iconColor = selectedTheme
    .split(" ")
    .find((c) => c.startsWith("icon-"))
    ?.replace("icon-", "");

  return (
    <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
      <div
        className={`flex items-center gap-2.5 p-5 border-b ${selectedTheme}`}
      >
        <Icon size={18} className={iconColor} />
        <h3 className="text-[13px] font-black uppercase tracking-wider">
          {number}. {title}
        </h3>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
};

export default FormSection;
