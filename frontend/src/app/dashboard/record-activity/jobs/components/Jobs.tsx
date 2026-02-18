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
  PauseCircle,
  XCircle,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import JobFilters from "./JobFilters";
import JobDetailCard from "./JobDetailCard";
import { useActivityRecordForm } from "../../../../../hooks/useActivity";
import Pagination from "@/components/ui/Pagination";
import { getAlls } from "@/helper/apiHelper";

const statusConfig: Record<string, { icon: any; gradient: string }> = {
  pending: {
    icon: Clock,
    gradient: "bg-gradient-to-br from-gray-500 to-gray-600",
  },
  assigned: {
    icon: Clock,
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  "in progress": {
    icon: PlayCircle,
    gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
  },
  "on hold": {
    icon: PauseCircle,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  completed: {
    icon: CheckCircle,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  cancelled: {
    icon: XCircle,
    gradient: "bg-gradient-to-br from-rose-500 to-red-600",
  },
  open: {
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
  },
};

const defaultStyle = {
  icon: HelpCircle,
  gradient: "bg-gradient-to-br from-slate-400 to-slate-600",
};

const Jobs = () => {
  const { jobList: initialJobList, isLoading } = useActivityRecordForm();
  const [jobs, setJobs] = useState<any[]>([]);
  const [apiStats, setApiStats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availableStatuses, setAvailableStatuses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setJobs(initialJobList);
  }, [initialJobList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await getAlls<any>(
          "/technician-job-status?filter=all",
        );
        setAvailableStatuses(statusRes.data || []);

        const statsRes = await getAlls<any>("/job-statistics");
        const apiData = statsRes.data as any;

        if (apiData) {
          const formattedStats = [];

          if (apiData.overallTotalJobs > 0) {
            formattedStats.push({
              value: apiData.overallTotalJobs.toString(),
              label: "Total Activities",
              badgeText: "Total",
              gradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
              icon: Activity,
            });
          }

          apiData.statusCounts?.forEach((status: any) => {
            if (status.totalJobs > 0) {
              const normalizedStatus = status.technicianJobStatus.toLowerCase();
              const config = statusConfig[normalizedStatus] || defaultStyle;

              formattedStats.push({
                value: status.totalJobs.toString(),
                label: status.technicianJobStatus,
                badgeText: status.technicianJobStatus,
                gradient: config.gradient,
                icon: config.icon,
              });
            }
          });

          setApiStats(formattedStats);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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

  return (
    <div className="p-6 flex flex-col gap-8 bg-gray-50 min-h-screen">
      <TechnicianHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {apiStats.length > 0 ? (
          apiStats.map((stat, index) => (
            <StatCard key={index} {...stat} Icon={stat.icon} />
          ))
        ) : !isLoading ? (
          <div className="col-span-full h-24 flex items-center justify-center bg-white rounded-xl border border-dashed text-gray-400">
            No active jobs or statistics to display.
          </div>
        ) : null}
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
            <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-400">
              No jobs found matching your criteria.
            </div>
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
};

export default Jobs;
