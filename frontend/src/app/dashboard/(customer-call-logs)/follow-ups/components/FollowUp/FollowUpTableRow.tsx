'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { FollowUp } from '../../types/followUp';

interface FollowUpTableRowProps {
  followUp: FollowUp;
  index: number;
  onComplete: (id: string) => void;
  onReschedule: (followUp: FollowUp) => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Completed: 'bg-green-100 text-green-800 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Escalated: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getDaysRemainingColor = (days: number): string => {
  if (days < 0) return 'text-gray-500';
  if (days === 0) return 'text-red-600 font-bold';
  if (days === 1) return 'text-orange-600 font-semibold';
  return 'text-green-600';
};

const getDaysRemainingText = (days: number): string => {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Today';
  return `${days} days`;
};

export const FollowUpTableRow = ({ followUp, index, onComplete, onReschedule }: FollowUpTableRowProps) => {
  const isPending = followUp.status === 'Pending';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="py-3 px-4 font-medium text-gray-900">{followUp.followUpId}</td>
      <td className="py-3 px-4 text-gray-700">{followUp.customer.name}</td>
      <td className="py-3 px-4">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {followUp.relatedCallId}
        </Badge>
      </td>
      <td className="py-3 px-4 text-gray-700">{followUp.agent.name}</td>
      <td className="py-3 px-4 text-gray-600 text-sm">{followUp.followUpDate}</td>
      <td className="py-3 px-4 text-gray-600 text-sm">{followUp.dueTime}</td>
      <td className="py-3 px-4">
        <span className={getDaysRemainingColor(followUp.daysRemaining)}>
          {getDaysRemainingText(followUp.daysRemaining)}
        </span>
      </td>
      <td className="py-3 px-4">
        <Badge className={`${getPriorityColor(followUp.priority)} border`}>
          {followUp.priority}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Badge className={`${getStatusColor(followUp.status)} border`}>
          {followUp.status}
        </Badge>
      </td>
      <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{followUp.notes}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-green-50"
            disabled={!isPending}
            onClick={() => onComplete(followUp._id)}
          >
            Complete
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-blue-50"
            disabled={!isPending}
            onClick={() => onReschedule(followUp)}
          >
            Reschedule
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};