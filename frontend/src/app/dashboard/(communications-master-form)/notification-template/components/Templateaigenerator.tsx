// "use client";

// import React, { useState } from "react";
// import {
//   Sparkles, X, Loader2, Copy, Check, Mail,
//   MessageSquare, Send, ChevronDown, User,
//   Phone, Tag, Eye, EyeOff, RefreshCw,
// } from "lucide-react";

// // ─────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────
// export type TemplateChannel = "email" | "sms" | "whatsapp";

// export interface AITemplateContext {
//   customerName?: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   templateType?: string;
//   subject?: string;
//   companyName?: string;
//   companyLogo?: string;     // URL
//   companyColor?: string;    // hex e.g. "#4F46E5"
//   companyWebsite?: string;
//   companyAddress?: string;
//   extraContext?: string;
// }

// interface TemplateAIGeneratorProps {
//   channel: TemplateChannel;           // which channel this panel is for
//   context?: AITemplateContext;
//   geminiApiKey: string;
//   onInsert: (content: string) => void;
//   onClose: () => void;
// }

// // ─────────────────────────────────────────────────────────────
// // PROMPTS — 3 different for each channel
// // ─────────────────────────────────────────────────────────────
// const buildEmailPrompt = (ctx: AITemplateContext): string => `
// You are a world-class HTML email designer and copywriter.

// Generate a COMPLETE, PRODUCTION-READY HTML email template.

// Context:
// - Template Type: ${ctx.templateType || "General"}
// - Customer Name: ${ctx.customerName || "{{customerName}}"}
// - Customer Email: ${ctx.customerEmail || "{{customerEmail}}"}
// - Customer Phone: ${ctx.customerPhone || "{{customerPhone}}"}
// - Subject: ${ctx.subject || ""}
// - Company Name: ${ctx.companyName || "Our Company"}
// - Brand Color: ${ctx.companyColor || "#4F46E5"}
// - Company Website: ${ctx.companyWebsite || "#"}
// - Company Address: ${ctx.companyAddress || "123 Business Street, City"}
// ${ctx.extraContext ? `- Extra: ${ctx.extraContext}` : ""}

// REQUIREMENTS — follow EXACTLY:
// 1. Return ONLY valid HTML — no markdown, no code blocks, no explanation
// 2. Must be inline-CSS only (email clients don't support stylesheets)
// 3. Max width 600px, centered
// 4. HEADER: gradient background using brand color (${ctx.companyColor || "#4F46E5"}), company name as logo text, professional layout
// 5. BODY: white background, clean typography, Helvetica/Arial, proper padding, personalized greeting using {{customerName}}
// 6. Use {{customerName}}, {{customerEmail}}, {{customerPhone}} as dynamic placeholders
// 7. FOOTER: dark background (#1e1e2e), company address, website link, "Unsubscribe" link, copyright, social media icons (text-based)
// 8. Call-to-action button using brand color
// 9. Professional, corporate look — NOT generic
// 10. Responsive: use max-width and percentage widths

// Generate the complete HTML now:`;

// const buildSMSPrompt = (ctx: AITemplateContext): string => `
// You are an expert SMS marketing copywriter.

// Write a professional SMS template.

// Context:
// - Template Type: ${ctx.templateType || "General"}
// - Customer Name: {{customerName}} (use this placeholder)
// - Company: ${ctx.companyName || "Our Company"}
// - Subject/Topic: ${ctx.subject || ""}
// ${ctx.extraContext ? `- Extra: ${ctx.extraContext}` : ""}

// REQUIREMENTS:
// 1. STRICT 160 character limit (including spaces)
// 2. Use {{customerName}} placeholder
// 3. Include company name at start
// 4. Clear call-to-action
// 5. Professional and friendly tone
// 6. NO emojis (SMS doesn't always support them)
// 7. Return ONLY the message text — nothing else

// Generate now:`;

// const buildWhatsAppPrompt = (ctx: AITemplateContext): string => `
// You are a WhatsApp Business messaging expert.

