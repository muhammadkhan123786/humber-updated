// components/NotificationTemplateForm/AIPanel/index.tsx
"use client";
import { useState } from "react";
import { Loader2, X, Sparkles, RefreshCw, Copy, Check, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AIPanelProps, ChannelType } from "../types";

const CHANNEL_UI = {
  email: { gradient: "from-blue-600 to-indigo-600", text: "text-blue-700", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  sms: { gradient: "from-emerald-600 to-teal-600", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  whatsapp: { gradient: "from-green-500 to-lime-600", text: "text-green-700", badge: "bg-green-50 text-green-700 border-green-200" },
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

        {/* Header */}
        <div className={`bg-gradient-to-r ${ui.gradient} p-5 flex items-center justify-between flex-shrink-0`}>
          <div>
            <h3 className="text-white font-bold text-[15px]">AI {channel.toUpperCase()} Generator</h3>
            <p className="text-white/70 text-xs mt-0.5">{eventName} • Powered by Gemini</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Variables */}
          {variables.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-[11px] font-bold text-indigo-600 mb-2">Variables:</p>
              <div className="flex flex-wrap gap-1.5">
                {variables.map((v, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white text-indigo-600 rounded-lg text-[11px] font-mono">
                    {`{{${v.key}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Extra instructions (optional)..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] outline-none focus:border-indigo-400"
          />

          {/* Generate Button */}
          <button onClick={generate} disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r ${ui.gradient} shadow-lg disabled:opacity-60`}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate Template</>}
          </button>

          {error && <div className="p-3 bg-red-50 rounded-xl text-red-600 text-[13px]">{error}</div>}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-[12px] font-bold ${ui.text}`}>✅ Generated</span>
                <div className="flex gap-2">
                  {channel === "email" && (
                    <button onClick={() => setShowPreview(!showPreview)} className="flex gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg bg-slate-100">
                      {showPreview ? <EyeOff size={13} /> : <Eye size={13} />} {showPreview ? "Code" : "Preview"}
                    </button>
                  )}
                  <button onClick={handleCopy} className="flex gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg bg-slate-100">
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {result.subject && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-500">SUBJECT:</span>
                  <span className="text-[13px] font-semibold ml-2">{result.subject}</span>
                </div>
              )}

              {channel === "email" && showPreview ? (
                <div className="h-[300px] overflow-auto bg-slate-100 rounded-xl">
                  <iframe srcDoc={result.templateBody} className="w-full h-full border-0" />
                </div>
              ) : (
                <div className="bg-slate-900 rounded-xl p-3 max-h-36 overflow-auto">
                  <pre className="text-green-400 text-[11px] font-mono">{result.templateBody.substring(0, 500)}...</pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={generate} className={`py-2.5 rounded-xl font-bold ${ui.text} ${ui.badge} border`}>
                  <RefreshCw size={13} className="inline mr-1" /> Regenerate
                </button>
                <button onClick={() => { onInsert(result.subject, result.templateBody); onClose(); }}
                  className={`py-2.5 rounded-xl font-bold text-white bg-gradient-to-r ${ui.gradient}`}>
                  Insert into Form ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};