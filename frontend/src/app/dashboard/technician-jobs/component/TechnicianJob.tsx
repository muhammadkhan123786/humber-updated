"use client";

import TechnicianHeader from "./TechnicianHeader";

import StatsDashboard from "./StatsDashboard";
import FilterSection from "./FilterSection";
import JobCardsSection from "./JobCardsSection";
import { useState } from "react";

const TechnicianJob = () => {
  const [viewMode, setViewMode] = useState("grid");
  return (
    <div className=" flex flex-col gap-6">
      <TechnicianHeader activeView={viewMode} setActiveView={setViewMode} />

      <StatsDashboard />
      <FilterSection />
      <JobCardsSection viewMode={viewMode} />
    </div>
  );
};

export default TechnicianJob;