// Create a professional WhatsApp message template.

// Context:
// - Template Type: ${ctx.templateType || "General"}
// - Customer Name: {{customerName}} (use this placeholder)
// - Customer Email: {{customerEmail}}
// - Customer Phone: {{customerPhone}}
// - Company: ${ctx.companyName || "Our Company"}
// - Subject/Topic: ${ctx.subject || ""}
// ${ctx.extraContext ? `- Extra: ${ctx.extraContext}` : ""}

// REQUIREMENTS:
// 1. Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~
// 2. Use emojis appropriately (✅ ❗ 📞 📧 etc.)
// 3. Max 1000 characters
// 4. Friendly but professional tone
// 5. Use {{customerName}}, {{customerEmail}}, {{customerPhone}} placeholders
// 6. Structure: greeting → main message → details → CTA → signature
// 7. Return ONLY the WhatsApp message text — nothing else

// Generate now:`;

// // ─────────────────────────────────────────────────────────────
// // EMAIL PREVIEW COMPONENT
// // ─────────────────────────────────────────────────────────────
// const EmailHTMLPreview: React.FC<{ html: string }> = ({ html }) => {
//   return (
//     <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
//       <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border-b border-slate-200">
//         <div className="flex gap-1.5">
//           <div className="w-3 h-3 rounded-full bg-red-400" />
//           <div className="w-3 h-3 rounded-full bg-yellow-400" />
//           <div className="w-3 h-3 rounded-full bg-green-400" />
//         </div>
//         <span className="text-[11px] text-slate-500 font-medium ml-2">Email Preview</span>
//       </div>
//       <div className="h-[320px] overflow-y-auto">
//         <iframe
//           srcDoc={html}
//           className="w-full h-full border-0"
//           title="Email Preview"
//           sandbox="allow-same-origin"
//         />
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // SMS PREVIEW
// // ─────────────────────────────────────────────────────────────
// const SMSPreview: React.FC<{ text: string }> = ({ text }) => (
//   <div className="flex justify-center">
//     <div className="w-64 bg-slate-800 rounded-3xl p-4 shadow-2xl">
//       <div className="flex items-center gap-2 mb-3">
//         <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
//           SMS
//         </div>
//         <div>
//           <p className="text-white text-xs font-bold">Business Message</p>
//           <p className="text-slate-400 text-[10px]">Today</p>
//         </div>
//       </div>
//       <div className="bg-slate-700 rounded-2xl rounded-tl-sm p-3">
//         <p className="text-white text-[12px] leading-relaxed">{text}</p>
//       </div>
//       <p className="text-slate-500 text-[10px] text-right mt-2">
//         {text.length}/160 chars
//       </p>
//     </div>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────
// // WHATSAPP PREVIEW
// // ─────────────────────────────────────────────────────────────
// const WhatsAppPreview: React.FC<{ text: string }> = ({ text }) => {
//   const formatWA = (t: string) => {
//     return t
//       .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
//       .replace(/_(.*?)_/g, "<em>$1</em>")
//       .replace(/~(.*?)~/g, "<s>$1</s>")
//       .replace(/\n/g, "<br/>");
//   };

