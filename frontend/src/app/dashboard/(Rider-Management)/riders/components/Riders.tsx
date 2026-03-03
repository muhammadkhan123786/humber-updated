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
  const { statistics, fetchRiders } = useRider();
  useEffect(() => {
    fetchRiders({ page: 1, limit: 10 });
  }, [fetchRiders]);

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    const params: any = { page: 1, limit: 10 };

    if (status !== "All") {
      params.riderStatus = status.toUpperCase().replace(" ", "");
    }

    fetchRiders(params);
  };

  return (
    <div className="space-y-4">
      <RiderBanner />
      <StatsSection statistics={statistics} />

      <FilterSection
        onSearchChange={setSearchQuery}
        activeTab={activeStatus}
        onTabChange={handleStatusChange}
        statistics={statistics}
      />

      <RiderTable search={searchQuery} />
    </div>
  );
};
export default Riders;
