"use client";
import React, { useState, useEffect } from "react";
import RiderBanner from "./RiderBanner";
import StatsSection from "./StatCard";
import FilterSection from "./FilterSection";
import RiderTable from "./RiderTable";
import { useRider } from "../../../../../hooks/useRider";

const Riders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const { statistics, fetchRiders, loading } = useRider();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params: any = {
      page: 1,
      limit: 10,
    };

    if (activeStatus !== "All") {
      params.riderStatus = activeStatus.toUpperCase();
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    fetchRiders(params);
  }, [debouncedSearch, activeStatus, fetchRiders]);

  const displayStats = statistics;

  return (
    <div className="space-y-4">
      <RiderBanner />
      <StatsSection statistics={displayStats} />

      <FilterSection
        onSearchChange={setSearchQuery}
        activeTab={activeStatus}
        onTabChange={setActiveStatus}
        statistics={displayStats}
      />

      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <RiderTable search={searchQuery} activeStatus={activeStatus} />
      </div>
    </div>
  );
};

export default Riders;
