"use client";
import React, { useState, useEffect, useMemo } from "react";
import RiderBanner from "./RiderBanner";
import StatsSection from "./StatCard";
import FilterSection from "./FilterSection";
import RiderTable from "./RiderTable";
import { useRider } from "../../../../../hooks/useRider";

const Riders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const { statistics, fetchRiders } = useRider();

  useEffect(() => {
    fetchRiders({ page: 1, limit: 10 });
  }, [fetchRiders]);
  const persistentStats = useMemo(() => {
    if (statistics) {
      return statistics;
    }
    return null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statistics?.total, activeStatus === "All"]);

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
  };

  const displayStats = persistentStats || statistics;

  return (
    <div className="space-y-4">
      <RiderBanner />
      <StatsSection statistics={displayStats} />

      <FilterSection
        onSearchChange={setSearchQuery}
        activeTab={activeStatus}
        onTabChange={handleStatusChange}
        statistics={displayStats}
      />

      <RiderTable search={searchQuery} activeStatus={activeStatus} />
    </div>
  );
};

export default Riders;
