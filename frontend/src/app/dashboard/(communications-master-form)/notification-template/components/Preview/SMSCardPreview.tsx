import React from 'react';
import { MessageSquare } from 'lucide-react';

interface SMSCardPreviewProps {
  text: string;
}

export const SMSCardPreview: React.FC<SMSCardPreviewProps> = ({ text }) => {
  const charCount = text.length;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700">
        <MessageSquare size={14} className="text-emerald-400" />
        <span className="text-white text-[11px] font-medium">SMS Message</span>
        <span className={`text-[9px] ml-auto ${charCount > 160 ? 'text-red-400' : 'text-slate-400'}`}>
          {charCount}/160
        </span>
      </div>
      <div className="p-3">
        <div className="bg-slate-700 rounded-xl p-2">
          <p className="text-white text-[12px] leading-relaxed break-words">
            {text || <em className="text-slate-400">Empty message</em>}
          </p>
        </div>
      </div>
    </div>
  );
};