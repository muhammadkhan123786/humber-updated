// "use client";

// import React, { useState, useRef } from "react";
// import {
//   Bold, Italic, Underline, List, ListOrdered,
//   Sparkles, X, Loader2, Copy, Check, ChevronDown,
//   User, Mail, Phone, Tag,
// } from "lucide-react";

// // ============================================================
// // TYPES
// // ============================================================
// export interface AIContext {
//   customerName?: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   templateType?: string;   // e.g. "Support", "Invoice", "Welcome"
//   channelName?: string;    // e.g. "Email", "SMS"
//   subject?: string;
//   extraContext?: string;
// }

// interface RichTextEditorProps {
//   id: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   variables?: string[];        // Click-to-insert variable tokens e.g. ["{{customerName}}"]
//   height?: string;             // Tailwind height class e.g. "h-64"
//   showAI?: boolean;            // Show AI button (default: true)
//   aiContext?: AIContext;        // Context for AI generation
//   geminiApiKey?: string;       // Your Gemini API key
//   label?: string;
//   required?: boolean;
//   disabled?: boolean;
// }

// // ============================================================
// // AI PANEL COMPONENT (internal)
// // ============================================================
// const AIPanel: React.FC<{
//   onClose: () => void;
//   onInsert: (text: string) => void;
//   context: AIContext;
//   geminiApiKey: string;
// }> = ({ onClose, onInsert, context, geminiApiKey }) => {

//   const [loading, setLoading] = useState(false);
//   const [generatedTemplate, setGeneratedTemplate] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [error, setError] = useState("");

//   // Local overrides
//   const [localCtx, setLocalCtx] = useState<AIContext>({ ...context });

//   // ✅ Gemini API Call
//   const generateTemplate = async () => {
//     // if (!geminiApiKey) {
//     //   setError("Gemini API key not provided. Add geminiApiKey prop.");
//     //   return;
//     // }

//     setLoading(true);
//     setError("");
//     setGeneratedTemplate("");

//     const prompt = buildPrompt(localCtx);

//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDy_huvdJ4hbfjKo4zt1jqhoqsv3QVASb8`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: [{ parts: [{ text: prompt }] }],
//             generationConfig: {
//               temperature: 0.7,
//               maxOutputTokens: 800,
//             },
//           }),
//         }
//       );

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err?.error?.message || "Gemini API error");
//       }

//       const data = await response.json();
//       const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//       setGeneratedTemplate(text.trim());
//     } catch (err: any) {
//       setError(err.message || "Failed to generate template.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const buildPrompt = (ctx: AIContext): string => {
//     return `You are a professional business communication specialist.

// Generate a ${ctx.channelName || "email"} template for the following context:

// - Template Type: ${ctx.templateType || "General"}
// - Customer Name: ${ctx.customerName || "Customer"}
// - Customer Email: ${ctx.customerEmail || "Not provided"}
// - Customer Phone: ${ctx.customerPhone || "Not provided"}
// - Subject/Topic: ${ctx.subject || "Not specified"}
// ${ctx.extraContext ? `- Additional Context: ${ctx.extraContext}` : ""}

// Requirements:
// 1. Write in a professional, warm, and clear tone
// 2. Use {{customerName}}, {{customerEmail}}, {{customerPhone}} as dynamic placeholders where appropriate
// 3. Keep it concise — max 200 words
// 4. For Email: include greeting, body, and closing
// 5. For SMS: keep under 160 characters and be direct
// 6. Do NOT include subject line in the body
// 7. Return ONLY the template body — no explanation, no extra text

