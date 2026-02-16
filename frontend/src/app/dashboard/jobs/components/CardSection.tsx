"use client";
import { useState, useEffect } from "react";
import JobDetailModal from "./JobsDetail";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAlls } from "@/helper/apiHelper";
import {
  Briefcase,
  User,
  MapPin,
  Calendar,
  Eye,
  Inbox,
  ChevronDown,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface JobCardsProps {
  jobs: any[];
  loading: boolean;
  viewMode: string;
  onJobUpdate?: () => void;
}

interface JobStatus {
  _id: string;
  technicianJobStatus: string;
  isActive: boolean;
}

const getStatusColor = (statusName: string) => {
  const statusLower = statusName?.toLowerCase() || "";
  if (statusLower.includes("open") || statusLower.includes("assigned")) return "#6366f1";
  if (statusLower.includes("progress")) return "#f97316";
  if (statusLower.includes("hold")) return "#a855f7";
  if (statusLower.includes("completed")) return "#10b981";
  if (statusLower.includes("cancel")) return "#ef4444";
  if (statusLower.includes("pending")) return "#6b7280";
  return "#64748b";
};

const JobCardsSection = ({
  viewMode,
  jobs,
  loading,
  onJobUpdate,
}: JobCardsProps) => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [localJobs, setLocalJobs] = useState<any[]>(jobs);

  // Update local jobs when props change
  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  // Fetch job statuses from API
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response: any = await getAlls<JobStatus>(
          "/technician-job-status",
          { limit: 100 }
        );
        if (response.success) {
          setJobStatuses(response.data?.filter((s: JobStatus) => s.isActive) || []);
        }
      } catch (error) {
        console.error("Error fetching job statuses:", error);
        toast.error("Failed to load job statuses");
      } finally {
        setLoadingStatuses(false);
      }
    };
    fetchStatuses();
  }, []);

  // Handle status change
  const handleStatusChange = async (jobId: string, newStatusId: string) => {
    // Find the new status object
    const newStatus = jobStatuses.find((s) => s._id === newStatusId);
    if (!newStatus) return;

    // Optimistic update: Update local state immediately
    const updatedJobs = localJobs.map((job) => {
      if (job._id === jobId) {
        return {
          ...job,
          jobStatusId: {
            _id: newStatus._id,
            technicianJobStatus: newStatus.technicianJobStatus,
          },
        };
      }
      return job;
    });
    setLocalJobs(updatedJobs);

    try {
      const rawToken = localStorage.getItem("token");
      const cleanToken = rawToken ? rawToken.replace(/"/g, "").trim() : "";
      
      const response = await axios.put(
        `${BASE_URL}/update-technician-job-status`,
        {
          techncianJobId: jobId,
          techncianJobStatusId: newStatusId,
        },
        {
          headers: { Authorization: `Bearer ${cleanToken}` },
        }
      );
      
      if (response.data?.success) {
        toast.success("Job status updated successfully");
        // Optional: Call parent refresh callback if provided
        if (onJobUpdate) {
          onJobUpdate();
        }
      }
    } catch (error: any) {
      console.error("Error updating job status:", error);
      toast.error(error.response?.data?.message || "Failed to update job status");
      // Rollback on error
      setLocalJobs(jobs);
    }
  };

  // Handle completion toggle
  const handleCompletionToggle = async (jobId: string, currentStatus: boolean) => {
    const newCompletionStatus = !currentStatus;

    // Optimistic update: Update local state immediately
    const updatedJobs = localJobs.map((job) => {
      if (job._id === jobId) {
        return {
          ...job,
          isJobCompleted: newCompletionStatus,
        };
      }
      return job;
    });
    setLocalJobs(updatedJobs);

    try {
      const rawToken = localStorage.getItem("token");
      const cleanToken = rawToken ? rawToken.replace(/"/g, "").trim() : "";
      
      const response = await axios.put(
        `${BASE_URL}/update-technician-job-status`,
        {
          techncianJobId: jobId,
          isJobCompleted: newCompletionStatus,
        },
        {
          headers: { Authorization: `Bearer ${cleanToken}` },
        }
      );
      
      if (response.data?.success) {
        toast.success(newCompletionStatus ? "Job marked as completed" : "Job marked as incomplete");
        // Optional: Call parent refresh callback if provided
        if (onJobUpdate) {
          onJobUpdate();
        }
      }
    } catch (error: any) {
      console.error("Error updating job completion:", error);
      toast.error(error.response?.data?.message || "Failed to update job completion");
      // Rollback on error
      setLocalJobs(jobs);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading jobs...</div>;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const handleView = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const partsCost =
    selectedJob?.parts?.reduce(
      (total: number, part: any) =>
        total + Number(part.totalCost || part.unitCost || 0),
      0,
    ) || 0;

  const labourCost =
    selectedJob?.services?.reduce(
      (total: number, service: any) =>
        total + (parseFloat(service.labourCost) || 0),
      0,
    ) || 0;

  const totalBill = partsCost + labourCost;

  const NoJobsMessage = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-4 bg-gray-50 rounded-full mb-4">
        <Inbox size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No jobs found
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        There are no jobs matching your criteria. Jobs will appear here once
        they are assigned.
      </p>
    </div>
  );

  return (
    <div>
      {viewMode === "grid" ? (
        localJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            {localJobs?.map((job, index) => {
              const status = job.jobStatusId?.technicianJobStatus || "Open";
              const statusColor = getStatusColor(status);
              const currentStatusId = job.jobStatusId?._id || "";
              const isCompleted = job.isJobCompleted || false;

              return (
                <div
                  key={job._id || index}
                  className={`w-full bg-white rounded-2xl shadow-md overflow-hidden relative border border-gray-100 hover:shadow-xl transition-all duration-300 ${!isCompleted ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div
                    className="w-full h-1.5"
                    style={{
                      backgroundColor:
                        job.ticketId?.priorityId?.backgroundColor || "#6366f1",
                    }}
                  />

                  <div className="p-5 pb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-indigo-950 text-lg font-bold leading-none tracking-tight">
                          {job.jobId}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ticket: {job.ticketId?.ticketCode}
                        </p>
                      </div>
                      <div className="relative group">
                        <select
                          value={currentStatusId}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm appearance-none cursor-pointer pr-6 border-2 transition-all"
                          style={{
                            backgroundColor: statusColor,
                            color: "white",
                            borderColor: statusColor,
                          }}
                        >
                          {jobStatuses.map((s) => (
                            <option key={s._id} value={s._id} style={{ backgroundColor: "white", color: "black" }}>
                              {s.technicianJobStatus}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" size={12} style={{ color: "white" }} />
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-50 rounded-lg">
                          <User size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {job.technicianId?.personId?.firstName}{" "}
                            {job.technicianId?.personId?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {job.technicianId?.contactId?.phoneNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                          <MapPin size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {job.ticketId?.customerId?.personId?.firstName}
                          </p>
                          <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">
                            {job.ticketId?.customerId?.addressId?.address},{" "}
                            {job.ticketId?.customerId?.addressId?.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-50 rounded-lg">
                          <Briefcase size={14} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {job.ticketId?.vehicleId?.productName ||
                              job.ticketId?.vehicleId?.vehicleType}
                          </p>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            {job.ticketId?.vehicleId?.vehicleModelId?.modelName}{" "}
                            ({job.ticketId?.vehicleId?.serialNumber})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-600 line-clamp-2 italic">
                        {job.ticketId?.issue_Details ||
                          "No issue details provided."}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 pb-3 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar size={14} />
                        <span className="text-[11px] font-medium">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>

                      <div
                        className="px-2 py-0.5 border rounded text-[10px] font-black uppercase tracking-tighter"
                        style={{
                          backgroundColor: `${job.ticketId?.priorityId?.backgroundColor}10`,
                          color: job.ticketId?.priorityId?.backgroundColor,
                          borderColor: `${job.ticketId?.priorityId?.backgroundColor}30`,
                        }}
                      >
                        {job.ticketId?.priorityId?.serviceRequestPrioprity}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleView(job)}
                        className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                      >
                        <Eye size={14} /> VIEW
                      </button>
                    </div>

                    {/* Completion Toggle */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Job Completed</span>
                      <button
                        onClick={() => handleCompletionToggle(job._id, isCompleted)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isCompleted ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoJobsMessage />
        )
      ) : localJobs.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-linear-to-r from-orange-50 to-red-50">
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Job #
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Priority
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Technician
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Customer
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Product
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Location
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Scheduled
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Toggle
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {localJobs?.map((job, index) => {
                  const status = job.jobStatusId?.technicianJobStatus || "Open";
                  const statusColor = getStatusColor(status);
                  const currentStatusId = job.jobStatusId?._id || "";
                  const isCompleted = job.isJobCompleted || false;

                  return (
                    <tr
                      key={job._id || index}
                      className={`hover:bg-indigo-50/30 transition-all group ${!isCompleted ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-sm text-indigo-950">
                          {job.jobId}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {job.ticketId?.ticketCode}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="relative inline-block">
                          <select
                            value={currentStatusId}
                            onChange={(e) => handleStatusChange(job._id, e.target.value)}
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm appearance-none cursor-pointer pr-6 border-2 transition-all"
                            style={{
                              backgroundColor: statusColor,
                              color: "white",
                              borderColor: statusColor,
                            }}
                          >
                            {jobStatuses.map((s) => (
                              <option key={s._id} value={s._id} style={{ backgroundColor: "white", color: "black" }}>
                                {s.technicianJobStatus}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" size={12} style={{ color: "white" }} />
                        </div>
                      </td>

                      <td className="p-4">
                        <div
                          className="px-2.5 py-1 bg-amber-100 text-amber-500  border border-amber-500 rounded-full text-[12px] font-semibold lowercase inline-block"
                          style={{
                            backgroundColor: `${job.ticketId?.priorityId?.backgroundColor}15`,
                            color: job.ticketId?.priorityId?.backgroundColor,
                            borderColor: `${job.ticketId?.priorityId?.backgroundColor}40`,
                          }}
                        >
                          {job.ticketId?.priorityId?.serviceRequestPrioprity}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {job.technicianId?.personId?.firstName}{" "}
                          {job.technicianId?.personId?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {job.technicianId?.contactId?.phoneNumber}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {job.ticketId?.customerId?.personId?.firstName}{" "}
                          {job.ticketId?.customerId?.personId?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {job.ticketId?.customerId?.contactId?.mobileNumber}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {job.ticketId?.vehicleId?.productName ||
                            job.ticketId?.vehicleId?.vehicleType}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {job.ticketId?.vehicleId?.vehicleModelId?.modelName}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-xs">
                            {job.ticketId?.customerId?.addressId?.city ||
                              job.ticketId?.customerId?.addressId?.address}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          <div>
                            <div className="text-xs font-medium">
                              {formatDate(job.createdAt)}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {job.createdAt
                                ? new Date(job.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleCompletionToggle(job._id, isCompleted)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isCompleted ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleView(job)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <NoJobsMessage />
      )}
      <JobDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
        calculations={{ partsCost, labourCost, totalBill }}
      />
    </div>
  );
};

export default JobCardsSection;
