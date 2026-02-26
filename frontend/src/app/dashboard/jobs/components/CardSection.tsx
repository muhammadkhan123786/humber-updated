"use client";
import { useState, useEffect } from "react";
import JobDetailModal from "./JobsDetail";
import TechnicianInspection from "./TechnicianInspectionModal";
import ShareJobModal from "./Share";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Briefcase,
  User,
  MapPin,
  Calendar,
  Eye,
  Inbox,
  Play,
  Pause,
  ClipboardList,
  Share2,
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
  canChooseTechnician?: boolean;
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
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [inspectionJob, setInspectionJob] = useState<any>(null);
  const [localJobs, setLocalJobs] = useState<any[]>(jobs);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [jobToShare, setJobToShare] = useState<any>(null);

  // Update local jobs when props change
  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  // Handle START/PAUSE toggle (START <-> ON HOLD)
  const handleStartPauseToggle = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "START" ? "ON HOLD" : "START";
    const updatedJobs = localJobs.map((job) => 
      job._id === jobId ? { ...job, jobStatusId: newStatus } : job
    );
    setLocalJobs(updatedJobs);

    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim() || "";
      const response = await axios.put(
        `${BASE_URL}/update-technician-job-status`,
        { jobStatusId: newStatus, techncianJobId: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data?.success) {
        toast.success(`Job ${newStatus === "START" ? "started" : "paused"} successfully`);
        onJobUpdate?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update job status");
      setLocalJobs(jobs);
    }
  };

  // Handle inspection button click
  const handleAddInspection = (job: any) => {
    setInspectionJob(job);
    setShowInspectionForm(true);
  };

  const handleBackFromInspection = () => {
    setShowInspectionForm(false);
    setInspectionJob(null);
    if (onJobUpdate) {
      onJobUpdate();
    }
  };

  // Handle share with technician
  const handleShareWithTechnician = (job: any) => {
    setJobToShare(job);
    setIsShareModalOpen(true);
  };

  const handleShareSuccess = () => {
    if (onJobUpdate) {
      onJobUpdate();
    }
  };

  // Handle completion toggle (changes status to END)
  const handleCompletionToggle = async (jobId: string, currentStatus: boolean) => {
    const newJobStatus = !currentStatus ? "END" : "PENDING";
    const updatedJobs = localJobs.map((job) => 
      job._id === jobId ? { ...job, jobStatusId: newJobStatus } : job
    );
    setLocalJobs(updatedJobs);

    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim() || "";
      const response = await axios.put(
        `${BASE_URL}/update-technician-job-status`,
        { jobStatusId: newJobStatus, techncianJobId: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data?.success) {
        toast.success(!currentStatus ? "Job completed" : "Job reopened");
        onJobUpdate?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update job completion");
      setLocalJobs(jobs);
    }
  };

  const formatDate = (dateString: string) => 
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

  const handleView = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center">Loading jobs...</div>;

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
      {showInspectionForm && inspectionJob ? (
        <TechnicianInspection job={inspectionJob} onBack={handleBackFromInspection} />
      ) : (
        <>
          {viewMode === "grid" ? (
        localJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            {localJobs?.map((job, index) => {
              const currentStatus = job.jobStatusId || "PENDING";
              const isCompleted = currentStatus === "END";
              const isStart = currentStatus === "START";

              return (
                <div
                  key={job._id || index}
                  className={`w-full bg-white rounded-2xl shadow-md overflow-hidden relative border border-gray-100 hover:shadow-xl transition-all duration-300 `}
                >
                 
                  <div
                    className="w-full h-1.5"
                    style={{
                      backgroundColor:
                        job.ticketId?.priorityId?.backgroundColor || "#6366f1",
                    }}
                  />

                  <div className="p-5 pb-6">
                    <div className={`${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-indigo-950 text-lg font-bold leading-none tracking-tight">
                          {job.jobId}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ticket: {job.ticketId?.ticketCode}
                        </p>
                      </div>
                      {!isCompleted && (
                        <button
                          onClick={() => handleStartPauseToggle(job._id, currentStatus)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm transition-all hover:shadow-md ${
                            isStart
                              ? "bg-orange-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {isStart ? (
                            <>
                              <Pause size={14} />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play size={14} />
                              <span>Start</span>
                            </>
                          )}
                        </button>
                      )}
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
                        className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                      >
                        <Eye size={13} /> VIEW
                      </button>
                      <button
                        onClick={() => handleAddInspection(job)}
                        className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                      >
                        <ClipboardList size={13} /> INSPECTION
                      </button>
                      <button
                        onClick={() => handleShareWithTechnician(job)}
                        className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                      >
                        <Share2 size={13} /> SHARE
                      </button>
                    </div>
                    </div>
                    {/* Completion Toggle */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between opacity-100!">
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
                  const currentStatus = job.jobStatusId || "PENDING";
                  const isCompleted = currentStatus === "END";
                  const isStart = currentStatus === "START";

                  return (
                    <tr
                      key={job._id || index}
                      className={`hover:bg-indigo-50/30 transition-all group ${isCompleted ? 'opacity-50' : 'opacity-100'}`}
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
                        {!isCompleted ? (
                          <button
                            onClick={() => handleStartPauseToggle(job._id, currentStatus)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm transition-all hover:shadow-md ${
                              isStart
                                ? "bg-orange-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {isStart ? (
                              <>
                                <Pause size={14} />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play size={14} />
                                <span>Start</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-700">End</span>
                        )}
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

                      <td className="p-4 opacity-100!">
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(job)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleAddInspection(job)}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Add Inspection"
                          >
                            <ClipboardList size={16} />
                          </button>
                          <button
                            onClick={() => handleShareWithTechnician(job)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Share with Technician"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
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
      <ShareJobModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        job={jobToShare}
        onSuccess={handleShareSuccess}
      />
        </>
      )}
    </div>
  );
};

export default JobCardsSection;
