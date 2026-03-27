"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Sparkles,
} from "lucide-react";

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
    queueMicrotask(() => {
      setMessageBody(template?.templateBody || "");
    });
  }, [template?.templateBody]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    onTemplateSelect(templateId);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById(
      `message-body-${index}`,
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = messageBody;
      const newText = text.substring(0, start) + variable + text.substring(end);
      setMessageBody(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + variable.length,
          start + variable.length,
        );
      }, 0);
    } else {
      setMessageBody(messageBody + variable);
    }
  };

  // Formatting functions
  const formatText = (command: string) => {
    const textarea = document.getElementById(
      `message-body-${index}`,
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = messageBody.substring(start, end);

      if (selectedText) {
        let formattedText = "";
        switch (command) {
          case "bold":
            formattedText = `**${selectedText}**`;
            break;
          case "italic":
            formattedText = `*${selectedText}*`;
            break;
          case "underline":
            formattedText = `__${selectedText}__`;
            break;
          default:
            return;
        }

        const newText =
          messageBody.substring(0, start) +
          formattedText +
          messageBody.substring(end);
        setMessageBody(newText);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + formattedText.length,
            start + formattedText.length,
          );
        }, 0);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-white/50 overflow-hidden">
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
              {template
                ? "Edit message template"
                : "Select a template to get started"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
            Select Template
          </label>
          <div className="flex gap-3">
            <select
              value={template?._id || ""}
              onChange={handleTemplateChange}
              className="flex-1 h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] appearance-none cursor-pointer transition-all"
            >
              <option value="">Choose a template...</option>
            </select>
            {template && (
              <button
                type="button"
                onClick={() => {
                  alert(`Template Preview:\n\n${messageBody}`);
                }}
                className="flex items-center gap-2 px-5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-[#1E1F4B] hover:bg-slate-50 transition-all shadow-sm"
              >
                <Eye size={16} className="text-slate-500" />
                Preview
              </button>
            )}
          </div>
          {template && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {template.name || template.subject}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
            Message Body <span className="text-purple-500">*</span>
          </label>

          <div className="border border-slate-100 rounded-2xl overflow-hidden focus-within:border-purple-300 transition-all shadow-sm">
            {/* Formatting Toolbar */}
            <div className="flex items-center justify-between p-2 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => formatText("bold")}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all"
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => formatText("italic")}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all"
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => formatText("underline")}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all"
                  title="Underline"
                >
                  <Underline size={16} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all"
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all"
                  title="Numbered List"
                >
                  <ListOrdered size={16} />
                </button>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-[12px] font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                <Sparkles size={14} />
                AI Assistant
              </button>
            </div>

            <textarea
              id={`message-body-${index}`}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Enter your message template here... Use dynamic variables from the sidebar"
              className="w-full h-64 p-5 outline-none text-[14px] leading-relaxed text-[#1E1F4B] placeholder:text-[#ACB5BD] resize-none"
            />
          </div>

          {variables.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-purple-600 mb-2">
                Available Variables (click to insert):
              </p>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertVariable(variable)}
                    className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-mono hover:bg-purple-100 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-1 mt-2">
            <p className="text-[11px] text-[#808191] font-medium">
              Character count: {messageBody.length}
            </p>
            <p className="text-[11px] font-bold text-[#808191]">
              Use variables from the sidebar to personalize messages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplate;
