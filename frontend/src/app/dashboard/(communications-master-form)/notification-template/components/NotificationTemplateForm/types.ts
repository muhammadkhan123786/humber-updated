// components/NotificationTemplateForm/types.ts
export type ChannelType = "email" | "sms" | "whatsapp";

export interface ChannelUI {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  badge: string;
  text: string;
}

export interface Variable {
  key: string;
  label?: string;
}

export interface AIPanelProps {
  channel: ChannelType;
  eventName: string;
  eventDescription?: string;
  variables: Variable[];
  onInsert: (subject: string, body: string) => void;
  onClose: () => void;
}

export interface PreviewModalProps {
  onClose: () => void;
}