import { TemplatePreview } from '../types';

// Sample data for preview
const SAMPLE_DATA: Record<string, string> = {
  userName: 'John Doe',
  customerName: 'John Doe',
  userEmail: 'john.doe@example.com',
  email: 'john.doe@example.com',
  userPhone: '+1 (555) 123-4567',
  phone: '+1 (555) 123-4567',
  companyName: 'Acme Inc.',
  customerEmail: 'customer@example.com',
  customerPhone: '+1 (555) 987-6543',
  orderId: 'ORD-12345',
  transactionAmount: '$99.99',
  ticketNumber: 'TKT-12345',
  status: 'Open',
  technicianName: 'Mike Smith',
  reason: 'Customer request',
  completedDate: '2024-01-15',
  invoiceNumber: 'INV-12345',
  dueDate: '2024-02-15',
  amount: '$1,299.99',
  paidAmount: '$500.00',
  quotationNumber: 'QT-12345',
  poNumber: 'PO-12345',
  supplierName: 'Tech Supplies Co.',
  supportEmail: 'support@acme.com',
  supportPhone: '+1 (555) 000-0000',
};

// Format WhatsApp message with markdown
export const formatWhatsAppMessage = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<s>$1</s>')
    .replace(/\n/g, '<br/>');
};

// Format SMS message (plain text)
export const formatSMSMessage = (text: string): string => {
  if (!text) return '';
  return text;
};

// Format Email message (strip HTML for card view)
export const formatEmailMessage = (html: string, maxLength: number = 200): string => {
  if (!html) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  let text = tempDiv.textContent || tempDiv.innerText || '';
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  return text;
};

// Replace variables with sample data
const replaceVariables = (text: string): string => {
  let processed = text;
  Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value);
  });
  return processed.replace(/{{[^}]+}}/g, '');
};

// Main render function
export const renderTemplatePreview = (
  templateBody: string,
  channelName: string,
  isCardView: boolean = true
): TemplatePreview | string => {
  if (!templateBody) return isCardView ? '' : { type: 'email', content: '', raw: '' };

  const processedText = replaceVariables(templateBody);
  const channelLower = channelName.toLowerCase();

  // WhatsApp channel
  if (channelLower.includes('whatsapp')) {
    const formatted = formatWhatsAppMessage(processedText);
    if (isCardView) {
      return { type: 'whatsapp', content: formatted, raw: processedText };
    }
    return { type: 'whatsapp', content: formatted, raw: processedText };
  }

  // SMS channel
  if (channelLower.includes('sms') || channelLower.includes('text')) {
    let text = formatSMSMessage(processedText);
    if (isCardView && text.length > 200) {
      text = text.substring(0, 200) + '...';
    }
    return { type: 'sms', content: text, raw: processedText };
  }

  // Email channel
  if (isCardView) {
    return { type: 'email', content: formatEmailMessage(processedText), raw: processedText };
  }
  return { type: 'email', content: processedText, raw: processedText };
};

// Get rendered content for preview modal
export const getRenderedContent = (templateBody: string, isWhatsApp: boolean): string => {
  if (!templateBody) return '<p>No content available</p>';
  const content = replaceVariables(templateBody);
  if (isWhatsApp) {
    return formatWhatsAppMessage(content);
  }
  return content;
};

// Get channel display info
export const getChannelDisplay = (item: any) => {
  const channelName = item.channelId?.channelId?.channelName || item.channelId?.channelName || 'Email';
  const isWhatsApp = channelName.toLowerCase().includes('whatsapp');
  const isSMS = channelName.toLowerCase().includes('sms') || channelName.toLowerCase().includes('text');
  const isEmail = !isWhatsApp && !isSMS;
  return { channelName, isWhatsApp, isSMS, isEmail };
};

// Get channel styles
export const getChannelStyles = (channelName: string, isActive: boolean): string => {
  const name = channelName?.toLowerCase() || '';
  if (name.includes('whatsapp')) {
    return isActive 
      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' 
      : 'text-slate-600 hover:bg-teal-50';
  }
  if (name.includes('sms') || name.includes('text') || name.includes('message')) {
    return isActive 
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
      : 'text-slate-600 hover:bg-green-50';
  }
  if (name.includes('mail') || name.includes('email')) {
    return isActive 
      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
      : 'text-slate-600 hover:bg-blue-50';
  }
  return isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100';
};