"use client";
import React, { useState } from 'react'
import MainBar from './MainBar';
import RouteBar, { RouteType } from './RouteBar';
import StatsOverview from './StatsOverview';
import Profile from './Profile';
import CountCard from '../../jobs/components/CountCard';
import StatsDashboard from './StatsOverview';

const TechnicianDashboard = () => {
  const [activeRoute, setActiveRoute] = useState<RouteType>('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProfileUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <MainBar refreshTrigger={refreshTrigger} />
        <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <div className="flex-1 ">
          <StatsDashboard refreshTrigger={refreshTrigger} />
        </div>
        <div className="w-full sm:w-auto">
          <CountCard refreshTrigger={refreshTrigger} />
        </div>
      </div>
      <RouteBar activeRoute={activeRoute} onRouteChange={setActiveRoute} />
      
      {/* Conditional Rendering based on active route */}
      
      {activeRoute === 'profile' && <Profile onProfileUpdate={handleProfileUpdate} />}
      {activeRoute === 'myjobs' && (
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-800">My Jobs</h2>
          <p className="text-gray-600 mt-2">Jobs section coming soon...</p>
        </div>
      )}
      {activeRoute === 'activities' && (
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-800">Activities</h2>
          <p className="text-gray-600 mt-2">Activities section coming soon...</p>
        </div>
      )}
    </div>
  )
}

export default TechnicianDashboard
