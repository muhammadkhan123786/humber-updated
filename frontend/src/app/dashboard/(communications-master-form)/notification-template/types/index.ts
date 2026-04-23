// components/NotificationTemplateClient/types/index.ts
export interface TemplatePreview {
  type: 'whatsapp' | 'sms' | 'email';
  content: string;
  raw: string;
}

export interface TemplateItem {
  _id: string;
  eventKeyId?: {
    _id: string;
    name: string;
    module?: string;
  };
  channelId?: {
    _id: string;
    channelId?: {
      _id: string;
      channelName: string;
    };
    channelName?: string;
  };
  subject?: string;
  templateBody: string;
  createdAt: string;
  isActive: boolean;
  isDefault: boolean;
}

export interface Channel {
  _id: string;
  channelName: string;
}