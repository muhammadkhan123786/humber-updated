// FormModal.tsx
import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  themeColor: string;
  children: React.ReactNode;
  width?: string;
  className?: string;
}

export const FormModal = ({
  title,
  icon,
  onClose,
  themeColor,
  children,
  width = "max-w-lg",
  className = "",
}: ModalProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div
      className={`bg-white rounded-3xl w-full ${width} shadow-2xl overflow-hidden animate-in zoom-in duration-200 ${className}`}
    >
      <div
        className="p-6 text-white flex justify-between items-center"
        style={{ background: themeColor }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          {icon} {title}
        </h2>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);
