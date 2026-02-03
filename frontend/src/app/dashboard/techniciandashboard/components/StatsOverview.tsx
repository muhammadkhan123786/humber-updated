import React from 'react';
import StatsCard from './StatsCard';

interface StatsOverviewProps {
  totalJobs?: number;
  inProgressJobs?: number;
  completedJobs?: number;
  pendingJobs?: number;
}

const StatsOverview = ({ 
  totalJobs = 3, 
  inProgressJobs = 1, 
  completedJobs = 2, 
  pendingJobs = 2 
}: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-7">
      <StatsCard title="Total Jobs" count={totalJobs} type="total" />
      <StatsCard title="In Progress" count={inProgressJobs} type="inProgress" />
      <StatsCard title="Completed" count={completedJobs} type="completed" />
      <StatsCard title="Pending" count={pendingJobs} type="pending" />
    </div>
  );
};

export default StatsOverview;
