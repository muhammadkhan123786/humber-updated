'use client';

import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Button } from '@/components/form/CustomButton';
import { FollowUpReminder } from '../../types/callLog';

interface FollowUpsTableProps {
  followUps: FollowUpReminder[];
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'overdue': 'bg-red-100 text-red-800 border-red-200',
    'due-today': 'bg-orange-100 text-orange-800 border-orange-200',
    'due-soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'completed': 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'Critical': 'bg-red-100 text-red-800 border-red-200',
    'High': 'bg-orange-100 text-orange-800 border-orange-200',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Low': 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getStatusIcon = (status: string) => {
  if (status === 'overdue') return <AlertTriangle className="h-3 w-3" />;
  if (status === 'due-today') return <Clock className="h-3 w-3" />;
  return <Bell className="h-3 w-3" />;
};

const getStatusText = (status: string) => {
  if (status === 'overdue') return 'OVERDUE';
  if (status === 'due-today') return 'DUE TODAY';
  if (status === 'due-soon') return 'DUE SOON';
  return 'COMPLETED';
};

export const FollowUpsTable = ({ followUps }: FollowUpsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
              <Bell className="h-5 w-5 text-white" />
            </div>
            Follow-up Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Reminder ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Call ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((followUp, index) => (
                  <motion.tr
                    key={followUp._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{followUp.reminderId}</td>
                    <td className="py-3 px-4 text-gray-700">{followUp.customer}</td>
                    <td className="py-3 px-4 text-gray-700">{followUp.callId}</td>
                    <td className="py-3 px-4 text-gray-700">{followUp.dueDate}</td>
                    <td className="py-3 px-4 text-gray-700">{followUp.dueTime}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(followUp.status)} border`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(followUp.status)}
                          {getStatusText(followUp.status)}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getPriorityColor(followUp.priority)} border`}>
                        {followUp.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{followUp.notes}</td>
                    <td className="py-3 px-4 text-gray-700">{followUp.agent}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="hover:bg-blue-50">
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-green-50">
                          Follow-Up
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};