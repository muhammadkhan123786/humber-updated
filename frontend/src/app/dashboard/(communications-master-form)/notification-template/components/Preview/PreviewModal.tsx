'use client';
import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { getRenderedContent } from '../../utils/formatters';
import { TemplateItem } from '../../types';

interface PreviewModalProps {
  item: TemplateItem;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ item, onClose }) => {
  const [previewMode, setPreviewMode] = useState<'rendered' | 'raw'>('rendered');
  const channelName = item.channelId?.channelId?.channelName || item.channelId?.channelName || 'Email';
  const isWhatsApp = channelName.toLowerCase().includes('whatsapp');
  const isSMS = channelName.toLowerCase().includes('sms') || channelName.toLowerCase().includes('text');
  const isEmail = !isWhatsApp && !isSMS;

  if (!item) return null;

  const renderedContent = getRenderedContent(item.templateBody, isWhatsApp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-4xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Eye size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 truncate max-w-[300px]">
              Template Preview
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-slate-100">
          <button
            onClick={() => setPreviewMode('rendered')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              previewMode === 'rendered'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isWhatsApp ? '💬 WhatsApp Preview' : isSMS ? '📱 SMS Preview' : '📧 Email Preview'}
          </button>
          <button
            onClick={() => setPreviewMode('raw')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              previewMode === 'raw'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {'</>'} Raw Content
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="space-y-1.5 mb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
            <div>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                {item.eventKeyId?.module || 'Service'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 mb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</label>
            <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-2xl text-slate-700 font-semibold leading-relaxed">
              {item.subject || 'No Subject'}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Body</label>

            {previewMode === 'rendered' ? (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-500 ml-2">
                    {isWhatsApp ? 'WhatsApp Preview' : isSMS ? 'SMS Preview' : 'Email Preview'}
                  </span>
                </div>
                <div className="h-[450px] overflow-auto p-4" style={isWhatsApp ? { background: '#0b141a' } : { background: '#ffffff' }}>
                  {isWhatsApp ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#005c4b] rounded-2xl rounded-tr-none px-3 py-2">
                        <div
                          className="text-[13px] leading-relaxed text-white"
                          dangerouslySetInnerHTML={{ __html: renderedContent }}
                        />
                        <div className="flex justify-end items-center gap-1 mt-1">
                          <span className="text-[9px] text-[#8696a0]">✓✓</span>
                        </div>
                      </div>
                    </div>
                  ) : isSMS ? (
                    <div className="max-w-sm mx-auto">
                      <div className="bg-slate-800 rounded-2xl p-4">
                        <div className="bg-slate-700 rounded-xl p-3">
                          <p className="text-white text-sm">{renderedContent}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={renderedContent}
                      className="w-full h-full border-0"
                      title="Email Preview"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  )}
                </div>
              </div>
            ) : (
              <pre className="bg-gray-900 text-green-400 p-6 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[500px] overflow-y-auto">
                {item.templateBody || 'No content'}
              </pre>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">
            Close
          </button>
          <button onClick={onClose} className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};