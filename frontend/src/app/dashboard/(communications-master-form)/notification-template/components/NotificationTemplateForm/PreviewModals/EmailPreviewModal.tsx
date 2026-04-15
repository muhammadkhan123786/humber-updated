// components/NotificationTemplateForm/PreviewModals/EmailPreviewModal.tsx
"use client";
import { X } from "lucide-react";
import { PreviewModalProps } from "../types";

interface EmailPreviewModalProps extends PreviewModalProps {
  html: string;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ html, onClose }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white w-full max-w-[800px] rounded-3xl shadow-2xl overflow-hidden z-10">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-[12px] font-semibold text-slate-600 ml-1">📧 Email Preview</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
      </div>
      <div className="h-[600px] overflow-auto bg-slate-100">
        <iframe srcDoc={html} className="w-full h-full border-0" title="Email Preview" sandbox="allow-same-origin allow-scripts" />
      </div>
    </div>
  </div>
);