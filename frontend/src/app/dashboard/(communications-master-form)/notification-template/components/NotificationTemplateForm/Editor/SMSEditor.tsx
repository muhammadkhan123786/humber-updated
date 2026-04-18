// components/NotificationTemplateForm/SMSEditor.tsx
"use client";
import React from "react";

interface SMSEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const SMSEditor: React.FC<SMSEditorProps> = ({
  value,
  onChange,
  placeholder,
  minHeight = "min-h-[140px]",
}) => {
  const charCount = value.length;
  const isOverLimit = charCount > 160;
  const segments = Math.ceil(charCount / 160);

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Type your SMS message here...\n\nTip: Keep it under 160 characters per SMS segment."}
        className={`w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm leading-relaxed bg-white shadow-sm resize-y ${minHeight}`}
        maxLength={320}
      />
      
      {/* Character counter */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
            📱 {charCount} / 160 characters
          </span>
          {segments > 1 && (
            <span className="text-[11px] text-amber-500">
              (Will be sent as {segments} SMS segments)
            </span>
          )}
        </div>
        {isOverLimit && (
          <p className="text-[10px] text-red-500">
            ⚠️ Exceeds 160 characters. Will be split into multiple messages.
          </p>
        )}
      </div>
    </div>
  );
};