//   return (
//     <div className="flex justify-center">
//       <div
//         className="w-72 rounded-3xl p-4 shadow-2xl overflow-hidden"
//         style={{ background: "#0a1628" }}
//       >
//         <div
//           className="flex items-center gap-2 mb-3 pb-3"
//           style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
//         >
//           <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
//             style={{ background: "#25D366" }}>
//             WA
//           </div>
//           <div>
//             <p className="text-white text-xs font-bold">Business Account</p>
//             <p className="text-green-400 text-[10px]">✓ Official Business</p>
//           </div>
//         </div>
//         <div
//           className="rounded-2xl rounded-tl-sm p-3"
//           style={{ background: "#1a2c1a" }}
//         >
//           <p
//             className="text-[12px] leading-relaxed"
//             style={{ color: "#e9edef" }}
//             dangerouslySetInnerHTML={{ __html: formatWA(text) }}
//           />
//         </div>
//         <p className="text-slate-500 text-[10px] text-right mt-2">
//           {text.length} chars
//         </p>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // CHANNEL CONFIG
// // ─────────────────────────────────────────────────────────────
// const CHANNEL_CONFIG = {
//   email: {
//     label: "Email",
//     icon: <Mail size={16} />,
//     color: "from-blue-600 to-cyan-500",
//     bg: "bg-blue-50",
//     border: "border-blue-200",
//     text: "text-blue-700",
//     description: "HTML email with header, body & footer",
//   },
//   sms: {
//     label: "SMS",
//     icon: <MessageSquare size={16} />,
//     color: "from-emerald-600 to-teal-500",
//     bg: "bg-emerald-50",
//     border: "border-emerald-200",
//     text: "text-emerald-700",
//     description: "160 character plain text",
//   },
//   whatsapp: {
//     label: "WhatsApp",
//     icon: <Send size={16} />,
//     color: "from-green-500 to-lime-500",
//     bg: "bg-green-50",
//     border: "border-green-200",
//     text: "text-green-700",
//     description: "Rich text with WhatsApp formatting",
//   },
// };

// // ─────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────
// const TemplateAIGenerator: React.FC<TemplateAIGeneratorProps> = ({
//   channel,
//   context = {},
//   geminiApiKey,
//   onInsert,
//   onClose,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [generated, setGenerated] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [error, setError] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [localCtx, setLocalCtx] = useState<AITemplateContext>({
//     companyName: "My Company",
//     companyColor: "#4F46E5",
//     companyWebsite: "https://mycompany.com",
//     companyAddress: "123 Business Street, London, UK",
//     ...context,
//   });

//   const cfg = CHANNEL_CONFIG[channel];

//   // ── Gemini API Call ───────────────────────────────────────
//   const generate = async () => {
//     // if (!geminiApiKey) {
//     //   setError("Gemini API key missing. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local");
//     //   return;
//     // }
//     setLoading(true);
//     setError("");
//     setGenerated("");
//     setShowPreview(false);

//     const promptMap = {
//       email: buildEmailPrompt,
//       sms: buildSMSPrompt,
//       whatsapp: buildWhatsAppPrompt,
//     };
//     const prompt = promptMap[channel](localCtx);

//     try {
//       const res = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDy_huvdJ4hbfjKo4zt1jqhoqsv3QVASb8`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: [{ parts: [{ text: prompt }] }],
//             generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
//           }),
//         }
//       );
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err?.error?.message || "Gemini API error");
//       }
//       const data = await res.json();
//       let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//       // Strip markdown code blocks if present
//       text = text.replace(/```html\n?/gi, "").replace(/```\n?/g, "").trim();
//       setGenerated(text);
//     } catch (e: any) {
//       setError(e.message || "Generation failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(generated);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleInsert = () => {
//     onInsert(generated);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

//       {/* Panel */}
//       <div className="relative bg-white w-full max-w-[640px] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">

//         {/* Header */}
//         <div className={`bg-gradient-to-r ${cfg.color} p-5 flex items-center justify-between flex-shrink-0`}>
//           <div className="flex items-center gap-3">
//             <div className="bg-white/20 p-2 rounded-xl text-white">{cfg.icon}</div>
//             <div>
//               <h3 className="text-white font-bold text-[15px]">
//                 AI {cfg.label} Template Generator
//               </h3>
//               <p className="text-white/70 text-xs mt-0.5">
//                 {cfg.description} • Powered by Gemini
//               </p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Scrollable Body */}
//         <div className="overflow-y-auto flex-1 p-5 space-y-4">

