"use client";
import React from "react";
import {
  Activity,
  Loader2,
  Briefcase,
  FileText,
  User,
  Clock,
  Calendar,
  MessageSquare,
  Pause,
} from "lucide-react";
export interface TechnicianActivity {
  _id: string;
  JobAssignedId: string | { _id: string; jobTitle: string; jobId: string };
  quotationId:
    | string
    | {
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

interface Props {
  activities: TechnicianActivity[];
  isLoading: boolean;
}

const getJobId = (activity: TechnicianActivity) =>
  typeof activity.JobAssignedId === "object"
    ? activity.JobAssignedId?.jobId
    : "N/A";

const getQuotationNumber = (activity: TechnicianActivity) =>
  typeof activity.quotationId === "object"
    ? activity.quotationId?.quotationAutoId
    : "N/A";

const getTechnicianName = (activity: TechnicianActivity) => {
  if (typeof activity.quotationId === "object") {
    const person = activity.quotationId?.technicianId?.personId;
    return person
      ? `${person.firstName} ${person.lastName}`
      : activity.quotationId?.technicianId?.employeeId || "N/A";
  }
  return "N/A";
};

const getActivityType = (activity: TechnicianActivity) =>
  typeof activity.activityType === "object"
    ? activity.activityType.technicianServiceType
    : activity.activityType || "N/A";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200";
    case "in_progress":
      return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-200";
    case "paused":
      return "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-200";
    default:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-yellow-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "✓";
    case "in_progress":
      return "⏵";
    case "paused":
      return <Pause size={14} />;
    default:
      return "○";
  }
};

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} minutes`;
const formatDate = (date: string) => new Date(date).toLocaleDateString();

const TechnicianActivityViewOnly = ({ activities, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-20 bg-white rounded-2xl">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Fetching activity logs...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <Activity className="mx-auto text-gray-300 mb-4" size={60} />
        <p className="text-gray-500 font-semibold text-lg">
          No activities recorded
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div
          key={activity._id}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Activity className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Activity Details</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {activity._id.slice(-8)}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-2 shadow-lg ${getStatusStyles(activity.status)}`}
            >
              {getStatusIcon(activity.status)}
              {activity.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <DataBox
              icon={<Briefcase size={14} />}
              label="Job ID"
              value={getJobId(activity)}
              color="blue"
            />
            <DataBox
              icon={<FileText size={14} />}
              label="Quotation"
              value={getQuotationNumber(activity)}
              color="purple"
            />
            <DataBox
              icon={<User size={14} />}
              label="Technician"
              value={getTechnicianName(activity)}
              color="pink"
            />
            <DataBox
              icon={<Activity size={14} />}
              label="Service Type"
              value={getActivityType(activity)}
              color="green"
            />
            <DataBox
              icon={<Clock size={14} />}
              label="Duration"
              value={formatTime(activity.totalTimeInSeconds)}
              color="orange"
            />
            <DataBox
              icon={<Calendar size={14} />}
              label="Date"
              value={formatDate(activity.createdAt)}
              color="cyan"
            />
          </div>

          {/* Notes Section */}
          {activity.additionalNotes && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Technician Notes
                </span>
              </div>
              <p className="text-sm text-slate-600 italic">
                {activity.additionalNotes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DataBox = ({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[color]} transition-colors`}>
      <div className="flex items-center gap-2 mb-1 opacity-70">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="font-bold text-gray-800 text-sm truncate">{value}</p>
    </div>
  );
};

export default TechnicianActivityViewOnly;
