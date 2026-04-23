// components/NotificationTemplateForm/editors/WhatsAppEditor.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Eye,
  EyeOff,
  Smile,
  Paperclip,
  Mic,
  Send,
  Hash,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface WhatsAppEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables?: { key: string; label?: string }[];
  placeholder?: string;
  minHeight?: string;
}

export const WhatsAppEditor: React.FC<WhatsAppEditorProps> = ({
  value,
  onChange,
  variables = [],
  placeholder = "Type your WhatsApp message here...",
  minHeight = "min-h-[200px]",
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const charCount = value.length;

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format WhatsApp text for preview
  const formatWhatsAppText = (text: string) => {
    return text
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<s>$1</s>")
      .replace(/\n/g, "<br/>");
  };

  // Insert formatting
  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let formattedText = "";
    let cursorOffset = 0;

    switch (format) {
      case "bold":
        formattedText = `*${selectedText || "text"}*`;
        cursorOffset = selectedText ? formattedText.length : 5;
        break;
      case "italic":
        formattedText = `_${selectedText || "text"}_`;
        cursorOffset = selectedText ? formattedText.length : 5;
        break;
      case "strike":
        formattedText = `~${selectedText || "text"}~`;
        cursorOffset = selectedText ? formattedText.length : 5;
        break;
      default:
        return;
    }

    const newText =
      value.substring(0, start) + formattedText + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 10);
  };

  // Insert emoji
  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + emoji + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 10);
    setShowEmojiPicker(false);
  };

  // Insert variable
  const insertVariable = (key: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const token = `{{${key}}}`;
    const newText = value.substring(0, start) + token + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 10);
  };

  return (
    <div className="space-y-2">
      {/* WhatsApp-style Toolbar */}
      <div className="flex items-center justify-between p-2 bg-[#f0f2f5] rounded-xl">
        <div className="flex items-center gap-1">
          {/* Formatting buttons */}
          <button
            type="button"
            onClick={() => insertFormatting("bold")}
            className="p-2 hover:bg-white rounded-lg transition-colors text-[#54656f] hover:text-[#111b21]"
            title="Bold *text*"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("italic")}
            className="p-2 hover:bg-white rounded-lg transition-colors text-[#54656f] hover:text-[#111b21]"
            title="Italic _text_"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("strike")}
            className="p-2 hover:bg-white rounded-lg transition-colors text-[#54656f] hover:text-[#111b21]"
            title="Strikethrough ~text~"
          >
            <Strikethrough size={18} />
          </button>

          <div className="w-px h-6 bg-[#d1d7db] mx-1" />

          {/* Emoji Picker Button */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-white rounded-lg transition-colors text-[#54656f] hover:text-[#111b21]"
              title="Insert emoji"
            >
              <Smile size={18} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 w-100 bg-white rounded-xl shadow-2xl border border-[#e9edef] z-50">
                <div className="p-3 border-b border-[#e9edef]">
                  <span className="text-sm font-semibold text-[#111b21]">
                    Emojis
                  </span>
                </div>
                <div className="p-3 grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => insertEmoji(emoji.native)}
                    theme="light"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Variables Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVariables(!showVariables)}
              className="p-2 hover:bg-white rounded-lg transition-colors text-[#54656f] hover:text-[#111b21]"
              title="Insert variable"
            >
              <Hash size={18} />
            </button>

            {showVariables && variables.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-2xl border border-[#e9edef] z-50">
                <div className="p-3 border-b border-[#e9edef]">
                  <span className="text-sm font-semibold text-[#111b21]">
                    Variables
                  </span>
                </div>
                <div className="p-2 max-h-48 overflow-y-auto">
                  {variables.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => insertVariable(v.key)}
                      className="w-full text-left px-3 py-2 text-sm text-[#54656f] hover:bg-[#f0f2f5] rounded-lg transition-colors font-mono"
                    >
                      {`{{${v.key}}}`} - {v.label || v.key}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-[#d1d7db] mx-1" />

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
              showPreview
                ? "bg-[#25D366] text-white"
                : "hover:bg-white text-[#54656f] hover:text-[#111b21]"
            }`}
            title={showPreview ? "Edit Mode" : "Preview Mode"}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="text-xs font-medium">
              {showPreview ? "Edit" : "Preview"}
            </span>
          </button>
        </div>

        {/* WhatsApp brand */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#25D366] font-semibold">
            WhatsApp
          </span>
        </div>
      </div>

      {/* Formatting help */}
      <div className="flex items-center gap-3 px-2">
        <span className="text-[10px] text-[#8696a0]">Formatting:</span>
        <span className="text-[10px] text-[#54656f] bg-[#f0f2f5] px-2 py-0.5 rounded">
          *bold*
        </span>
        <span className="text-[10px] text-[#54656f] bg-[#f0f2f5] px-2 py-0.5 rounded">
          _italic_
        </span>
        <span className="text-[10px] text-[#54656f] bg-[#f0f2f5] px-2 py-0.5 rounded">
          ~strike~
        </span>
      </div>

      {showPreview ? (
        // WhatsApp-style Preview
        <div
          className="rounded-xl overflow-hidden border border-[#e9edef]"
          style={{ background: "#f0f2f5" }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: "#f0f2f5", borderBottom: "1px solid #e9edef" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#25D366" }}
            >
              <span className="text-white text-sm font-bold">WA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111b21]">Preview</p>
              <p className="text-[11px] text-[#54656f]">
                How your message will look in WhatsApp
              </p>
            </div>
          </div>

          {/* Chat messages area */}
          <div
            className="p-4 min-h-[200px]"
            style={{
              backgroundImage:
                'url("https://web.whatsapp.com/img/bg-chat-tile-light_686f5b6a4d5f5e0f5e5e5e5e5e5e5e5e.png")',
            }}
          >
            {/* Outgoing message (user message) */}
            <div className="flex justify-end mb-3">
              <div className="max-w-[80%] bg-[#d9fdd3] rounded-2xl rounded-tr-none px-3 py-2 shadow-sm">
                <div
                  className="text-[13px] leading-relaxed text-[#111b21]"
                  dangerouslySetInnerHTML={{
                    __html:
                      formatWhatsAppText(value) || "<em>Empty message</em>",
                  }}
                />
                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[10px] text-[#667781]">
                    {charCount} chars
                  </span>
                  <span className="text-[10px] text-[#667781]">✓✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat input area (static) */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ background: "#f0f2f5", borderTop: "1px solid #e9edef" }}
          >
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-[13px] text-[#667781]">
              Type a message...
            </div>
            <button className="p-2 text-[#54656f]">
              <Mic size={20} />
            </button>
          </div>
        </div>
      ) : (
        // WhatsApp-style Textarea
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${minHeight} p-4 rounded-xl border border-[#e9edef] outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] text-sm leading-relaxed bg-white shadow-sm resize-y font-sans`}
            style={{
              fontFamily:
                "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          />

          {/* Character counter */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`text-[10px] ${charCount > 0 ? "text-[#667781]" : "text-[#d1d7db]"}`}
            >
              {charCount > 0 ? `${charCount}` : ""}
            </span>
          </div>
        </div>
      )}

      {/* Character limit warning */}
      {charCount > 1000 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] text-amber-600">
            ⚠️ Message is long ({charCount}/1000 chars)
          </span>
          <span className="text-[10px] text-amber-600">
            May be truncated on some devices
          </span>
        </div>
      )}
    </div>
  );
};
