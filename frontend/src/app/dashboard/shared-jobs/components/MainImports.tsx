"use client";
import SharedJobsHeader from './Header';
import { useEffect, useState, useMemo, useCallback } from "react";
import SharedJobsStats from './StatsCard';
import SharedJobsCount from './CountCard';
import SharedJobsFilter from './SearchBar';
import SharedJobsCardSection from './CardSection';
import { getAlls } from "@/helper/apiHelper";
import Pagination from "@/components/ui/Pagination";

interface SharedJobType {
  _id: string;
  jobId: any;
  technicianId: any;
  generalNotes: string;
  role: string;
  assignedBy: any;
  jobStatus: string;
  acceptedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  job?: {
    _id: string;
    jobId: string;
    adminNotes?: string;
    jobStatusId?: string;
  };
}

const MainImports = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [jobs, setJobs] = useState<SharedJobType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState<any>({});

  const limit = 10;

  const fetchSharedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit,
        role: "SHARED"
      };

      if (statusFilter && statusFilter !== "All Statuses") {
        params.status = statusFilter;
      }

      const res = await getAlls<any>("/technician-job-assignments/getmysharedjobsassignedbyleadingtechnicians", params);
      
      console.log("API Response Shared JOBS:", res);
      
      const responseData = res.data as any;
      const jobsData = Array.isArray(responseData.data) ? responseData.data : [];
      
      setJobs(jobsData);
      setStatusCounts(responseData.statusCounts || {});
      
      const total = responseData.total || 0;
      setTotalPages(Math.ceil(total / limit));
    } catch (error: any) {
      console.log("Error fetching shared jobs:", error.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchSharedJobs();
  }, [currentPage, fetchSharedJobs, refreshTrigger]);

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) {
      return [];
    }
    
    return jobs.filter((job) => {
      const searchStr = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        job.job?.jobId?.toLowerCase().includes(searchStr) ||
        job.generalNotes?.toLowerCase().includes(searchStr) ||
        job.job?.adminNotes?.toLowerCase().includes(searchStr);

      return matchesSearch;
    });
  }, [jobs, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <SharedJobsHeader activeView={viewMode} setActiveView={setViewMode} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SharedJobsStats statusCounts={statusCounts} refreshTrigger={refreshTrigger} />
        </div>
        <div className="w-full sm:w-auto">
          <SharedJobsCount total={statusCounts.PENDING + statusCounts.IN_PROGRESS + statusCounts.ON_HOLD + statusCounts.COMPLETED || 0} />
        </div>
      </div>

      <SharedJobsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredJobs.length === 0 && !loading ? (
        <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
          No shared jobs found matching your criteria.
        </div>
      ) : (
        <SharedJobsCardSection
          jobs={filteredJobs}
          loading={loading}
          viewMode={viewMode}
          onJobUpdate={() => setRefreshTrigger(prev => prev + 1)}
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

export default MainImports;
