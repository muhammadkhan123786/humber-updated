"use client";
import React, { useState } from 'react'
import MainBar from './MainBar';
import RouteBar, { RouteType } from './RouteBar';
import StatsOverview from './StatsOverview';
import Profile from './Profile';

const TechnicianDashboard = () => {
  const [activeRoute, setActiveRoute] = useState<RouteType>('overview');

  return (
    <div>
      <MainBar />
       <StatsOverview />
      <RouteBar activeRoute={activeRoute} onRouteChange={setActiveRoute} />
      
      {/* Conditional Rendering based on active route */}
      
      {activeRoute === 'profile' && <Profile />}
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
