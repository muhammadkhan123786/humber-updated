"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import TechnicianHeader from "./TechnicianHeader";
import StatsDashboard from "./StatsDashboard";
import FilterSection from "./FilterSection";
import JobCardsSection from "./JobCardsSection";

import { getAlls } from "@/helper/apiHelper";
import Pagination from "@/components/ui/Pagination";

interface TechnicianJobType {
  _id: string;
  jobId: string;
  ticketId: any;
  technicianId: any;
  jobStatusId: any;
  createdAt: string;
}

const TechnicianJob = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [jobs, setJobs] = useState<TechnicianJobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const limit = 10;

  const fetchJobs = useCallback(async (page = 1, search = "") => {
    try {
      if (search) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const params: any = {
        page,
        limit,
      };

      if (search) {
        params.search = search;
      }

      const res = await getAlls<TechnicianJobType>(
        "/technician-job-by-admin",
        params,
      );

      if (res.data) {
        setJobs(res.data || []);
        setTotalCount(res.total || res.data.length);
        setTotalPages(Math.ceil((res.total || res.data.length) / limit));
        setCurrentPage(page);
      }
    } catch (error: any) {
      console.log("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(1, "");
  }, [fetchJobs]);

  const handlePageChange = (page: number) => {
    fetchJobs(page, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchJobs(1, term);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handlePriorityFilter = (priority: string) => {
    setPriorityFilter(priority);
  };

  const handleRefreshData = () => {
    fetchJobs(currentPage, searchTerm);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const currentStatus = job.jobStatusId || "";
      const matchesStatus =
        statusFilter === "All Statuses" ||
        statusFilter === "all" ||
        currentStatus.toString().toLowerCase() === statusFilter.toLowerCase();

      const currentPriority =
        job.ticketId?.priorityId?.serviceRequestPrioprity || "";
      const matchesPriority =
        priorityFilter === "All Priorities" ||
        currentPriority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesStatus && matchesPriority;
    });
  }, [jobs, statusFilter, priorityFilter]);

  return (
    <div className="flex flex-col gap-6">
      <TechnicianHeader activeView={viewMode} setActiveView={setViewMode} />

      <StatsDashboard refreshTrigger={refreshTrigger} />

      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={handleSearch}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={handlePriorityFilter}
      />

      {searchTerm && (
        <div className="text-sm text-gray-600 px-2">
          Showing results for:{" "}
          <span className="font-semibold">{searchTerm}</span> (
          {filteredJobs.length} of {totalCount} jobs)
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-orange-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-500 text-lg">Loading jobs...</p>
        </div>
      ) : (
        <>
          <JobCardsSection
            jobs={filteredJobs}
            loading={searchLoading}
            viewMode={viewMode}
            onDelete={handleRefreshData}
          />

          {filteredJobs.length > 0 && totalPages > 1 && (
            <div className="flex justify-end border-t border-slate-200 pt-6 pb-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TechnicianJob;
