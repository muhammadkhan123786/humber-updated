import React from 'react';
import { formatWhatsAppMessage } from '../../utils/formatters';

interface WhatsAppCardPreviewProps {
  text: string;
}

export const WhatsAppCardPreview: React.FC<WhatsAppCardPreviewProps> = ({ text }) => {
  const formattedText = formatWhatsAppMessage(text);
  const charCount = text.length;

  return (
    <div className="bg-[#0b141a] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#202c33] border-b border-[#2a3942]">
        <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">WA</span>
        </div>
        <span className="text-white text-[11px] font-medium">WhatsApp Message</span>
        <span className="text-[#8696a0] text-[9px] ml-auto">{charCount} chars</span>
      </div>
      <div className="p-3">
        <div className="bg-[#005c4b] rounded-2xl rounded-tl-none px-3 py-2 max-w-full">
          <div
            className="text-[12px] leading-relaxed text-white"
            dangerouslySetInnerHTML={{
              __html: formattedText || '<em class="text-[#8696a0]">Empty message</em>',
            }}
          />
          <div className="flex justify-end items-center gap-1 mt-1">
            <span className="text-[9px] text-[#8696a0]">✓✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};