// Generate the template now:`;
//   };

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(generatedTemplate);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleInsert = () => {
//     onInsert(generatedTemplate);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Panel */}
//       <div className="relative bg-white w-full max-w-[600px] rounded-3xl shadow-2xl overflow-hidden z-10">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-white/20 p-2 rounded-xl">
//               <Sparkles size={20} className="text-white" />
//             </div>
//             <div>
//               <h3 className="text-white font-bold text-[15px]">AI Template Generator</h3>
//               <p className="text-white/70 text-xs">Powered by Google Gemini</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-white/80 hover:text-white">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
//           {/* Context Fields */}
//           <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
//             <p className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
//               Template Context
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               {/* Customer Name */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
//                   <User size={12} /> Customer Name
//                 </label>
//                 <input
//                   value={localCtx.customerName || ""}
//                   onChange={(e) => setLocalCtx({ ...localCtx, customerName: e.target.value })}
//                   placeholder="e.g. John Smith"
//                   className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-purple-400"
//                 />
//               </div>

//               {/* Template Type */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
//                   <Tag size={12} /> Template Type
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={localCtx.templateType || ""}
//                     onChange={(e) => setLocalCtx({ ...localCtx, templateType: e.target.value })}
//                     className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-purple-400 appearance-none cursor-pointer"
//                   >
//                     <option value="">Select type...</option>
//                     <option value="Welcome">Welcome</option>
//                     <option value="Support Reply">Support Reply</option>
//                     <option value="Invoice">Invoice</option>
//                     <option value="Follow-Up">Follow-Up</option>
//                     <option value="Complaint Resolution">Complaint Resolution</option>
//                     <option value="Sales Lead">Sales Lead</option>
//                     <option value="Appointment Reminder">Appointment Reminder</option>
//                     <option value="Password Reset">Password Reset</option>
//                     <option value="Order Confirmation">Order Confirmation</option>
//                     <option value="Feedback Request">Feedback Request</option>
//                   </select>
//                   <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
//                   <Mail size={12} /> Customer Email
//                 </label>
//                 <input
//                   value={localCtx.customerEmail || ""}
//                   onChange={(e) => setLocalCtx({ ...localCtx, customerEmail: e.target.value })}
//                   placeholder="e.g. john@example.com"
//                   className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-purple-400"
//                 />
//               </div>

//               {/* Phone */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
//                   <Phone size={12} /> Customer Phone
//                 </label>
//                 <input
//                   value={localCtx.customerPhone || ""}
//                   onChange={(e) => setLocalCtx({ ...localCtx, customerPhone: e.target.value })}
//                   placeholder="e.g. +44 7700 900123"
//                   className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-purple-400"
//                 />
//               </div>
//             </div>

//             {/* Extra Context */}
//             <div className="space-y-1">
//               <label className="text-[11px] font-bold text-slate-600">Additional Instructions (optional)</label>
//               <textarea
//                 value={localCtx.extraContext || ""}
//                 onChange={(e) => setLocalCtx({ ...localCtx, extraContext: e.target.value })}
//                 placeholder="e.g. Customer is complaining about delayed delivery. Be apologetic and offer 10% discount."
//                 rows={2}
//                 className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-purple-400 resize-none"
//               />
//             </div>
//           </div>

//           {/* Generate Button */}
//           <button
//             type="button"
//             onClick={generateTemplate}
//             disabled={loading}
//             className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" />
//                 Generating with Gemini...
//               </>
//             ) : (
//               <>
//                 <Sparkles size={18} />
//                 Generate Template
//               </>
//             )}
//           </button>

//           {/* Error */}
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] flex items-start gap-2">
//               <X size={16} className="mt-0.5 shrink-0" />
//               {error}
//             </div>
//           )}

//           {/* Generated Result */}
//           {generatedTemplate && (
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <p className="text-[12px] font-bold text-green-700 uppercase tracking-wider">
//                   ✅ Generated Template
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleCopy}
//                   className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-slate-900"
//                 >
//                   {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
//                   {copied ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
//                 {generatedTemplate}
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   onClick={generateTemplate}
//                   className="py-2.5 rounded-xl font-bold text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors text-[13px]"
//                 >
//                   Regenerate
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleInsert}
//                   className="py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md hover:opacity-90 text-[13px]"
//                 >
//                   Insert into Editor ✓
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


// // ============================================================
// // MAIN REUSABLE RICH TEXT EDITOR
// // ============================================================
// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   id,
//   value,
//   onChange,
//   placeholder = "Enter your message here...",
//   variables = [],
//   height = "h-64",
//   showAI = true,
//   aiContext = {},
//   geminiApiKey = "",
//   label,
//   required = false,
//   disabled = false,
// }) => {
//   const [showAIPanel, setShowAIPanel] = useState(false);

//   // Format selected text
//   const formatText = (command: string) => {
//     const textarea = document.getElementById(id) as HTMLTextAreaElement;
//     if (!textarea) return;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selected = value.substring(start, end);
//     if (!selected) return;

//     const map: Record<string, string> = {
//       bold: `**${selected}**`,
//       italic: `*${selected}*`,
//       underline: `__${selected}__`,
//     };
//     const formatted = map[command];
//     if (!formatted) return;

//     const newText = value.substring(0, start) + formatted + value.substring(end);
//     onChange(newText);
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + formatted.length, start + formatted.length);
//     }, 0);
//   };

//   // Insert list
//   const insertList = (type: "bullet" | "numbered") => {
//     const prefix = type === "bullet" ? "• " : "1. ";
//     const newText = value + (value.endsWith("\n") || !value ? "" : "\n") + prefix;
//     onChange(newText);
//     setTimeout(() => {
//       const textarea = document.getElementById(id) as HTMLTextAreaElement;
//       if (textarea) {
//         textarea.focus();
//         textarea.setSelectionRange(newText.length, newText.length);
//       }
//     }, 0);
//   };

