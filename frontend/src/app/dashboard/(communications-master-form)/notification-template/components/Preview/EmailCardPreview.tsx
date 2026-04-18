// components/NotificationTemplateClient/components/EmailCardPreview.tsx
'use client';
import React, { useState } from 'react';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface EmailCardPreviewProps {
  text: string;
  rawHtml?: string;
}

export const EmailCardPreview: React.FC<EmailCardPreviewProps> = ({ text, rawHtml }) => {
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  // Function to clean HTML and extract plain text
  const cleanHtmlToPlainText = (html: string): string => {
    if (!html) return 'No email content available';
    
    // Remove CSS styles and media queries
    let cleaned = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    cleaned = cleaned.replace(/@media[^{]*\{[\s\S]*?\}/gi, '');
    
    // Remove script tags
    cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Remove HTML tags and get text content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleaned;
    let plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up whitespace and line breaks
    plainText = plainText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Preserve paragraph breaks
      .trim();
    
    return plainText;
  };

  // Get clean plain text
  const getPlainText = () => {
    const content = rawHtml || text;
    return cleanHtmlToPlainText(content);
  };

  const plainText = getPlainText();
  const charCount = plainText.length;
  
  // Truncate text for preview
  const displayText = showFullPreview 
    ? plainText 
    : plainText.length > 200 
      ? plainText.substring(0, 200) + '...' 
      : plainText;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Email Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <Mail size={12} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700">Email Message</span>
        </div>
        <button
          onClick={() => setShowFullPreview(!showFullPreview)}
          className="p-1 rounded hover:bg-white/50 transition-colors text-slate-400 hover:text-slate-600"
          title={showFullPreview ? 'Collapse' : 'Expand'}
        >
          {showFullPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Email Body Preview - Plain Text Only */}
      <div className={`p-3 bg-white ${showFullPreview ? '' : 'max-h-[120px] overflow-hidden'}`}>
        <div className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
          {displayText || <em className="text-slate-400">No email content available</em>}
        </div>
      </div>

      {/* Email Footer */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400">📧 {charCount} characters</span>
          <span className="text-[9px] text-slate-400">•</span>
          <span className="text-[9px] text-slate-400">Plain Text</span>
        </div>
        {charCount > 200 && (
          <button
            onClick={() => setShowFullPreview(!showFullPreview)}
            className="text-[9px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
          >
            {showFullPreview ? 'Show Less' : `Read More (${charCount - 200} more chars)`}
          </button>
        )}
      </div>
    </div>
  );
};