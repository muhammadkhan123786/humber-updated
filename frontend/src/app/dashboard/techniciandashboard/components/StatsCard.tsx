import React from 'react';
import { Briefcase, Play, CheckCircle, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  count: number;
  type: 'total' | 'inProgress' | 'completed' | 'pending';
}

const StatsCard = ({ title, count, type }: StatsCardProps) => {
  const getCardStyles = () => {
    switch (type) {
      case 'total':
        return {
          bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
          textColor: 'text-blue-900',
          iconBg: 'bg-blue-500',
          icon: <Briefcase size={24} className="text-white" />
        };
      case 'inProgress':
        return {
          bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
          textColor: 'text-purple-900',
          iconBg: 'bg-purple-500',
          icon: <Play size={24} className="text-white" />
        };
      case 'completed':
        return {
          bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
          textColor: 'text-green-900',
          iconBg: 'bg-green-500',
          icon: <CheckCircle size={24} className="text-white" />
        };
      case 'pending':
        return {
          bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
          textColor: 'text-yellow-900',
          iconBg: 'bg-yellow-500',
          icon: <Clock size={24} className="text-white" />
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div className={`${styles.bgColor} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between`}>
      <div>
        <p className={`text-sm font-semibold ${styles.textColor} mb-2`}>
          {title}
        </p>
        <h2 className={`text-3xl font-bold ${styles.textColor}`}>
          {count}
        </h2>
      </div>
      <div className={`${styles.iconBg} p-3 rounded-xl shadow-lg`}>
        {styles.icon}
      </div>
    </div>
  );
};

export default StatsCard;
