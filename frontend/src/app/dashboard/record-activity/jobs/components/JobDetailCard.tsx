"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Clock,
  Settings,
  Package,
  CheckCircle,
  Eye,
  RefreshCw,
  Receipt,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import JobDetailModal from "./JobDetailModal";

interface Props {
  job: any;
  onDelete?: (jobId: string) => void;
}

const JobDetailCard = ({ job, onDelete }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString() : "-";

  const servicesCount = job.services?.length || 0;
  const partsCount = job.parts?.length || 0;

  const passedInspections =
    job.inspections?.filter((i: any) => i.status === "PASS").length || 0;
  const totalInspections = job.inspections?.length || 0;

  const totalMinutes =
    job.services?.reduce(
      (acc: number, s: any) => acc + Number(s.duration || 0),
      0,
    ) || 0;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const partsCost =
    job.parts?.reduce(
      (acc: number, p: any) => acc + Number(p.totalCost || 0),
      0,
    ) || 0;

  const labourCost = job.labourCost || 0;
  const totalBill = partsCost + labourCost;

  const handleUpdate = () => {
    router.push(`/dashboard/record-activity?edit=${job._id || job.id}`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/technician-jobs/${job._id || job.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized - Please login again");
          throw new Error("Unauthorized - Please login again");
        }
        if (response.status === 403) {
          toast.error("You do not have permission to delete this job");
          throw new Error(
            "Forbidden - You do not have permission to delete this job",
          );
        }
        if (response.status === 404) {
          toast.error("Job not found");
          throw new Error("Job not found");
        }
        toast.error("Failed to delete job");
        throw new Error("Failed to delete job");
      }
      toast.success(
        <div>
          <p className="font-semibold">Job deleted successfully!</p>
          <p className="text-xs opacity-90">Job ID: {job.jobId}</p>
        </div>,
        {
          icon: "🗑️",
          duration: 4000,
          position: "top-right",
          style: {
            background: "#10b981",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
          },
        },
      );
      setIsDeleted(true);
      setShowDeleteConfirm(false);
      if (onDelete) {
        onDelete(job._id || job.id);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="relative w-full bg-white/80 rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 transition-all duration-300 ease-in-out">
      {isDeleting && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">
              Deleting job...
            </span>
          </div>
        </div>
      )}

      <div className="h-1 w-full bg-linear-to-r from-orange-500 to-pink-500" />

      <div className="p-6">
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{job.jobId}</h2>

                <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-[10px] text-gray-700">
                  {job.ticketId?.ticketCode}
                </span>

                <span className="px-2 py-0.5 text-xs font-bold text-white rounded-[10px] bg-linear-to-r from-purple-500 to-pink-500">
                  {job.ticketId?.decisionId}
                </span>

                <span className="px-2 py-0.5 text-xs text-white rounded-[10px] bg-linear-to-r from-green-500 to-emerald-500 flex items-center gap-1">
                  <CheckCircle size={12} />
                  {job.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                {job.technicianId?.personId
                  ? `${job.technicianId.personId.firstName || ""} ${
                      job.technicianId.personId.middleName || ""
                    } ${job.technicianId.personId.lastName || ""}`.trim()
                  : "-"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-linear-to-r from-blue-50 to-purple-50">
              {[
                ["Assigned", job.ticketId?.createdAt],
                ["Started", job.createdAt],
                ["Completed", job.updatedAt],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-600">{label}</p>
                  <p className="text-sm font-bold text-indigo-950">
                    {formatDate(value as string)}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Stat
                icon={<Settings size={16} className="text-blue-600" />}
                label="Service Activities"
                value={servicesCount}
                bg="from-blue-50 to-cyan-50"
                border="border-blue-100"
                color="text-blue-600"
              />

              <Stat
                icon={<Package size={16} className="text-purple-600" />}
                label="Parts Changed"
                value={partsCount}
                bg="from-purple-50 to-pink-50"
                border="border-purple-100"
                color="text-purple-600"
              />

              <Stat
                icon={<CheckCircle size={16} className="text-green-600" />}
                label="Inspection"
                value={`${passedInspections}/${totalInspections}`}
                bg="from-green-50 to-emerald-50"
                border="border-green-100"
                color="text-green-600"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              Total Duration:
              <span className="font-bold text-gray-900">
                {hours}h {minutes}m
              </span>
            </div>

            <div className="p-5 rounded-xl bg-linear-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
              <div className="flex items-center gap-2 font-bold mb-4">
                <Receipt size={18} className="text-emerald-600" />
                Cost Breakdown
              </div>

              <div className="space-y-2 text-sm">
                <Row label="Parts Cost:" value={`£${partsCost.toFixed(2)}`} />
                <Row label="Labour Cost:" value={`£${labourCost.toFixed(2)}`} />

                <div className="pt-3 mt-2 border-t-2 border-emerald-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Bill:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    £{totalBill.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-24 space-y-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-8 rounded-[10px] bg-slate-50 border border-indigo-600/10 text-sm flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-colors"
            >
              <Eye size={16} /> View
            </button>

            <button
              onClick={handleUpdate}
              className="w-full h-8 rounded-[10px] bg-slate-50 border border-indigo-600/10 text-sm flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-colors"
            >
              <RefreshCw size={14} /> Update
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full h-8 rounded-[10px] bg-slate-50 border border-red-200 text-sm flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full h-8 rounded-[10px] bg-red-600 text-white text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full h-8 rounded-[10px] bg-gray-100 text-gray-700 text-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <JobDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
        calculations={{ partsCost, labourCost, totalBill }}
      />
    </div>
  );
};

export default JobDetailCard;

const Stat = ({ icon, label, value, bg, border, color }: any) => (
  <div className={`p-3 rounded-xl bg-linear-to-br ${bg} border ${border}`}>
    <div className="flex items-center gap-2 text-xs text-gray-600">
      {icon}
      {label}
    </div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);
