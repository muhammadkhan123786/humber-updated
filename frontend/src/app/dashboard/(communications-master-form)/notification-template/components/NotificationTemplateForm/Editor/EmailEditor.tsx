// components/NotificationTemplateForm/editors/EmailEditor.tsx
"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Eye, EyeOff, Hash } from "lucide-react";

interface EmailEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables?: { key: string; label?: string }[];
  placeholder?: string;
  minHeight?: string;
}

const highlightVariables = (html: string): string => {
  return html.replace(
    /\{\{(\w+)\}\}/g,
    `<span style="background:#EEF2FF;color:#4F46E5;padding:1px 6px;border-radius:6px;font-size:12px;font-weight:600;border:1px solid #C7D2FE;white-space:nowrap;font-family:monospace;">{{$1}}</span>`,
  );
};

export const EmailEditor: React.FC<EmailEditorProps> = ({
  value,
  onChange,
  variables = [],
  placeholder = "Write your email content here...",
  minHeight = "min-h-[260px]",
}) => {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (mode === "visual" && editorRef.current && !isUpdatingRef.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, mode]);

  const handleEditorInput = useCallback(() => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    onChange(editorRef.current.innerHTML);
    setTimeout(() => { isUpdatingRef.current = false; }, 0);
  }, [onChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleEditorInput();
  };

  const insertVariable = (key: string) => {
    const token = `{{${key}}}`;
    if (mode === "code" && textareaRef.current) {
      const ta = textareaRef.current;
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      const newVal = value.substring(0, s) + token + value.substring(e);
      onChange(newVal);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(s + token.length, s + token.length);
      }, 0);
    } else {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(token);
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
        handleEditorInput();
      } else {
        onChange(value + token);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <div className={`border rounded-xl overflow-visible transition-all ${isFocused ? "border-indigo-400 shadow-sm" : "border-slate-200"}`}>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-0.5">
            {mode === "visual" && (
              <>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800">
                  <Bold size={14} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800">
                  <Italic size={14} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800">
                  <Underline size={14} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }} className="p-1.5 hover:bg-white rounded-lg">
                  <AlignLeft size={14} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }} className="p-1.5 hover:bg-white rounded-lg">
                  <AlignCenter size={14} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }} className="p-1.5 hover:bg-white rounded-lg">
                  <AlignRight size={14} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} className="p-1.5 hover:bg-white rounded-lg">
                  <List size={14} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} className="p-1.5 hover:bg-white rounded-lg">
                  <ListOrdered size={14} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
            <button onClick={() => setMode("visual")} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${mode === "visual" ? "bg-indigo-600 text-white" : "text-slate-500"}`}>
              <Eye size={11} /> Visual
            </button>
            <button onClick={() => setMode("code")} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${mode === "code" ? "bg-slate-800 text-white" : "text-slate-500"}`}>
              <Code size={11} /> HTML
            </button>
          </div>
        </div>

        {/* Editor Area */}
        {mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${minHeight} p-4 outline-none text-[13px] leading-relaxed text-slate-800 overflow-y-auto`}
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleCodeChange}
            placeholder={placeholder}
            className={`w-full ${minHeight} p-4 outline-none resize-y font-mono text-[11px] text-green-400 bg-slate-900 leading-relaxed`}
          />
        )}
      </div>

      {/* Variables */}
      {variables.length > 0 && (
        <div className="mt-2">
          <p className="text-[11px] font-semibold text-indigo-600 mb-1.5">Available Variables — click to insert:</p>
          <div className="flex flex-wrap gap-1.5">
            {variables.map((v, i) => (
              <button key={i} type="button" onClick={() => insertVariable(v.key)}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-lg text-[11px] font-mono border border-indigo-100 transition-all">
                <Hash size={10} /> {`{{${v.key}}}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};