//   // Insert variable at cursor
//   const insertVariable = (variable: string) => {
//     const textarea = document.getElementById(id) as HTMLTextAreaElement;
//     if (textarea) {
//       const start = textarea.selectionStart;
//       const end = textarea.selectionEnd;
//       const newText = value.substring(0, start) + variable + value.substring(end);
//       onChange(newText);
//       setTimeout(() => {
//         textarea.focus();
//         textarea.setSelectionRange(start + variable.length, start + variable.length);
//       }, 0);
//     } else {
//       onChange(value + variable);
//     }
//   };

//   return (
//     <>
//       {/* AI Panel */}
//       {showAIPanel && (
//         <AIPanel
//           onClose={() => setShowAIPanel(false)}
//           onInsert={(text) => {
//             onChange(text);
//             setShowAIPanel(false);
//           }}
//           context={aiContext}
//           geminiApiKey={geminiApiKey}
//         />
//       )}

//       <div className="space-y-1.5">
//         {/* Label */}
//         {label && (
//           <label className="text-[12px] font-bold ml-1 uppercase tracking-wider text-[#1E1F4B] opacity-90">
//             {label}
//             {required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}

//         {/* Editor Container */}
//         <div className={`border border-slate-100 rounded-2xl overflow-hidden focus-within:border-purple-300 transition-all shadow-sm ${disabled ? "opacity-60" : ""}`}>

//           {/* Toolbar */}
//           <div className="flex items-center justify-between p-2 bg-slate-50/50 border-b border-slate-100">
//             <div className="flex items-center gap-1">
//               {/* Format Buttons */}
//               {[
//                 { cmd: "bold", icon: <Bold size={15} />, title: "Bold (select text first)" },
//                 { cmd: "italic", icon: <Italic size={15} />, title: "Italic (select text first)" },
//                 { cmd: "underline", icon: <Underline size={15} />, title: "Underline (select text first)" },
//               ].map((btn) => (
//                 <button
//                   key={btn.cmd}
//                   type="button"
//                   disabled={disabled}
//                   onClick={() => formatText(btn.cmd)}
//                   title={btn.title}
//                   className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all"
//                 >
//                   {btn.icon}
//                 </button>
//               ))}

//               <div className="w-px h-4 bg-slate-200 mx-1" />

//               <button
//                 type="button"
//                 disabled={disabled}
//                 onClick={() => insertList("bullet")}
//                 title="Bullet List"
//                 className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all"
//               >
//                 <List size={15} />
//               </button>
//               <button
//                 type="button"
//                 disabled={disabled}
//                 onClick={() => insertList("numbered")}
//                 title="Numbered List"
//                 className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all"
//               >
//                 <ListOrdered size={15} />
//               </button>
//             </div>

//             {/* AI Button */}
//             {showAI && (
//               <button
//                 type="button"
//                 disabled={disabled}
//                 onClick={() => setShowAIPanel(true)}
//                 className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-[12px] font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
//               >
//                 <Sparkles size={13} />
//                 AI Assistant
//               </button>
//             )}
//           </div>

//           {/* Textarea */}
//           <textarea
//             id={id}
//             value={value}
//             disabled={disabled}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             className={`w-full ${height} p-5 outline-none text-[14px] leading-relaxed text-[#1E1F4B] placeholder:text-[#ACB5BD] resize-none bg-white`}
//           />
//         </div>

