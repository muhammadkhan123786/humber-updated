
"use client";
import { X } from "lucide-react";
import { PreviewModalProps } from "../types";

interface WAPreviewModalProps extends PreviewModalProps {
  text: string;
}

export const WAPreviewModal: React.FC<WAPreviewModalProps> = ({ text, onClose }) => {
  const formatWA = (t: string) => {
    return t
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<s>$1</s>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10">
        <div className="w-[340px] rounded-3xl shadow-2xl overflow-hidden" style={{ background: "#0b141a" }}>
          <div className="flex items-center gap-2.5 px-4 py-3 justify-between" style={{ background: "#202c33" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#25D366" }}>WA</div>
              <div>
                <p className="text-white text-xs font-semibold">Business Account</p>
                <p className="text-[10px]" style={{ color: "#25D366" }}>✓ Official Business</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={14} /></button>
          </div>
          <div className="p-4 min-h-[200px]">
            <div className="rounded-2xl rounded-tl-none p-3 max-w-[90%]" style={{ background: "#202c33" }}>
              <div
                className="text-[13px] leading-relaxed"
                style={{ color: "#e9edef" }}
                dangerouslySetInnerHTML={{ __html: formatWA(text) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};