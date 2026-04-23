'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/form/Card';

interface FollowUpStatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  index: number;
}

export const FollowUpStatsCard = ({ label, value, icon: Icon, color, bg, index }: FollowUpStatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
    >
      <Card className={`border-0 shadow-lg bg-gradient-to-br ${bg} hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};