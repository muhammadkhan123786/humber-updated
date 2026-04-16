// components/NotificationTemplateForm/AIPanel/index.tsx
"use client";
import { useState } from "react";
import { Loader2, X, Sparkles, RefreshCw, Copy, Check, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AIPanelProps, ChannelType } from "../types";

const CHANNEL_UI = {
  email: { gradient: "from-blue-600 to-indigo-600", text: "text-blue-700", badge: "bg-blue-50 text-blue-700 border-blue-200", icon: "📧" },
  sms: { gradient: "from-emerald-600 to-teal-600", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "📱" },
  whatsapp: { gradient: "from-green-500 to-lime-600", text: "text-green-700", badge: "bg-green-50 text-green-700 border-green-200", icon: "💬" },
};

export const AIPanel: React.FC<AIPanelProps> = ({
  channel, eventName, eventDescription, variables, onInsert, onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ subject: string; templateBody: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");

  const ui = CHANNEL_UI[channel];

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/ai-templates/generate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelType: channel,
          eventName,
          eventDescription: eventDescription || "",
          variables: variables.map((v) => ({ key: v.key, label: v.label || v.key })),
          additionalContext,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");

      setResult({ subject: data.data.subject, templateBody: data.data.templateBody });
    } catch (e: any) {
      setError(e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.templateBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied!");
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[640px] rounded-3xl shadow-2xl z-10 flex flex-col max-h-[88vh] overflow-hidden">

        {/* ✅ Header with Centered Icon */}
        <div className={`bg-gradient-to-r ${ui.gradient} p-5 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-3">
            {/* ✅ Channel Icon - Centered with text */}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl">
              {ui.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-[15px]">AI {channel.toUpperCase()} Generator</h3>
              <p className="text-white/70 text-xs mt-0.5">{eventName} • Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          
          {/* ✅ Variables Section with better styling */}
          {variables.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🔧</span>
                <p className="text-[12px] font-bold text-indigo-700">Available Variables</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {variables.map((v, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-[12px] font-mono border border-indigo-200 shadow-sm">
                    {`{{${v.key}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-slate-600 flex items-center gap-1">
              <span>✨</span> Extra Instructions <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="e.g., Make it urgent, include a discount code, focus on customer appreciation..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button 
            onClick={generate} 
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r ${ui.gradient} shadow-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Generating with AI...</>
            ) : (
              <><Sparkles size={18} /> Generate {channel.toUpperCase()} Template</>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] flex gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Result Section */}
          {result && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-bold uppercase tracking-wider ${ui.text} flex items-center gap-1`}>
                  <span>✅</span> Template Generated
                </span>
                <div className="flex gap-2">
                  {channel === "email" && (
                    <button 
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                      {showPreview ? "Show Code" : "Preview"}
                    </button>
                  )}
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Subject Preview */}
              {result.subject && (
                <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 shrink-0 mt-0.5">📝 SUBJECT:</span>
                  <span className="text-[13px] font-semibold text-slate-800 break-words">{result.subject}</span>
                </div>
              )}

              {/* Body Preview */}
              {channel === "email" && showPreview ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[11px] text-slate-500 ml-1">📧 Live Email Preview</span>
                  </div>
                  <div className="h-[350px] overflow-auto bg-slate-100">
                    <iframe 
                      srcDoc={result.templateBody} 
                      className="w-full h-full border-0"
                      title="Email Preview" 
                      sandbox="allow-same-origin allow-scripts" 
                    />
                  </div>
                </div>
              ) : channel === "email" && !showPreview ? (
                <div className="bg-slate-900 rounded-xl p-3 max-h-40 overflow-auto">
                  <pre className="text-green-400 text-[11px] font-mono whitespace-pre-wrap break-words">
                    {result.templateBody.substring(0, 800)}...
                  </pre>
                </div>
              ) : channel === "sms" ? (
                <div className="flex justify-center py-3">
                  <div className="w-72 bg-slate-800 rounded-2xl p-4">
                    <div className="bg-slate-700 rounded-xl rounded-tl-none p-3">
                      <p className="text-white text-[13px] leading-relaxed whitespace-pre-wrap">
                        {result.templateBody}
                      </p>
                    </div>
                    <p className={`text-[10px] text-right mt-2 ${result.templateBody.length > 160 ? "text-red-400" : "text-slate-500"}`}>
                      📱 {result.templateBody.length}/160 characters
                    </p>
                  </div>
                </div>
              ) : channel === "whatsapp" ? (
                <div className="flex justify-center py-3">
                  <div className="w-80 rounded-2xl p-4" style={{ background: "#0b141a" }}>
                    <div className="rounded-xl rounded-tl-none p-3" style={{ background: "#202c33" }}>
                      <div
                        className="text-[13px] leading-relaxed"
                        style={{ color: "#e9edef" }}
                        dangerouslySetInnerHTML={{
                          __html: result.templateBody
                            .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
                            .replace(/_(.*?)_/g, "<em>$1</em>")
                            .replace(/~(.*?)~/g, "<s>$1</s>")
                            .replace(/\n/g, "<br/>"),
                        }}
                      />
                      <div className="flex justify-end mt-2">
                        <span className="text-[10px]" style={{ color: "#8696a0" }}>✓✓ Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={generate}
                  className={`py-2.5 rounded-xl font-semibold ${ui.text} ${ui.badge} border hover:opacity-80 text-[13px] flex items-center justify-center gap-1.5 transition-colors`}
                >
                  <RefreshCw size={14} /> Regenerate
                </button>
                <button 
                  onClick={() => { 
                    onInsert(result.subject, result.templateBody); 
                    onClose(); 
                    toast.success("Template inserted into form!");
                  }}
                  className={`py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r ${ui.gradient} shadow-md hover:opacity-90 text-[13px] transition-all flex items-center justify-center gap-1.5`}
                >
                  <span>✓</span> Insert into Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};