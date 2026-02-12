"use client";
import React from 'react'
import TechnicianHeader from './Header'
import { useEffect, useState, useMemo } from "react";
import StatsDashboard from './StatsCard';

const MainImports = () => {
  const [viewMode, setViewMode] = React.useState("grid");

  return (
    <div>
  <TechnicianHeader activeView={viewMode} setActiveView={setViewMode} />
  <StatsDashboard />
    </div>
  )
}

export default MainImports
