'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { FollowUp } from '../../types/followUp';

interface UrgentAlertBannerProps {
  followUps: FollowUp[];
}

export const UrgentAlertBanner = ({ followUps }: UrgentAlertBannerProps) => {
  const overdueCount = followUps.filter(fu => fu.daysRemaining < 0 && fu.status === 'Pending').length;
  const dueTodayCount = followUps.filter(fu => fu.daysRemaining === 0 && fu.status === 'Pending').length;

  if (overdueCount === 0 && dueTodayCount === 0) return null;

  const urgentFollowUps = followUps.filter(fu => fu.daysRemaining <= 0 && fu.status === 'Pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500 animate-pulse">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-red-600" />
                Urgent Attention Required
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-bold text-red-600">{overdueCount} overdue</span>
                {' '}and{' '}
                <span className="font-bold text-orange-600">{dueTodayCount} due today</span>
                {' '}follow-ups need immediate action.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {urgentFollowUps.slice(0, 3).map(fu => (
                  <Badge key={fu._id} className={`${fu.daysRemaining < 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                    {fu.customer.name} - {fu.dueTime}
                  </Badge>
                ))}
                {urgentFollowUps.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-700">
                    +{urgentFollowUps.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};