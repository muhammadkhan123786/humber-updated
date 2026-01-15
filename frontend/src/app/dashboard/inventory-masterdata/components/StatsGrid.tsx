// components/StatsGrid.tsx
import React from 'react';
import StatCard from './StatCard';
import { DashboardStat } from './types';

interface StatsGridProps {
  stats: DashboardStat[];
  columns?: 2 | 3 | 4;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 2 }) => {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default StatsGrid;