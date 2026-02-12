"use client";
import TechnicianHeader from './Header'
import { useEffect, useState, useMemo, useCallback } from "react";
import StatsDashboard from './StatsCard';
import FilterSection from './SearchBar';
import JobCardsSection from './CardSection';

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

const MainImports = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [jobs, setJobs] = useState<TechnicianJobType[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAlls<TechnicianJobType>("/technician-dashboard-jobs", {
        page: currentPage,
        limit,
      });
      
      console.log("API Response:", res); // Debug log to check API response structure
      
      // Handle nested response structure: res.data.jobs
      const responseData = res.data as any;
      const jobsData = Array.isArray(responseData?.jobs) ? responseData.jobs : 
                       Array.isArray(res.data) ? res.data : [];
      
      setJobs(jobsData);
      
      // Handle pagination from nested structure
      const totalJobs = responseData?.pagination?.totalJobs || res.total || 0;
      setTotalPages(Math.ceil(totalJobs / limit));
    } catch (error: any) {
      console.log("Error fetching jobs:", error.message);
      setJobs([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, fetchJobs]);

  const filteredJobs = useMemo(() => {
    // Ensure jobs is always an array
    if (!Array.isArray(jobs)) {
      return [];
    }
    
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

      const currentStatus = job.jobStatusId?.technicianJobStatus || "";
      const matchesStatus =
        statusFilter === "All Statuses" ||
        currentStatus.toLowerCase() === statusFilter.toLowerCase();

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

      <StatsDashboard />

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

export default MainImports
