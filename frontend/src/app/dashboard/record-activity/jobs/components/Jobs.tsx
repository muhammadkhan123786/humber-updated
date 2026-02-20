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
} from "lucide-react";
import JobFilters from "./JobFilters";
import JobDetailCard from "./JobDetailCard";
import Pagination from "@/components/ui/Pagination";
import { getAlls } from "@/helper/apiHelper";
import toast from "react-hot-toast";

const statusConfig: Record<string, { icon: any; gradient: string }> = {
  pending: {
    icon: Clock,
    gradient: "bg-gradient-to-br from-gray-500 to-gray-600",
  },
  start: {
    icon: PlayCircle,
    gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
  },
  "on hold": {
    icon: PauseCircle,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  end: {
    icon: CheckCircle,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
};

const statusOptions = [
  { id: "PENDING", name: "Pending" },
  { id: "START", name: "Start" },
  { id: "ON HOLD", name: "On Hold" },
  { id: "END", name: "End" },
];

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStats, setApiStats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await getAlls<any>("/technician-job-by-admin");
        const jobsData = response?.data || [];
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
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

          if (apiData.statusCounts) {
            const pendingCount =
              apiData.statusCounts.find((s: any) => s.jobStatusId === "PENDING")
                ?.totalJobs || 0;
            const startCount =
              apiData.statusCounts.find((s: any) => s.jobStatusId === "START")
                ?.totalJobs || 0;
            const onHoldCount =
              apiData.statusCounts.find((s: any) => s.jobStatusId === "ON HOLD")
                ?.totalJobs || 0;
            const endCount =
              apiData.statusCounts.find((s: any) => s.jobStatusId === "END")
                ?.totalJobs || 0;

            if (pendingCount > 0) {
              formattedStats.push({
                value: pendingCount.toString(),
                label: "Pending",
                badgeText: "Pending",
                gradient: statusConfig.pending.gradient,
                icon: statusConfig.pending.icon,
              });
            }

            if (startCount > 0) {
              formattedStats.push({
                value: startCount.toString(),
                label: "Start",
                badgeText: "Start",
                gradient: statusConfig.start.gradient,
                icon: statusConfig.start.icon,
              });
            }

            if (onHoldCount > 0) {
              formattedStats.push({
                value: onHoldCount.toString(),
                label: "On Hold",
                badgeText: "On Hold",
                gradient: statusConfig["on hold"].gradient,
                icon: statusConfig["on hold"].icon,
              });
            }

            if (endCount > 0) {
              formattedStats.push({
                value: endCount.toString(),
                label: "End",
                badgeText: "End",
                gradient: statusConfig.end.gradient,
                icon: statusConfig.end.icon,
              });
            }
          }

          setApiStats(formattedStats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleDeleteJob = (deletedJobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== deletedJobId));
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.jobId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.ticketId?.ticketCode
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        job.leadingTechnicianId?.personId?.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        job.leadingTechnicianId?.personId?.lastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.jobStatusId === statusFilter;

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
        statuses={statusOptions}
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
