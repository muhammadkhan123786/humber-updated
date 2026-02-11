"use client";
import React, { useState } from "react";
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
import { useActivityRecordForm } from "../../../../../hooks/useActivity";
import Pagination from "@/components/ui/Pagination";

const Jobs = () => {
  const { jobList, isLoading } = useActivityRecordForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(jobList.length / itemsPerPage);

  const searchedJobs = jobList.filter(
    (job) =>
      job.jobId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job._id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedJobs = searchedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

      <JobFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <JobDetailCard key={job._id} job={job} />
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
              No jobs found matching {searchQuery}
            </div>
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Jobs;
