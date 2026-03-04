"use client";
import { Activity, Loader2, Edit, Trash2, Briefcase, FileText, User, Clock, Calendar, MessageSquare } from "lucide-react";
import TechnicianActivityButtons from "./TechnicianActivityButtons";
import Timer from "./Timer";
import ListPart from "./ListPart";
import { Pause } from "lucide-react";
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
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200";
    case "in_progress":
      return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200";
    case "paused":
      return "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-200";
    default:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "✓";
    case "in_progress":
      return "⏵";
   case "paused":
  return <Pause size={16} />;
    default:
      return "○";
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
      <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center py-20">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-600" size={64} />
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse"></div>
          </div>
          <p className="mt-6 text-gray-600 font-semibold text-lg">Loading activities...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 p-8 rounded-2xl shadow-lg">
        <div className="text-center py-16">
          <div className="relative inline-block mb-6">
            <Activity className="mx-auto text-gray-300" size={80} />
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-10"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Activities Yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first activity to track work progress</p>
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Activity size={20} />
            Create Your First Activity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl shadow-lg">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Activity Records
        </h2>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Activity size={16} className="text-blue-500" />
          Track and manage all technician work activities
        </p>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
          >
            {/* Header with Status Badge */}
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Activity className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Activity #{activity._id.slice(-6).toUpperCase()}</h3>
                  <p className="text-xs text-gray-500">Created {formatDate(activity.createdAt)}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${getStatusColor(activity.status)}`}>
                <span>{getStatusIcon(activity.status)}</span>
                {activity.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              {/* Job ID */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={16} className="text-blue-600" />
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Job ID</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{getJobId(activity)}</p>
              </div>

              {/* Quotation */}
              <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-purple-600" />
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Quotation</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{getQuotationNumber(activity)}</p>
              </div>

              {/* Technician */}
              <div className="bg-linear-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-pink-600" />
                  <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide">Technician</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{getTechnicianName(activity)}</p>
              </div>

              {/* Activity Type */}
              <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-green-600" />
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Activity Type</p>
                </div>
                <p className="font-bold text-gray-800">{getActivityType(activity)}</p>
              </div>

              {/* Total Time */}
              <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-orange-600" />
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Total Time</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{formatTime(activity.totalTimeInSeconds)}</p>
              </div>

              {/* Created At */}
              <div className="bg-linear-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-cyan-600" />
                  <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Date</p>
                </div>
                <p className="font-bold text-gray-800">{formatDate(activity.createdAt)}</p>
              </div>
            </div>

            {/* Additional Notes */}
            {activity.additionalNotes && (
              <div className="bg-linear-to-r from-gray-50 to-slate-100 rounded-xl p-4 mb-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-gray-600" />
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Notes</p>
                </div>
                <p className="text-gray-700 leading-relaxed">{activity.additionalNotes}</p>
              </div>
            )}

            {/* Timer Component */}
            <div className="mb-5">
              <Timer
                activityId={activity._id}
                status={activity.status}
                totalTimeInSeconds={activity.totalTimeInSeconds}
              />
            </div>

            {/* Parts List Component */}
            {typeof activity.quotationId === "object" && activity.quotationId?._id && (
              <div className="mb-5">
                <ListPart 
                  quotationId={activity.quotationId._id} 
                  activityId={activity._id}
                />
              </div>
            )}

            {/* Activity Control Buttons */}
            <TechnicianActivityButtons
              activityId={activity._id}
              status={activity.status}
              onStart={onStartActivity}
              onPause={onPauseActivity}
              onResume={onResumeActivity}
              onComplete={onCompleteActivity}
            />

            {/* Edit/Delete Buttons */}
            <div className="flex gap-3 justify-end pt-5 mt-5 border-t border-gray-200">
              <button
                onClick={() => onEditClick(activity)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-blue-200"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={() => onDeleteClick(activity._id)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-red-200"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianActivityGet;