//           {/* Context Fields */}
//           <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
//             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//               Template Context
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               {/* Customer Name */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
//                   <User size={11} /> Customer Name
//                 </label>
//                 <input value={localCtx.customerName || ""} onChange={(e) => setLocalCtx({ ...localCtx, customerName: e.target.value })}
//                   placeholder="{{customerName}}"
//                   className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400" />
//               </div>

//               {/* Template Type */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
//                   <Tag size={11} /> Template Type
//                 </label>
//                 <div className="relative">
//                   <select value={localCtx.templateType || ""}
//                     onChange={(e) => setLocalCtx({ ...localCtx, templateType: e.target.value })}
//                     className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400 appearance-none cursor-pointer">
//                     <option value="">Select type...</option>
//                     <option value="Customer Registration">Customer Registration</option>
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
//                     <option value="Promotional Offer">Promotional Offer</option>
//                   </select>
//                   <ChevronDown size={13} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
//                   <Mail size={11} /> Customer Email
//                 </label>
//                 <input value={localCtx.customerEmail || ""} onChange={(e) => setLocalCtx({ ...localCtx, customerEmail: e.target.value })}
//                   placeholder="{{customerEmail}}"
//                   className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400" />
//               </div>

//               {/* Phone */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
//                   <Phone size={11} /> Customer Phone
//                 </label>
//                 <input value={localCtx.customerPhone || ""} onChange={(e) => setLocalCtx({ ...localCtx, customerPhone: e.target.value })}
//                   placeholder="{{customerPhone}}"
//                   className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400" />
//               </div>
//             </div>

//             {/* Company fields — email only */}
//             {channel === "email" && (
//               <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
//                 <div className="space-y-1">
//                   <label className="text-[11px] font-bold text-slate-600">Company Name</label>
//                   <input value={localCtx.companyName || ""} onChange={(e) => setLocalCtx({ ...localCtx, companyName: e.target.value })}
//                     placeholder="My Company"
//                     className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[11px] font-bold text-slate-600">Brand Color</label>
//                   <div className="flex gap-2">
//                     <input type="color" value={localCtx.companyColor || "#4F46E5"}
//                       onChange={(e) => setLocalCtx({ ...localCtx, companyColor: e.target.value })}
//                       className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white" />
//                     <input value={localCtx.companyColor || "#4F46E5"}
//                       onChange={(e) => setLocalCtx({ ...localCtx, companyColor: e.target.value })}
//                       className="flex-1 h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400 font-mono" />
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[11px] font-bold text-slate-600">Website</label>
//                   <input value={localCtx.companyWebsite || ""} onChange={(e) => setLocalCtx({ ...localCtx, companyWebsite: e.target.value })}
//                     placeholder="https://mycompany.com"
//                     className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[11px] font-bold text-slate-600">Address (footer)</label>
//                   <input value={localCtx.companyAddress || ""} onChange={(e) => setLocalCtx({ ...localCtx, companyAddress: e.target.value })}
//                     placeholder="123 Street, City, Country"
//                     className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400" />
//                 </div>
//               </div>
//             )}

//             {/* Extra */}
//             <div className="space-y-1">
//               <label className="text-[11px] font-bold text-slate-600">Additional Instructions</label>
//               <textarea value={localCtx.extraContext || ""}
//                 onChange={(e) => setLocalCtx({ ...localCtx, extraContext: e.target.value })}
//                 placeholder={
//                   channel === "email"
//                     ? "e.g. Customer just registered. Include their details and next steps."
//                     : channel === "sms"
//                     ? "e.g. Appointment reminder for tomorrow at 2pm."
//                     : "e.g. Order shipped, tracking link should be mentioned."
//                 }
//                 rows={2}
//                 className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-blue-400 resize-none" />
//             </div>
//           </div>

//           {/* Generate Button */}
//           <button type="button" onClick={generate} disabled={loading}
//             className={`w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r ${cfg.color} shadow-lg hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60`}>
//             {loading ? (
//               <><Loader2 size={18} className="animate-spin" /> Generating with Gemini...</>
//             ) : (
//               <><Sparkles size={18} /> Generate {cfg.label} Template</>
//             )}
//           </button>

//           {/* Error */}
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] flex items-start gap-2">
//               <X size={16} className="mt-0.5 shrink-0" /> {error}
//             </div>
//           )}

