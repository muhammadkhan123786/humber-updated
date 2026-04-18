// components/NotificationTemplateForm/TemplateEditor.tsx
"use client";
import React from "react";
import { EmailEditor } from "./Editor/EmailEditor";
import { SMSEditor } from "./Editor/SMSEditor";
import { WhatsAppEditor } from "./Editor/WAPEditor";

interface TemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables?: { key: string; label?: string }[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  channelType: "email" | "sms" | "whatsapp";
  minHeight?: string;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  value,
  onChange,
  variables = [],
  label,
  required,
  placeholder,
  channelType,
  minHeight,
}) => {
  const commonProps = { value, onChange, variables, placeholder, minHeight };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {channelType === "email" && <EmailEditor {...commonProps} />}
      {channelType === "sms" && <SMSEditor {...commonProps} />}
      {channelType === "whatsapp" && <WhatsAppEditor {...commonProps} />}
    </div>
  );
};

export default TemplateEditor;