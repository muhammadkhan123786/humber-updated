"use client";
import React, { useState, useEffect, useMemo } from "react";
import TechnicianHeader from "./TechnicianHeader";
import StatCard from "./StatCard";
import {
  Briefcase,
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

const statusConfig: Record<
  string,
  { icon: any; gradient: string; label: string }
> = {
  TOTAL: {
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
    label: "Total Jobs",
  },
  PENDING: {
    icon: Clock,
    gradient: "bg-gradient-to-br from-gray-500 to-gray-600",
    label: "Pending",
  },
  START: {
    icon: PlayCircle,
    gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
    label: "Start",
  },
  "ON HOLD": {
    icon: PauseCircle,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    label: "On Hold",
  },
  END: {
    icon: CheckCircle,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
    label: "End",
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
  const [stats, setStats] = useState<any[]>([]);
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

        // Create 5 cards: 1 Total + 4 status cards
        const formattedStats = [];

        // Add Total Jobs card
        formattedStats.push({
          value: apiData?.overallTotalJobs?.toString() || "0",
          label: statusConfig.TOTAL.label,
          badgeText: statusConfig.TOTAL.label,
          gradient: statusConfig.TOTAL.gradient,
          icon: statusConfig.TOTAL.icon,
        });

        // Add status cards
        const statuses = ["PENDING", "START", "ON HOLD", "END"];
        statuses.forEach((status) => {
          const count =
            apiData?.statusCounts?.find((s: any) => s.jobStatusId === status)
              ?.totalJobs || 0;

          formattedStats.push({
            value: count.toString(),
            label: statusConfig[status]?.label || status,
            badgeText: statusConfig[status]?.label || status,
            gradient:
              statusConfig[status]?.gradient ||
              "bg-gradient-to-br from-gray-500 to-gray-600",
            icon: statusConfig[status]?.icon || Clock,
          });
        });

        setStats(formattedStats);
      } catch (error) {
        console.error("Error fetching stats:", error);

        const defaultStats = [
          {
            value: "0",
            label: "Total Jobs",
            badgeText: "Total Jobs",
            gradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
            icon: Briefcase,
          },
          {
            value: "0",
            label: "Pending",
            badgeText: "Pending",
            gradient: statusConfig.PENDING.gradient,
            icon: statusConfig.PENDING.icon,
          },
          {
            value: "0",
            label: "Start",
            badgeText: "Start",
            gradient: statusConfig.START.gradient,
            icon: statusConfig.START.icon,
          },
          {
            value: "0",
            label: "On Hold",
            badgeText: "On Hold",
            gradient: statusConfig["ON HOLD"].gradient,
            icon: statusConfig["ON HOLD"].icon,
          },
          {
            value: "0",
            label: "End",
            badgeText: "End",
            gradient: statusConfig.END.gradient,
            icon: statusConfig.END.icon,
          },
        ];
        setStats(defaultStats);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.length > 0
          ? stats.map((stat, index) => (
              <StatCard key={index} {...stat} Icon={stat.icon} />
            ))
          : Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="h-32 bg-gray-200 rounded-3xl animate-pulse"
                ></div>
              ))}
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
