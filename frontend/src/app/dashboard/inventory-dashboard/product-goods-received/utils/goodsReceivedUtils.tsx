import { GoodsReceivedNote } from '../types/goodsReceived';
import { FileText, CheckCircle2, AlertTriangle, LucideIcon } from 'lucide-react';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return 'from-gray-500 to-gray-600';
    case 'completed': return 'from-green-500 to-emerald-500';
    case 'discrepancy': return 'from-orange-500 to-amber-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

export const getStatusIcon = (status: string): LucideIcon => {
  switch (status) {
    case 'draft': return FileText;
    case 'completed': return CheckCircle2;
    case 'discrepancy': return AlertTriangle;
    default: return FileText;
  }
};

export const getDeliveryStatusBadge = (grn: GoodsReceivedNote) => {
  const totalReceived = grn.totalReceived ?? 0;
  const totalOrdered = grn.totalOrdered ?? 0;
  const totalRejected = grn.totalRejected ?? 0;

  if (totalReceived === totalOrdered && totalRejected === 0) {
    return 'Fully Delivered';
  } else if (totalReceived < totalOrdered) {
    return 'Partially Delivered';
  } else if (totalRejected > 0) {
    return 'With Rejections';
  }

  return 'Received';
};