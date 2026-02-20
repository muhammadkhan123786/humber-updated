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
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const limit = 10;

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAlls<TechnicianJobType>("/technician-job-by-admin", {
        page: currentPage,
        limit,
      });

      setJobs(res.data || []);
      setTotalPages(Math.ceil(res.total / limit));
    } catch (error: any) {
      console.log("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, fetchJobs]);
  const handleRefreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchJobs();
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchStr = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        job.jobId?.toLowerCase().includes(searchStr) ||
        job.ticketId?.ticketCode?.toLowerCase().includes(searchStr) ||
        job.technicianId?.personId?.firstName
          ?.toLowerCase()
          .includes(searchStr) ||
        job.technicianId?.personId?.lastName
          ?.toLowerCase()
          .includes(searchStr) ||
        job.ticketId?.customerId?.personId?.firstName
          ?.toLowerCase()
          .includes(searchStr) ||
        job.ticketId?.vehicleId?.productName?.toLowerCase().includes(searchStr);
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

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [jobs, searchTerm, statusFilter, priorityFilter]);
  return (
    <div className="flex flex-col gap-6">
      <TechnicianHeader activeView={viewMode} setActiveView={setViewMode} />

      <StatsDashboard refreshTrigger={refreshTrigger} />

      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {filteredJobs.length === 0 && !loading ? (
        <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
          No jobs found matching your criteria.
        </div>
      ) : (
        <JobCardsSection
          jobs={filteredJobs}
          loading={loading}
          viewMode={viewMode}
          onDelete={handleRefreshData}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TechnicianJob;
