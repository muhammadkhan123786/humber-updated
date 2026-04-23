// components/NotificationTemplateForm/PreviewModals/SMSPreviewModal.tsx
"use client";
import { X } from "lucide-react";
import { PreviewModalProps } from "../types";

interface SMSPreviewModalProps extends PreviewModalProps {
  text: string;
}

export const SMSPreviewModal: React.FC<SMSPreviewModalProps> = ({ text, onClose }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative z-10">
      <div className="w-[300px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700">
        <div className="bg-black rounded-[2.5rem] overflow-hidden">
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">SMS</div>
            <p className="text-white text-xs font-semibold flex-1">Business Message</p>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={14} /></button>
          </div>
          <div className="p-4 min-h-[180px]">
            <div className="bg-slate-700 rounded-2xl rounded-tl-none p-3">
              <p className="text-white text-[12px] leading-relaxed whitespace-pre-wrap">{text}</p>
            </div>
            <p className={`text-[10px] mt-2 ${text.length > 160 ? "text-red-400" : "text-slate-500"}`}>
              {text.length}/160 chars {text.length > 160 && "— splits into multiple"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);