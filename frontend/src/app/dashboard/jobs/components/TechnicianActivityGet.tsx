"use client";
import { Activity, Loader2, Edit, Trash2, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";

export interface TechnicianActivity {
  _id: string;
  JobAssignedId: string | { _id: string; jobTitle: string; jobId: string };
  quotationId: string | { 
    _id: string; 
    quotationNumber: string; 
    quotationAutoId: string;
    technicianId?: {
      _id: string;
      employeeId?: string;
      personId?: { firstName: string; lastName: string };
    };
  };
  activityType: string | { _id: string; technicianServiceType: string };
  technicianId: string;
  additionalNotes: string;
  status: string;
  totalTimeInSeconds: number;
  timeLogs: any[];
  createdAt: string;
  updatedAt: string;
}

interface TechnicianActivityGetProps {
  activities: TechnicianActivity[];
  isLoading: boolean;
  onCreateClick: () => void;
  onEditClick: (activity: TechnicianActivity) => void;
  onDeleteClick: (activityId: string) => void;
  onStartActivity: (activityId: string) => void;
  onPauseActivity: (activityId: string) => void;
  onResumeActivity: (activityId: string) => void;
  onCompleteActivity: (activityId: string) => void;
}

// Helper functions for cleaner code
const getJobId = (activity: TechnicianActivity): string => {
  if (typeof activity.JobAssignedId === "object" && activity.JobAssignedId?.jobId) {
    return activity.JobAssignedId.jobId;
  }
  return "N/A";
};

const getQuotationNumber = (activity: TechnicianActivity): string => {
  if (typeof activity.quotationId === "object" && activity.quotationId?.quotationAutoId) {
    return activity.quotationId.quotationAutoId;
  }
  return "N/A";
};

const getTechnicianName = (activity: TechnicianActivity): string => {
  if (typeof activity.quotationId === "object") {
    const personId = activity.quotationId?.technicianId?.personId;
    if (personId) {
      return `${personId.firstName} ${personId.lastName}`;
    }
    const employeeId = activity.quotationId?.technicianId?.employeeId;
    if (employeeId) {
      return employeeId;
    }
  }
  return "N/A";
};

const getActivityType = (activity: TechnicianActivity): string => {
  if (activity.activityType && typeof activity.activityType === "object") {
    return activity.activityType.technicianServiceType || "N/A";
  }
  return activity.activityType || "N/A";
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const formatTime = (seconds: number): string => {
  return `${Math.floor(seconds / 60)} minutes`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const TechnicianActivityGet = ({ 
  activities, 
  isLoading, 
  onCreateClick, 
  onEditClick, 
  onDeleteClick,
  onStartActivity,
  onPauseActivity,
  onResumeActivity,
  onCompleteActivity
}: TechnicianActivityGetProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-5 pt-9 border-t-4 border-[#2B7FFF] rounded-lg shadow-sm">
        <div className="flex flex-col items-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="mt-4 text-gray-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white p-5 pt-9 border-t-4 border-[#2B7FFF] rounded-lg shadow-sm">
        <div className="text-center py-12">
          <Activity className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500">No activities found</p>
          <button
            onClick={onCreateClick}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Create your first activity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 pt-9 border-t-4 border-[#2B7FFF] rounded-lg shadow-sm">
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Activity Records
        </h2>
        <p className="text-sm text-gray-500">View all technician activities and their details</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Job ID */}
              <div>
                <p className="text-xs text-gray-500">Job ID</p>
                <p className="font-semibold text-gray-800">{getJobId(activity)}</p>
              </div>

              {/* Quotation */}
              <div>
                <p className="text-xs text-gray-500">Quotation</p>
                <p className="font-semibold text-gray-800">{getQuotationNumber(activity)}</p>
              </div>

              {/* Technician */}
              <div>
                <p className="text-xs text-gray-500">Technician</p>
                <p className="font-semibold text-gray-800">{getTechnicianName(activity)}</p>
              </div>

              {/* Activity Type */}
              <div>
                <p className="text-xs text-gray-500">Activity Type</p>
                <p className="font-semibold text-gray-800">{getActivityType(activity)}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>

              {/* Total Time */}
              <div>
                <p className="text-xs text-gray-500">Total Time</p>
                <p className="font-semibold text-gray-800">{formatTime(activity.totalTimeInSeconds)}</p>
              </div>

              {/* Created At */}
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="font-semibold text-gray-800">{formatDate(activity.createdAt)}</p>
              </div>

              {/* Additional Notes */}
              {activity.additionalNotes && (
                <div className="md:col-span-3">
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-gray-700">{activity.additionalNotes}</p>
                </div>
              )}

              {/* Activity Control Buttons */}
              {activity.status !== "completed" && (
                <div className="md:col-span-3 pt-3 border-t">
                  <div className="flex flex-wrap gap-2">
                    {/* Start Button - Only show when pending */}
                    {activity.status === "pending" && (
                      <button
                        onClick={() => onStartActivity(activity._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                      >
                        <Play size={16} />
                        Start
                      </button>
                    )}

                    {/* Pause Button - Show when in_progress */}
                    {activity.status === "in_progress" && (
                      <button
                        onClick={() => onPauseActivity(activity._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors shadow-sm"
                      >
                        <Pause size={16} />
                        Pause
                      </button>
                    )}

                    {/* Resume Button - Show when paused */}
                    {activity.status === "paused" && (
                      <button
                        onClick={() => onResumeActivity(activity._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                      >
                        <RotateCcw size={16} />
                        Resume
                      </button>
                    )}
                  </div>

                  {/* Complete Button - Show when not pending */}
                  {activity.status !== "pending" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onCompleteActivity(activity._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
                      >
                        <CheckCircle size={16} />
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Edit/Delete Buttons */}
              <div className="md:col-span-3 flex gap-2 justify-end pt-2 border-t">
                <button
                  onClick={() => onEditClick(activity)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteClick(activity._id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianActivityGet;
