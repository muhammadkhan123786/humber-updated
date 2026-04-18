import React from 'react';

interface EmailCardPreviewProps {
  text: string;
}

export const EmailCardPreview: React.FC<EmailCardPreviewProps> = ({ text }) => {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 min-h-[80px] overflow-y-auto border border-slate-100">
      {text || <em className="text-slate-400">No content</em>}
    </div>
  );
};