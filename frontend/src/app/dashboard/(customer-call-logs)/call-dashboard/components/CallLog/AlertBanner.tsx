'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Button } from '@/components/form/CustomButton';
import { FollowUpReminder } from '../../types/callLog';
import Link from 'next/link';

interface AlertBannerProps {
  followUps: FollowUpReminder[];
}

export const AlertBanner = ({ followUps }: AlertBannerProps) => {
  const overdueCount = followUps.filter(fu => fu.status === 'overdue').length;
  const dueTodayCount = followUps.filter(fu => fu.status === 'due-today').length;

  if (overdueCount === 0 && dueTodayCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500 animate-pulse">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-red-600" />
                  Urgent Follow-up Reminders
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  You have{' '}
                  <span className="font-bold text-red-600">{overdueCount} overdue</span>
                  {' '}and{' '}
                  <span className="font-bold text-orange-600">{dueTodayCount} due today</span>
                  {' '}follow-up reminders requiring immediate attention.
                </p>
                <div className="mt-3 space-y-2">
                  {followUps
                    .filter(fu => fu.status === 'overdue' || fu.status === 'due-today')
                    .slice(0, 3)
                    .map(fu => (
                      <div key={fu._id} className="flex items-center gap-3 text-sm">
                        <Badge className={`${fu.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                          {fu.status === 'overdue' ? 'OVERDUE' : 'DUE TODAY'}
                        </Badge>
                        <span className="font-medium text-gray-900">{fu.customer}</span>
                        <span className="text-gray-600">-</span>
                        <span className="text-gray-700">{fu.notes}</span>
                        <span className="text-gray-500 text-xs">({fu.dueTime})</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <Link href="/call-log/follow-ups">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <Clock className="mr-2 h-4 w-4" />
                View All Reminders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};