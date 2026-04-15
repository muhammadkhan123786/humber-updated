// components/MessageTemplate.tsx - Simpler version without iframe
"use client";
import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

interface MessageTemplateProps {
  index: number;
  channelName: string;
  template?: any;
  variables: any[];
  onTemplateSelect: (templateId: string) => void;
}

const MessageTemplate = ({
  index,
  channelName,
  template,
  variables,
  onTemplateSelect,
}: MessageTemplateProps) => {
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    if (template?.templateBody) {
      setMessageBody(template.templateBody);
    }
  }, [template?.templateBody]);

  // Function to render HTML with sample data
  const getRenderedHtml = () => {
    if (!messageBody) return "<p>No template content</p>";

    let renderedHtml = messageBody;
    
    const sampleData: Record<string, string> = {
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      userPhone: "+1 (555) 123-4567",
      companyName: "Acme Inc.",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      renderedHtml = renderedHtml.replace(regex, value);
    });

    return renderedHtml;
  };

  return (
    <div className="bg-white rounded-3xl my-3 shadow-sm border border-white/50 overflow-hidden">
      <div className="bg-[#FFF9F0] p-6 border-b border-orange-50">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-100">
            <Mail size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold tracking-wide text-[#1E1F4B]">
              Message Template - {channelName}
            </h2>
            <p className="text-[11px] text-[#808191] font-medium">
              {template ? "Email template preview" : "Select a template"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Template Selection */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
            Select Template
          </label>
          <select
            value={template?._id || ""}
            onChange={(e) => onTemplateSelect(e.target.value)}
            className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] appearance-none cursor-pointer transition-all"
          >
            <option value="">Choose a template...</option>
          </select>
          {template && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {template.name || template.subject}
            </p>
          )}
        </div>

        {/* Direct Rendered Template - No iframe, just HTML */}
        {template && messageBody && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
              Message Body
            </label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <span className="text-[11px] text-slate-500">
                  {channelName} Preview
                </span>
              </div>
              <div className="p-6 max-h-[500px] overflow-auto bg-white">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
                />
              </div>
            </div>

            {/* Variables */}
            {variables.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-purple-600 mb-2">
                  Available Variables:
                </p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-mono"
                    >
                      {typeof variable === "string" ? variable : variable.key || variable}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTemplate;