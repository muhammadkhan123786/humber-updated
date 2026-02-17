"use client";
import React from 'react'
import MainBar from './MainBar';
import RouteBar from './RouteBar';
import StatsOverview from './StatsOverview';

const TechnicianDashboard = () => {
  return (
    <div>
      <MainBar />
     
      <StatsOverview />
       <RouteBar />
    </div>
  )
}

export default TechnicianDashboard
