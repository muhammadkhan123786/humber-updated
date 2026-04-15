// common/IAiEmail.interface.ts

export type TemplateChannel = 'email' | 'sms' | 'whatsapp';

// ── Request sent from frontend → backend ─────────────────────
export interface GenerateTemplateRequest {
  channelType: TemplateChannel;   // 'email' | 'sms' | 'whatsapp'
  eventName: string;              // e.g. "Customer Registered"
  eventDescription?: string;     // e.g. "Fired when a new customer registers"
  variables: VariableItem[];      // e.g. [{key:"customerName", label:"Customer Name"}]
  additionalContext?: string;

  // Company branding (used in email header/footer)
  companyName?: string;
  companyColor?: string;          // hex e.g. "#4F46E5"
  companyWebsite?: string;
  companyAddress?: string;
  companyLogoUrl?: string;
}

export interface VariableItem {
  key: string;     // e.g. "customerName"
  label?: string;  // e.g. "Customer Name"
}

// ── What Gemini returns (parsed JSON) ────────────────────────
export interface GeminiParsedResponse {
  subject: string;
  body: string;        // For email: just the body content (no header/footer)
  colors?: EmailColors;
}

// ── Final data returned to frontend ──────────────────────────
export interface GeneratedTemplateData {
  subject: string;
  templateBody: string;   // Full HTML (email) or plain text (sms/whatsapp)
  channelType: TemplateChannel;
  colors?: EmailColors;
}

export interface EmailColors {
  primary: string;
  secondary: string;
  accent?: string;
}

// ── API Response wrapper ──────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}