import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import JobDetailModal from "../../record-activity/jobs/components/JobDetailModal";

import {
  Briefcase,
  User,
  MapPin,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Inbox,
} from "lucide-react";
interface JobCardsProps {
  jobs: any[];
  loading: boolean;
  viewMode: string;
  onDelete?: (jobId: string) => void;
}
const statusConfig: Record<string, { bg: string; text: string }> = {
  open: { bg: "bg-indigo-500", text: "text-white" },
  Pending: { bg: "bg-gray-600", text: "text-white" },
  Assigned: { bg: "bg-blue-500", text: "text-white" },
  "In Progress": { bg: "bg-orange-500", text: "text-white" },
  "On Hold": { bg: "bg-purple-500", text: "text-white" },
  Completed: { bg: "bg-green-600", text: "text-white" },
  Cancelled: { bg: "bg-red-600", text: "text-white" },
};

const getStatusStyle = (status: string) =>
  statusConfig[status] || {
    bg: "bg-slate-500",
    text: "text-white",
  };
const JobCardsSection = ({
  viewMode,
  jobs,
  loading,
  onDelete,
}: JobCardsProps) => {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [deletedJobIds, setDeletedJobIds] = useState<Set<string>>(new Set());
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

  if (loading) return <div className="p-10 text-center">Loading jobs...</div>;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };
  const handleView = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };
  const handleEdit = (job: any) => {
    router.push(`/dashboard/record-activity?edit=${job._id || job.id}`);
  };
  const handleDelete = async (job: any) => {
    try {
      setDeletingJobId(job._id || job.id);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        return;
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
        if (response.status === 404) {
          toast.error("Job not found");
          return;
        }
        toast.error("Failed to delete job");
        return;
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

      setDeletedJobIds((prev) => new Set(prev).add(job._id || job.id));

      if (onDelete) {
        onDelete(job._id || job.id);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    } finally {
      setDeletingJobId(null);
    }
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
  const visibleJobs =
    jobs?.filter((job) => !deletedJobIds.has(job._id || job.id)) || [];

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
        visibleJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            {visibleJobs?.map((job, index) => {
              const status = job.jobStatusId?.technicianJobStatus || "open";
              const statusStyle = getStatusStyle(status);

              return (
                <div
                  key={job._id || index}
                  className="w-full  bg-white rounded-2xl shadow-md overflow-hidden relative border border-gray-100 hover:shadow-xl transition-shadow duration-300"
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
                      <div
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {status}
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {job.ticketId?.customerId?.personId?.firstName}
                          </p>
                          <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">
                            {job.ticketId?.customerId?.contactId?.mobileNumber}
                          </p>
                        </div>
                      </div>
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
                      <button
                        onClick={() => handleEdit(job)}
                        className="flex-1 bg-white border border-gray-200 text-indigo-950 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                      >
                        <Edit3 size={14} /> EDIT
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
      ) : visibleJobs.length > 0 ? (
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
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {visibleJobs?.map((job, index) => {
                  const status = job.jobStatusId?.technicianJobStatus || "open";
                  const statusStyle = getStatusStyle(status);
                  const isDeleting = deletingJobId === (job._id || job.id);

                  return (
                    <tr
                      key={job._id || index}
                      className="hover:bg-indigo-50/30 transition-colors group"
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
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm inline-block ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {status}
                        </span>
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
                                    },
                                  )
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(job)}
                            disabled={isDeleting}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(job)}
                            disabled={isDeleting}
                            className="p-2 bg-white border border-gray-200 text-slate-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(job)}
                            disabled={isDeleting}
                            className="p-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2
                              size={16}
                              className={isDeleting ? "animate-pulse" : ""}
                            />
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
    </div>
  );
};

export default JobCardsSection;
