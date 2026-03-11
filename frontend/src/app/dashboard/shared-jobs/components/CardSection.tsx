"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import SharedJobActivityView from "./SharedJobActivityView";
import SharedJobDetailModal from "./SharedJobDetail";
import {
  Briefcase,
  MapPin,
  Calendar,
  Eye,
  Inbox,
  Play,
  Pause,
  ClipboardList,
  FileText,
  User2,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface SharedJobsCardSectionProps {
  jobs: any[];
  loading: boolean;
  viewMode: string;
  onJobUpdate?: () => void;
}

const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase() || "";
  if (statusLower.includes("pending")) return "#6b7280";
  if (statusLower.includes("progress")) return "#f97316";
  if (statusLower.includes("hold")) return "#a855f7";
  if (statusLower.includes("completed")) return "#10b981";
  return "#64748b";
};

const SharedJobsCardSection = ({
  viewMode,
  jobs,
  loading,
  onJobUpdate,
}: SharedJobsCardSectionProps) => {
  const [localJobs, setLocalJobs] = useState<any[]>(jobs);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActivityView, setShowActivityView] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Update local jobs when props change
  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  // Handle VIEW button click
  const handleView = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  // Handle Activity button click
  const handleActivity = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowActivityView(true);
  };

  // Handle close activity view
  const handleCloseActivityView = () => {
    setShowActivityView(false);
    setSelectedAssignment(null);
    if (onJobUpdate) {
      onJobUpdate();
    }
  };

  // Handle status update
  const handleStatusUpdate = async (assignmentId: string, newStatus: string) => {
    // Prevent multiple simultaneous updates
    if (updatingStatus) return;

    // Set loading state for this specific assignment
    setUpdatingStatus(assignmentId);

    // Optimistically update the UI immediately
    const previousJobs = [...localJobs];
    const updatedJobs = localJobs.map((job) =>
      job._id === assignmentId ? { ...job, jobStatus: newStatus } : job
    );
    setLocalJobs(updatedJobs);

    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim() || "";
      const response = await axios.put(
        `${BASE_URL}/technician-job-assignments/${assignmentId}`,
        { jobStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
        // Don't call onJobUpdate to prevent page refresh
        // The local state is already updated optimistically
      }
    } catch (error: any) {
      // Revert to previous state on error
      toast.error(error.response?.data?.message || "Failed to update status");
      setLocalJobs(previousJobs);
    } finally {
      // Clear loading state
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

  if (loading) return <div className="p-10 text-center">Loading shared jobs...</div>;

  // Calculate costs for the selected assignment
  const partsCost =
    selectedAssignment?.job?.parts?.reduce(
      (total: number, part: any) =>
        total + Number(part.totalCost || part.unitCost || 0),
      0,
    ) || 0;

  const labourCost =
    selectedAssignment?.job?.services?.reduce(
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
        No shared jobs found
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        There are no shared jobs matching your criteria. Shared jobs will appear here once assigned by leading technicians.
      </p>
    </div>
  );

  return (
    <div>
      {showActivityView && selectedAssignment ? (
        <SharedJobActivityView assignment={selectedAssignment} onClose={handleCloseActivityView} />
      ) : (
        <>
          {viewMode === "grid" ? (
        localJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localJobs?.map((assignment, index) => {
              const job = assignment.job;
              const currentStatus = assignment.jobStatus || "PENDING";
              const isCompleted = currentStatus === "COMPLETED";
              const isInProgress = currentStatus === "IN_PROGRESS";
              const isUpdating = updatingStatus === assignment._id;

              return (
                <div
                  key={assignment._id || index}
                  className="w-full bg-white rounded-2xl shadow-md overflow-hidden relative border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-full h-1.5"
                    style={{
                      backgroundColor: getStatusColor(currentStatus),
                    }}
                  />

                  <div className="p-5 pb-6">
                    <div className={`transition-opacity duration-300 ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-teal-950 text-lg font-bold leading-none tracking-tight">
                            {job?.jobId || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Role: <span className="font-semibold text-teal-600">{assignment.role}</span>
                          </p>
                        </div>
                        {!isCompleted && (
                          <div className="flex gap-1">
                            {currentStatus === "PENDING" && (
                              <button
                                onClick={() => handleStatusUpdate(assignment._id, "IN_PROGRESS")}
                                disabled={isUpdating}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm transition-all ${
                                  isUpdating 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:shadow-md hover:bg-blue-600'
                                } text-white`}
                              >
                                {isUpdating ? (
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Play size={14} />
                                )}
                                <span>{isUpdating ? 'Starting...' : 'Start'}</span>
                              </button>
                            )}
                            {currentStatus === "IN_PROGRESS" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(assignment._id, "ON_HOLD")}
                                  disabled={isUpdating}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm transition-all ${
                                    isUpdating 
                                      ? 'bg-gray-400 cursor-not-allowed' 
                                      : 'bg-orange-500 hover:shadow-md hover:bg-orange-600'
                                  } text-white`}
                                >
                                  {isUpdating ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Pause size={14} />
                                  )}
                                  <span>Pause</span>
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(assignment._id, "COMPLETED")}
                                  disabled={isUpdating}
                                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm transition-all ${
                                    isUpdating 
                                      ? 'bg-gray-400 cursor-not-allowed' 
                                      : 'bg-green-500 hover:shadow-md hover:bg-green-600'
                                  } text-white`}
                                >
                                  {isUpdating ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <ClipboardList size={14} />
                                  )}
                                  <span>Done</span>
                                </button>
                              </>
                            )}
                            {currentStatus === "ON_HOLD" && (
                              <button
                                onClick={() => handleStatusUpdate(assignment._id, "IN_PROGRESS")}
                                disabled={isUpdating}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm transition-all ${
                                  isUpdating 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-purple-500 hover:shadow-md hover:bg-purple-600'
                                } text-white`}
                              >
                                {isUpdating ? (
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Play size={14} />
                                )}
                                <span>{isUpdating ? 'Resuming...' : 'Resume'}</span>
                              </button>
                            )}
                          </div>
                        )}
                        {isCompleted && (
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-700">
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="space-y-3.5">
                        {assignment.generalNotes && (
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-amber-50 rounded-lg">
                              <FileText size={14} className="text-amber-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">General Notes</p>
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {assignment.generalNotes}
                              </p>
                            </div>
                          </div>
                        )}

                        {job?.adminNotes && (
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <User2 size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {job.adminNotes}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-purple-50 rounded-lg">
                            <Briefcase size={14} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Job Status</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {job?.jobStatusId || "Not Set"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Calendar size={14} />
                          <span className="text-[11px] font-medium">
                            {formatDate(assignment.createdAt)}
                          </span>
                        </div>

                        <div
                          className="px-2 py-0.5 border rounded text-[10px] font-black uppercase tracking-tighter transition-all duration-300"
                          style={{
                            backgroundColor: `${getStatusColor(currentStatus)}10`,
                            color: getStatusColor(currentStatus),
                            borderColor: `${getStatusColor(currentStatus)}30`,
                          }}
                        >
                          {currentStatus.replace("_", " ")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleView(assignment)}
                        className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                      >
                        <Eye size={13} /> VIEW
                      </button>
                      <button
                        onClick={() => handleActivity(assignment)}
                        className="flex-1 bg-linear-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                      >
                        <ClipboardList size={13} /> Activity
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
                <tr className="bg-linear-to-r from-teal-50 to-cyan-50">
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Job ID
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Role
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    General Notes
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Admin Notes
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Job Status
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Assigned Date
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {localJobs?.map((assignment, index) => {
                  const job = assignment.job;
                  const currentStatus = assignment.jobStatus || "PENDING";
                  const isCompleted = currentStatus === "COMPLETED";
                  const isUpdating = updatingStatus === assignment._id;

                  return (
                    <tr
                      key={assignment._id || index}
                      className={`hover:bg-teal-50/30 transition-all duration-300 group ${isCompleted ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-sm text-teal-950">
                          {job?.jobId || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          ID: {assignment._id.slice(-6).toUpperCase()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div
                          className="px-2.5 py-1 rounded-full text-[12px] font-semibold inline-block transition-all duration-300"
                          style={{
                            backgroundColor: `${getStatusColor(currentStatus)}15`,
                            color: getStatusColor(currentStatus),
                          }}
                        >
                          {currentStatus.replace("_", " ")}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full text-[12px] font-semibold">
                          {assignment.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="text-sm text-gray-900 max-w-xs line-clamp-2">
                          {assignment.generalNotes || "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm text-gray-900 max-w-xs line-clamp-2">
                          {job?.adminNotes || "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {job?.jobStatusId || "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-xs">
                            {formatDate(assignment.createdAt)}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => handleView(assignment)}
                            disabled={isUpdating}
                            className={`p-2 bg-indigo-50 text-indigo-600 rounded-lg transition-all shadow-sm ${
                              isUpdating 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-indigo-600 hover:text-white'
                            }`}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleActivity(assignment)}
                            disabled={isUpdating}
                            className={`p-2 bg-teal-50 text-teal-600 rounded-lg transition-all shadow-sm ${
                              isUpdating 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-teal-600 hover:text-white'
                            }`}
                            title="Activity"
                          >
                            <ClipboardList size={16} />
                          </button>
                          
                          {!isCompleted && (
                            <>
                              {currentStatus === "PENDING" && (
                                <button
                                  onClick={() => handleStatusUpdate(assignment._id, "IN_PROGRESS")}
                                  disabled={isUpdating}
                                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                    isUpdating 
                                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                                      : 'bg-blue-500 text-white hover:bg-blue-600'
                                  }`}
                                >
                                  {isUpdating && (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  )}
                                  <span>{isUpdating ? 'Starting...' : 'Start'}</span>
                                </button>
                              )}
                              {currentStatus === "IN_PROGRESS" && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(assignment._id, "ON_HOLD")}
                                    disabled={isUpdating}
                                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                                      isUpdating 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : 'bg-orange-500 text-white hover:bg-orange-600'
                                    }`}
                                  >
                                    {isUpdating && (
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span>Pause</span>
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(assignment._id, "COMPLETED")}
                                    disabled={isUpdating}
                                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                                      isUpdating 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                  >
                                    {isUpdating && (
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span>{isUpdating ? 'Completing...' : 'Complete'}</span>
                                  </button>
                                </>
                              )}
                              {currentStatus === "ON_HOLD" && (
                                <button
                                  onClick={() => handleStatusUpdate(assignment._id, "IN_PROGRESS")}
                                  disabled={isUpdating}
                                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                    isUpdating 
                                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                                      : 'bg-purple-500 text-white hover:bg-purple-600'
                                  }`}
                                >
                                  {isUpdating && (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  )}
                                  <span>{isUpdating ? 'Resuming...' : 'Resume'}</span>
                                </button>
                              )}
                            </>
                          )}
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
      
      {/* Modals */}
      <SharedJobDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignment={selectedAssignment}
        calculations={{ partsCost, labourCost, totalBill }}
      />
      </>
      )}
    </div>
  );
};

export default SharedJobsCardSection;
