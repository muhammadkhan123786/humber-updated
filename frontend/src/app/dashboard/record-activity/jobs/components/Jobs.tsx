"use client";
import React from "react";
import TechnicianHeader from "./TechnicianHeader";
import StatCard from "./StatCard";
import {
  Activity,
  Clock,
  PlayCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import JobFilters from "./JobFilters";
import JobDetailCard from "./JobDetailCard";
import { useActivityRecordForm } from "../../../../../hooks/useActivity"; // Adjust path

const Jobs = () => {
  const { jobList, isLoading } = useActivityRecordForm();

  const stats = [
    {
      value: jobList.length.toString(),
      label: "Total Activities",
      badgeText: "Total",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      icon: Activity,
    },
    {
      value: jobList
        .filter((j) => j.jobStatusId?.name?.toLowerCase() === "assigned")
        .length.toString(),
      label: "Awaiting Start",
      badgeText: "Assigned",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
      icon: Clock,
    },
    {
      value: jobList
        .filter((j) => j.jobStatusId?.name?.toLowerCase() === "in progress")
        .length.toString(),
      label: "In Progress",
      badgeText: "Active",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
      icon: PlayCircle,
    },
    {
      value: jobList
        .filter((j) => j.jobStatusId?.name?.toLowerCase() === "completed")
        .length.toString(),
      label: "Completed",
      badgeText: "Done",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-8 bg-gray-50 min-h-screen">
      <TechnicianHeader />

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

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobList.length > 0 ? (
            jobList.map((job) => <JobDetailCard key={job._id} job={job} />)
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
              No jobs found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