//           {/* Result */}
//           {generated && (
//             <div className="space-y-3">
//               {/* Action bar */}
//               <div className="flex items-center justify-between">
//                 <span className={`text-[12px] font-bold uppercase tracking-wider ${cfg.text}`}>
//                   ✅ Template Generated
//                 </span>
//                 <div className="flex items-center gap-2">
//                   {channel === "email" && (
//                     <button type="button" onClick={() => setShowPreview(!showPreview)}
//                       className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
//                       {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
//                       {showPreview ? "Code" : "Preview"}
//                     </button>
//                   )}
//                   <button type="button" onClick={handleCopy}
//                     className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
//                     {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
//                     {copied ? "Copied!" : "Copy"}
//                   </button>
//                 </div>
//               </div>

//               {/* Preview / Code */}
//               {channel === "email" && showPreview ? (
//                 <EmailHTMLPreview html={generated} />
//               ) : channel === "sms" ? (
//                 <SMSPreview text={generated} />
//               ) : channel === "whatsapp" ? (
//                 <WhatsAppPreview text={generated} />
//               ) : (
//                 <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-48 overflow-y-auto">
//                   <pre className="text-[12px] text-slate-700 whitespace-pre-wrap font-mono">
//                     {generated}
//                   </pre>
//                 </div>
//               )}

//               {/* Buttons */}
//               <div className="grid grid-cols-2 gap-3">
//                 <button type="button" onClick={generate}
//                   className={`py-2.5 rounded-xl font-bold ${cfg.text} ${cfg.bg} border ${cfg.border} hover:opacity-80 transition-colors text-[13px] flex items-center justify-center gap-1.5`}>
//                   <RefreshCw size={14} /> Regenerate
//                 </button>
//                 <button type="button" onClick={handleInsert}
//                   className={`py-2.5 rounded-xl font-bold text-white bg-gradient-to-r ${cfg.color} shadow-md hover:opacity-90 text-[13px]`}>
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

// export default TemplateAIGenerator;


// // ─────────────────────────────────────────────────────────────
// // USAGE EXAMPLES
// // ─────────────────────────────────────────────────────────────
// /*

// // ── 1. Email Template ────────────────────────────────────────
// import TemplateAIGenerator from "@/components/ui/TemplateAIGenerator";

// const [showAI, setShowAI] = useState(false);
// const [emailBody, setEmailBody] = useState("");

// {showAI && (
//   <TemplateAIGenerator
//     channel="email"
//     geminiApiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY!}
//     context={{
//       customerName: customer.name,
//       customerEmail: customer.email,
//       customerPhone: customer.phone,
//       templateType: "Customer Registration",
//       companyName: "Tech Solutions Ltd",
//       companyColor: "#4F46E5",
//       companyWebsite: "https://techsolutions.com",
//       companyAddress: "123 Tech Street, London, UK EC1A 1BB",
//     }}
//     onInsert={(html) => setValue("templateBody", html)}
//     onClose={() => setShowAI(false)}
//   />
// )}


// // ── 2. SMS Template ──────────────────────────────────────────
// <TemplateAIGenerator
//   channel="sms"
//   geminiApiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY!}
//   context={{
//     customerName: "John Smith",
//     templateType: "Appointment Reminder",
//     companyName: "Health Clinic",
//   }}
//   onInsert={(text) => setValue("templateBody", text)}
//   onClose={() => setShowAI(false)}
// />


// // ── 3. WhatsApp Template ─────────────────────────────────────
// <TemplateAIGenerator
//   channel="whatsapp"
//   geminiApiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY!}
//   context={{
//     customerName: "Sarah Wilson",
//     templateType: "Order Confirmation",
//     companyName: "Online Store",
//   }}
//   onInsert={(text) => setValue("templateBody", text)}
//   onClose={() => setShowAI(false)}
// />

// */




