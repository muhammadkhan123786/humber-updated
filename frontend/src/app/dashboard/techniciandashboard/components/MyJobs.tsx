"use client";
import { useState, useEffect } from "react";
import { ListTodo, Pause, ClipboardList, Eye, Play, MapPin, Calendar, Clock, Phone, Package } from "lucide-react";
import { getAlls } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";
import axios from "axios";
import JobActivityView from "../../jobs/components/JobActivityView";
import JobDetailModal from "../../jobs/components/JobsDetail";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface JobData {
  _id: string;
  jobId: string;
  jobStatusId: string;
  quotationId?: {
    _id?: string;
    labourTime?: number;
    partsList?: any[];
  };
  ticketId: {
    ticketCode: string;
    issue_Details: string;
    customerId: {
      personId: {
        firstName: string;
        lastName: string;
      };
      contactId: {
        phoneNumber: string;
        mobileNumber: string;
      };
      addressId: {
        address: string;
        zipCode: string;
      };
    };
    vehicleId: {
      productName: string;
      serialNumber: string;
      vehicleModelId: {
        modelName: string;
      };
    };
    priorityId: {
      serviceRequestPrioprity: string;
      backgroundColor: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface MyJobsProps {
  refreshTrigger?: number;
}

const MyJobs = ({ refreshTrigger }: MyJobsProps) => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [localJobs, setLocalJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActivityView, setShowActivityView] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, [refreshTrigger]);

  // Update local jobs when jobs change
  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response: any = await getAlls("/technician-dashboard-jobs");
      console.log("Fetched jobs:", response);
      
      if (response.success && response.data?.jobs) {
        // Filter out completed jobs - show in-progress, pending, assigned
        const activeJobs = response.data.jobs.filter(
          (job: JobData) => job.jobStatusId !== "END"
        );
        
        // Sort by date in descending order (newest first)
        const sortedJobs = activeJobs.sort((a: JobData, b: JobData) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setJobs(sortedJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string; icon: any } } = {
      "PENDING": { label: "assigned", color: "bg-purple-100 text-purple-700", icon: ListTodo },
      "START": { label: "in-progress", color: "bg-blue-100 text-blue-700", icon: Play },
      "ON HOLD": { label: "paused", color: "bg-yellow-100 text-yellow-700", icon: Pause },
    };

    const statusInfo = statusMap[status] || { label: status.toLowerCase(), color: "bg-gray-100 text-gray-700", icon: ListTodo };
    const StatusIcon = statusInfo.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <StatusIcon size={14} />
        {statusInfo.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors: { [key: string]: string } = {
      "High": "bg-orange-100 text-orange-700",
      "Medium": "bg-yellow-100 text-yellow-700",
      "Low": "bg-green-100 text-green-700",
    };

    const colorClass = priorityColors[priority] || "bg-gray-100 text-gray-700";

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {priority.toLowerCase()}
      </span>
    );
  };

  // Handle START/PAUSE toggle
  const handleStartPauseToggle = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "START" ? "ON HOLD" : "START";
    
    // Optimistically update UI for smooth transition
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
        // Update the main jobs state to keep in sync
        setJobs(updatedJobs);
        toast.success(`Job ${newStatus === "START" ? "started" : "paused"} successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update job status");
      // Revert to original state on error
      setLocalJobs(jobs);
    }
  };

  const handleRecordActivity = (job: JobData) => {
    setSelectedJob(job);
    setShowActivityView(true);
  };

  const handleCloseActivityView = () => {
    setShowActivityView(false);
    setSelectedJob(null);
    // Refresh jobs after closing
    fetchJobs();
  };

  const handleViewDetails = (job: JobData) => {
    setSelectedJobForDetails(job);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedJobForDetails(null);
  };

  // Calculate costs for the selected job
  const calculateCosts = (job: any) => {
    const partsCost = job.quotationId?.partsList?.reduce(
      (total: number, part: any) => total + (Number(part.totalCost || part.unitCost || 0)),
      0
    ) || 0;

    const labourCost = 0; // Add labour cost calculation if available

    return {
      partsCost,
      labourCost,
      totalBill: partsCost + labourCost,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {showActivityView && selectedJob ? (
        <JobActivityView 
          job={selectedJob} 
          onClose={handleCloseActivityView}
          initialTab="technician-activities"
        />
      ) : (
        <div className="bg-white  shadow-lg  border-t-8 border-blue-400  p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ListTodo className="text-blue-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-800">My Assigned Jobs</h2>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {localJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ListTodo size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg">No active jobs assigned</p>
          </div>
        ) : (
          localJobs.map((job) => {
            const customer = job.ticketId?.customerId;
            const vehicle = job.ticketId?.vehicleId;
            const priority = job.ticketId?.priorityId;
            const currentStatus = job.jobStatusId || "PENDING";
            const isInProgress = currentStatus === "START";
            const isPaused = currentStatus === "ON HOLD";

            return (
              <div
                key={job._id}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-200"
              >
                {/* Job Header - ID, Status, Priority */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{job.jobId}</h3>
                  {getStatusBadge(job.jobStatusId)}
                  {priority && getPriorityBadge(priority.serviceRequestPrioprity)}
                </div>

                {/* Ticket ID */}
                <p className="text-gray-600 text-sm mb-4">
                  Ticket: <span className="font-semibold">{job.ticketId?.ticketCode}</span>
                </p>

                {/* Customer and Product Info - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Customer Info */}
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-2">Customer</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {customer?.personId?.firstName} {customer?.personId?.lastName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                      <Phone size={16} className="text-gray-400" />
                      <span>{customer?.contactId?.phoneNumber || customer?.contactId?.mobileNumber}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <span>
                        {customer?.addressId?.address}, {customer?.addressId?.zipCode}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-2">Product</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {vehicle?.productName}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {vehicle?.vehicleModelId?.modelName}
                    </p>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Issue Description</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {job.ticketId?.issue_Details || "No issue details available"}
                  </p>
                </div>

                {/* Date, Duration, Location */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(job.createdAt)} at 09:00</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-gray-400" />
                    <span>Est: {job.quotationId?.labourTime || 0} {job.quotationId?.labourTime === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{customer?.addressId?.address?.split(',')[0] || "N/A"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Start/Pause Toggle Button */}
                  {isInProgress ? (
                    <button
                      onClick={() => handleStartPauseToggle(job._id, currentStatus)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Pause size={18} />
                      <span>PAUSE</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartPauseToggle(job._id, currentStatus)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Play size={18} />
                      <span>START</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleRecordActivity(job)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md"
                  >
                    <ClipboardList size={16} />
                    <span>Record Activity</span>
                  </button>

                  <button
                    onClick={() => handleViewDetails(job)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
      )}
      
      {/* Job Details Modal */}
      {showDetailsModal && selectedJobForDetails && (
        <JobDetailModal
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
          job={selectedJobForDetails}
          calculations={calculateCosts(selectedJobForDetails)}
        />
      )}
    </>
  );
};

export default MyJobs;
