"use client";
import React from "react";
import TechnicianHeader from "./TechnicianHeader";
import StatCard from "./StatCard";
import { Activity, Clock, PlayCircle, CheckCircle } from "lucide-react";
import JobFilters from "./JobFilters";
import JobDetailCard from "./JobDetailCard";

const Jobs = () => {
  const stats = [
    {
      value: "12",
      label: "Total Activities",
      badgeText: "Total",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      icon: Activity,
    },
    {
      value: "3",
      label: "Awaiting Start",
      badgeText: "Assigned",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
      icon: Clock,
    },
    {
      value: "3",
      label: "In Progress",
      badgeText: "Active",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
      icon: PlayCircle,
    },
    {
      value: "5",
      label: "Completed",
      badgeText: "Done",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <TechnicianHeader />

      {/* Stats Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            label={stat.label}
            badgeText={stat.badgeText}
            gradient={stat.gradient}
            Icon={stat.icon}
          />
        ))}
      </div>
      <JobFilters />
      <JobDetailCard />
    </div>
  );
};

export default Jobs;
