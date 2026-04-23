// components/NotificationTemplateForm/ChannelBadge.tsx
"use client";
import { ChannelType, ChannelUI } from "./types";
import { Mail, MessageSquare, Send } from "lucide-react";

const CHANNEL_UI: Record<ChannelType, ChannelUI> = {
  email: {
    icon: <Mail size={15} />,
    label: "Email",
    gradient: "from-blue-600 to-indigo-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    text: "text-blue-700",
  },
  sms: {
    icon: <MessageSquare size={15} />,
    label: "SMS",
    gradient: "from-emerald-600 to-teal-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-700",
  },
  whatsapp: {
    icon: <Send size={15} />,
    label: "WhatsApp",
    gradient: "from-green-500 to-lime-600",
    badge: "bg-green-50 text-green-700 border-green-200",
    text: "text-green-700",
  },
};

interface ChannelBadgeProps {
  channel: ChannelType;
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel }) => {
  const ui = CHANNEL_UI[channel];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border ${ui.badge}`}>
      {ui.icon} {ui.label} Template
    </span>
  );
};