"use client";
import React, { useState, useEffect, useCallback } from "react";
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

interface StatCardData {
  value: string;
  label: string;
  badgeText: string;
  gradient: string;
  icon: any;
}

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  console.log(searchLoading);
  const limit = 10;

  const fetchJobs = useCallback(
    async (page = 1, search = "", showLoading = true) => {
      try {
        if (search) {
          setSearchLoading(true);
        } else if (showLoading) {
          setIsLoading(true);
        }

        const params: any = {
          page,
          limit,
        };

        if (search) {
          params.search = search;
        }

        const response = await getAlls<any>("/technician-job-by-admin", params);
        const jobsData = response?.data || [];

        setJobs(jobsData);
        setTotalCount(response?.total || jobsData.length);
        setTotalPages(Math.ceil((response?.total || jobsData.length) / limit));
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
        setSearchLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchJobs(1, "", true);
  }, [fetchJobs]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await getAlls<any>("/job-statistics");

        if (statsRes && statsRes.data) {
          const apiData = Array.isArray(statsRes.data)
            ? statsRes.data[0]
            : statsRes.data;
          const formattedStats: StatCardData[] = [];

          formattedStats.push({
            value: apiData?.overallTotalJobs?.toString() || "0",
            label: statusConfig.TOTAL.label,
            badgeText: statusConfig.TOTAL.label,
            gradient: statusConfig.TOTAL.gradient,
            icon: statusConfig.TOTAL.icon,
          });

          const statusOrder = ["PENDING", "START", "ON HOLD", "END"];
          statusOrder.forEach((status) => {
            const statusData = apiData?.statusCounts?.find(
              (s: any) => s.status === status,
            );

            formattedStats.push({
              value: statusData?.totalJobs?.toString() || "0",
              label: statusConfig[status]?.label || status,
              badgeText: statusConfig[status]?.label || status,
              gradient:
                statusConfig[status]?.gradient ||
                "bg-gradient-to-br from-gray-500 to-gray-600",
              icon: statusConfig[status]?.icon || Clock,
            });
          });

          setStats(formattedStats);
        } else {
          setDefaultStats();
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setDefaultStats();
      }
    };

    const setDefaultStats = () => {
      const defaultStats: StatCardData[] = [
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
    };

    fetchStats();
  }, [statsRefreshTrigger]);

  const handlePageChange = (page: number) => {
    fetchJobs(page, searchQuery, false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchJobs(1, query, false);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleDeleteJob = (deletedJobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== deletedJobId));
    setStatsRefreshTrigger((prev) => prev + 1);
    if (jobs.length === 1 && currentPage > 1) {
      handlePageChange(currentPage - 1);
    } else {
      fetchJobs(currentPage, searchQuery, false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      statusFilter === "all" || job.jobStatusId === statusFilter;
    return matchesStatus;
  });

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
        setSearchQuery={handleSearch}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilter}
        statuses={statusOptions}
      />

      {searchQuery && (
        <div className="text-sm text-gray-600 px-2">
          Showing results for:{" "}
          <span className="font-semibold">{searchQuery}</span> (
          {filteredJobs.length} of {totalCount} jobs)
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
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

      {!isLoading && filteredJobs.length > 0 && totalPages > 1 && (
        <div className="flex justify-end border-t border-slate-200 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Jobs;
