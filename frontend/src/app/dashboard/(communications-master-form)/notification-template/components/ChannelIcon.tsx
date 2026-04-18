import React from 'react';
import { Mail, MessageSquare, Send, Globe } from 'lucide-react';

interface ChannelIconProps {
  channelName: string;
  size?: number;
}

export const ChannelIcon: React.FC<ChannelIconProps> = ({ channelName, size = 18 }) => {
  const name = channelName?.toLowerCase() || '';
  if (name.includes('sms') || name.includes('text') || name.includes('message')) return <MessageSquare size={size} />;
  if (name.includes('whatsapp') || name.includes('wa')) return <Send size={size} />;
  if (name.includes('email') || name.includes('mail')) return <Mail size={size} />;
  return <Globe size={size} />;
};