//         {/* Variable Chips */}
//         {variables.length > 0 && (
//           <div className="mt-2">
//             <p className="text-[11px] font-semibold text-purple-600 mb-2">
//               Available Variables (click to insert):
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {variables.map((variable, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   disabled={disabled}
//                   onClick={() => insertVariable(variable)}
//                   className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-mono hover:bg-purple-100 transition-colors border border-purple-100"
//                 >
//                   {variable}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex justify-between items-center px-1 mt-1">
//           <p className="text-[11px] text-[#808191] font-medium">
//             Characters: {value.length}
//           </p>
//           <p className="text-[11px] text-[#808191]">
//             Use variables to personalize messages
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RichTextEditor;


// // ============================================================
// // USAGE EXAMPLES
// // ============================================================

// /*

// // ─────────────────────────────────────────
// // 1. BASIC USE
// // ─────────────────────────────────────────
// import RichTextEditor from "@/components/ui/RichTextEditor";
// import { useState } from "react";

// const [body, setBody] = useState("");

// <RichTextEditor
//   id="my-editor"
//   value={body}
//   onChange={setBody}
//   geminiApiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY!}
// />


// // ─────────────────────────────────────────
// // 2. WITH VARIABLES + AI CONTEXT (Email Template)
// // ─────────────────────────────────────────
// <RichTextEditor
//   id="email-body"
//   value={templateBody}
//   onChange={(val) => setValue("templateBody", val)}
//   label="Template Body"
//   required
//   variables={["{{customerName}}", "{{customerEmail}}", "{{customerPhone}}", "{{orderId}}"]}
//   geminiApiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY!}
//   aiContext={{
//     customerName: "John Smith",
//     customerEmail: "john@example.com",
//     customerPhone: "+44 7700 900123",
//     templateType: "Support Reply",
//     channelName: "Email",
//     subject: "Your support ticket #1234",
//   }}
// />


// // ─────────────────────────────────────────
// // 3. IN NotificationTemplateForm
// // ─────────────────────────────────────────
// <RichTextEditor
//   id="notification-body"
//   value={watch("templateBody")}
//   onChange={(val) => setValue("templateBody", val)}
//   label="Template Body"
//   required
//   variables={selectedVariables.map(v => `{{${v.key}}}`)}
//   geminiApiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY!}
//   aiContext={{
//     templateType: selectedEventAction?.name,
//     channelName: selectedProvider?.channelName,
//   }}
// />


// // ─────────────────────────────────────────
// // 4. DISABLED / READ-ONLY
// // ─────────────────────────────────────────
// <RichTextEditor
//   id="preview-body"
//   value={previewContent}
//   onChange={() => {}}
//   disabled={true}
//   showAI={false}
// />

// */


// components/Richtexteditor/index.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bold, Italic, Underline, Sparkles, Loader2 } from "lucide-react";
import { generateEmailTemplate } from "../app/dashboard/(communications-master-form)/notification-template/services/emailApi";
import toast from "react-hot-toast";

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  height?: string;
  showAI?: boolean;
  geminiApiKey?: string;
  variables?: string[];
  aiContext?: {
    templateType?: string;
    channelName?: string;
    subject?: string;
    extraContext?: string;
  };
  onSubjectGenerated?: (subject: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  value,
  onChange,
  label,
  required,
  placeholder,
  height = "h-44",
  showAI = true,
  variables = [],
  aiContext = {},
  onSubjectGenerated,
}) => {
  const [isAILoading, setIsAILoading] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string) => {
    document.execCommand(command, false, undefined);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertVariable = (variable: string) => {
    if (editorRef.current) {
      document.execCommand('insertHTML', false, variable);
      onChange(editorRef.current.innerHTML);
    }
  };

  const generateWithAI = async () => {
    const eventName = aiContext.templateType;
    
    if (!eventName) {
      toast.error("Please select an Event first");
      return;
    }

    setIsAILoading(true);
    
    try {
      const params = {
        eventName: eventName,
        eventDescription: aiContext.extraContext || "",
        channelName: aiContext.channelName || "Email",
        additionalContext: aiContext.subject ? `Subject: ${aiContext.subject}\n${aiPrompt}` : aiPrompt
      };

      const result = await generateEmailTemplate(params);
      
      if (result.templateBody) {
        // Extract only the dynamic content part from the generated HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = result.templateBody;
        
        // Find the content section
        const contentTd = tempDiv.querySelector('td[style*="padding: 40px 30px"]');
        if (contentTd) {
          editorRef.current!.innerHTML = contentTd.innerHTML;
          onChange(contentTd.innerHTML);
        } else {
          editorRef.current!.innerHTML = result.templateBody;
          onChange(result.templateBody);
        }
        
        // Update subject if callback provided
        if (result.subject && onSubjectGenerated) {
          onSubjectGenerated(result.subject);
        }
        
        toast.success("Email template generated successfully!");
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate template");
    } finally {
      setIsAILoading(false);
      setShowAIPanel(false);
      setAiPrompt("");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Underline"
            >
              <Underline size={16} />
            </button>
          </div>
          
          {showAI && (
            <button
              type="button"
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-all"
            >
              <Sparkles size={14} />
              AI Generate
            </button>
          )}
        </div>
        
        {/* AI Panel */}
        {showAIPanel && (
          <div className="p-4 bg-purple-50 border-b border-purple-100">
            <p className="text-sm font-semibold text-purple-700 mb-3">
              Generate Email for: <span className="font-bold">{aiContext.templateType || 'Selected Event'}</span>
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Optional: Add specific instructions for the AI...&#10;Example: 'Make it urgent and include a discount code'"
              className="w-full p-3 border border-purple-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
              rows={3}
            />
            <button
              type="button"
              onClick={generateWithAI}
              disabled={isAILoading}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAILoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Email Template
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Editor Content */}
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className={`${height} p-4 outline-none overflow-y-auto text-sm leading-relaxed`}
          style={{ fontFamily: 'Arial, sans-serif' }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </div>
      
      {/* Variables */}
      {variables.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-purple-600 mb-2">Variables:</p>
          <div className="flex flex-wrap gap-2">
            {variables.map((variable, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertVariable(variable)}
                className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs hover:bg-purple-100"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;