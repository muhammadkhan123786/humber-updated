'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';

interface KPICardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  bg: string;
  iconBg: string;
  change: string;
  shadow: string;
  index: number;
}

export const KPICard = ({ 
  name, 
  value, 
  icon: Icon, 
  bg, 
  iconBg, 
  change, 
  shadow, 
  index 
}: KPICardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`border-0 ${bg} ${shadow} hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20">
              {change}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">{name}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};