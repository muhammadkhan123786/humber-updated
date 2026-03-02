"use client";
import React, { useState } from "react";
import RiderBanner from "./RiderBanner";
import StatsSection from "./StatCard";
import FilterSection from "./FilterSection";
import RiderTable from "./RiderTable";

const Riders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <RiderBanner />
      <StatsSection />
      <FilterSection onSearchChange={setSearchQuery} />

      <RiderTable search={searchQuery} />
    </div>
  );
};

export default Riders;
