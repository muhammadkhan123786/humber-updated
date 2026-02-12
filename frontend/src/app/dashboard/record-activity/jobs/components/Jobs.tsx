"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { getAlls } from "@/helper/apiHelper";

const Jobs = () => {
  const { jobList: initialJobList, isLoading } = useActivityRecordForm();
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availableStatuses, setAvailableStatuses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setJobs(initialJobList);
  }, [initialJobList]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await getAlls<any>("/technician-job-status?filter=all");
        setAvailableStatuses(res.data || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  const handleDeleteJob = (deletedJobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== deletedJobId));
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.jobId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job._id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        job.jobStatusId?._id === statusFilter ||
        job.jobStatusId?.name === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const stats = [
    {
      value: jobs.length.toString(),
      label: "Total Activities",
      badgeText: "Total",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      icon: Activity,
    },
    {
      value: jobs
        .filter((j) => j.jobStatusId?.name?.toLowerCase() === "assigned")
        .length.toString(),
      label: "Awaiting Start",
      badgeText: "Assigned",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
      icon: Clock,
    },
    {
      value: jobs
        .filter((j) => j.jobStatusId?.name?.toLowerCase() === "in progress")
        .length.toString(),
      label: "In Progress",
      badgeText: "Active",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
      icon: PlayCircle,
    },
    {
      value: jobs
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
          <StatCard key={index} {...stat} Icon={stat.icon} />
        ))}
      </div>

      <JobFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statuses={availableStatuses}
      />

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <JobDetailCard
                key={job._id}
                job={job}
                onDelete={handleDeleteJob}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
              No jobs found.
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
