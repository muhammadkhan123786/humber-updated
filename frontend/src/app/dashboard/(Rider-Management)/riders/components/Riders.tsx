import React from "react";
import RiderBanner from "./RiderBanner";
import StatsSection from "./StatCard";
import FilterSection from "./FilterSection";
import RiderTable from "./RiderTable";

const Riders = () => {
  return (
    <div>
      <RiderBanner />
      <StatsSection />
      <FilterSection />
      <RiderTable />
    </div>
  );
};

export default Riders;