"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered,
  Code, Eye, EyeOff, Hash, AlignLeft, AlignCenter,
  AlignRight, Link, Type,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface HtmlTemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables?: { key: string; label?: string }[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  isEmailChannel?: boolean;   // true = HTML mode, false = plain text
  channelType?: "email" | "sms" | "whatsapp";
  minHeight?: string;
}

// ─────────────────────────────────────────────────────────────
// VARIABLE CHIP — renders {{var}} as styled badge in display
// ─────────────────────────────────────────────────────────────
const highlightVariables = (html: string): string => {
  // Replace {{variable}} with styled span for display only
  return html.replace(
    /\{\{(\w+)\}\}/g,
    `<span style="background:#EEF2FF;color:#4F46E5;padding:1px 6px;border-radius:6px;
     font-size:12px;font-weight:600;border:1px solid #C7D2FE;white-space:nowrap;
     font-family:monospace;">{{$1}}</span>`,
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN EDITOR
// ─────────────────────────────────────────────────────────────
const HtmlTemplateEditor: React.FC<HtmlTemplateEditorProps> = ({
  value,
  onChange,
  variables = [],
  placeholder = "Template content will appear here...",
  label,
  required = false,
  isEmailChannel = true,
  channelType = "email",
  minHeight = "min-h-[200px]",
}) => {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isUpdatingRef = useRef(false);

  // ── Sync value → editor (visual mode) ───────────────────
  useEffect(() => {
    if (mode === "visual" && editorRef.current && !isUpdatingRef.current) {
      const html = isEmailChannel ? value : escapeForDisplay(value);
      editorRef.current.innerHTML = html || "";
    }
  }, [value, mode, isEmailChannel]);

  const escapeForDisplay = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

  // ── Editor input → value ─────────────────────────────────
  const handleEditorInput = useCallback(() => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = isEmailChannel
      ? editorRef.current.innerHTML
      : editorRef.current.innerText;
    onChange(html);
    setTimeout(() => { isUpdatingRef.current = false; }, 0);
  }, [onChange, isEmailChannel]);

  // ── Code textarea → value ────────────────────────────────
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // ── execCommand toolbar ──────────────────────────────────
  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleEditorInput();
  };

  // ── Insert variable at cursor ────────────────────────────
  const insertVariable = (key: string) => {
    const token = `{{${key}}}`;

    if (mode === "code") {
      // Insert into textarea at cursor
      const ta = textareaRef.current;
      if (ta) {
        const s = ta.selectionStart;
        const e = ta.selectionEnd;
        const newVal = value.substring(0, s) + token + value.substring(e);
        onChange(newVal);
        setTimeout(() => {
          ta.focus();
          ta.setSelectionRange(s + token.length, s + token.length);
        }, 0);
      }
    } else {
      // Insert at cursor in contenteditable
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
        // Fallback: append
        onChange(value + token);
      }
    }
  };

  // ── WhatsApp formatting helpers ──────────────────────────
  const wrapSelection = (prefix: string, suffix = prefix) => {
    const ta = textareaRef.current || (mode === "visual" ? null : null);
    if (mode === "code" && textareaRef.current) {
      const el = textareaRef.current;
      const s = el.selectionStart;
      const e = el.selectionEnd;
      const selected = value.substring(s, e);
      const newVal = value.substring(0, s) + prefix + selected + suffix + value.substring(e);
      onChange(newVal);
    } else if (mode === "visual") {
      exec("bold"); // fallback
    }
  };

  const isEmail = channelType === "email";
  const isWA = channelType === "whatsapp";
  const isSMS = channelType === "sms";

  // ── Character count for SMS ──────────────────────────────
  const charCount = value.replace(/<[^>]*>/g, "").length;

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Editor Container */}
      <div className={`border rounded-xl overflow-visible transition-all ${
        isFocused ? "border-indigo-400 shadow-sm shadow-indigo-100" : "border-slate-200"
      }`}>

        {/* ── Toolbar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-0.5">
            {isEmail && mode === "visual" && (
              <>
                {[
                  { icon: <Bold size={14} />, cmd: "bold", title: "Bold" },
                  { icon: <Italic size={14} />, cmd: "italic", title: "Italic" },
                  { icon: <Underline size={14} />, cmd: "underline", title: "Underline" },
                ].map((b) => (
                  <button key={b.cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(b.cmd); }}
                    title={b.title}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                    {b.icon}
                  </button>
                ))}
                <div className="w-px h-4 bg-slate-200 mx-1" />
                {[
                  { icon: <AlignLeft size={14} />, cmd: "justifyLeft" },
                  { icon: <AlignCenter size={14} />, cmd: "justifyCenter" },
                  { icon: <AlignRight size={14} />, cmd: "justifyRight" },
                ].map((b) => (
                  <button key={b.cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(b.cmd); }}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                    {b.icon}
                  </button>
                ))}
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                  <List size={14} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                  <ListOrdered size={14} />
                </button>
              </>
            )}

            {isWA && (
              <>
                {[
                  { icon: <Bold size={14} />, prefix: "*", title: "Bold (*text*)" },
                  { icon: <Italic size={14} />, prefix: "_", title: "Italic (_text_)" },
                  { icon: <Type size={14} />, prefix: "~", title: "Strikethrough (~text~)" },
                ].map((b, i) => (
                  <button key={i} type="button"
                    onMouseDown={(e) => { e.preventDefault(); wrapSelection(b.prefix); }}
                    title={b.title}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                    {b.icon}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Mode Toggle — email only */}
          {isEmail && (
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setMode("visual")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  mode === "visual"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Eye size={11} /> Visual
              </button>
              <button
                type="button"
                onClick={() => setMode("code")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  mode === "code"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Code size={11} /> HTML
              </button>
            </div>
          )}
        </div>

        {/* ── Visual Editor ────────────────────────────────── */}
        {(mode === "visual" || !isEmail) && !isSMS && (
          <div
            ref={editorRef}
            contentEditable={isEmail}
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${minHeight} p-4 outline-none text-[13px] leading-relaxed text-slate-800 overflow-y-auto`}
            style={{
              minHeight: "180px",
              fontFamily: isEmail ? "inherit" : "'Segoe UI', sans-serif",
              whiteSpace: isEmail ? "normal" : "pre-wrap",
            }}
            data-placeholder={placeholder}
          />
        )}

        {/* ── Code View / SMS / Plain text ─────────────────── */}
        {(mode === "code" || isSMS) && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleCodeChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full ${minHeight} p-4 outline-none resize-y ${
              mode === "code"
                ? "font-mono text-[11px] text-green-400 bg-slate-900"
                : "text-[13px] text-slate-800 bg-white"
            } leading-relaxed`}
          />
        )}
      </div>

      {/* ── Variables ──────────────────────────────────────── */}
      {variables.length > 0 && (
        <div className="mt-2">
          <p className="text-[11px] font-semibold text-indigo-600 mb-1.5">
            Available Variables — click to insert at cursor:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {variables.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertVariable(v.key)}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600
                           hover:text-white text-indigo-600 rounded-lg text-[11px] font-mono
                           border border-indigo-100 hover:border-indigo-600 transition-all"
              >
                <Hash size={10} /> {`{{${v.key}}}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer info ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-400">
          {isEmail && mode === "visual" && "Editing in visual mode — HTML is preserved"}
          {isEmail && mode === "code" && "Editing raw HTML — variables shown as {{variable}}"}
          {isWA && "Use *bold*, _italic_, ~strikethrough~ for WhatsApp formatting"}
          {isSMS && "Plain text only — keep under 160 characters"}
        </p>
        {isSMS && (
          <span className={`text-[11px] font-bold ${charCount > 160 ? "text-red-500" : "text-slate-400"}`}>
            {charCount}/160
          </span>
        )}
      </div>
    </div>
  );
};

// ── CSS to handle placeholder ────────────────────────────────
// Add to globals.css:
// [contenteditable]:empty:before {
//   content: attr(data-placeholder);
//   color: #94a3b8;
//   font-size: 13px;
// }

export default HtmlTemplateEditor;