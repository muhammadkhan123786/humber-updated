"use client";
import { useState, useEffect } from "react";
import { Activity, Clock, Calendar, Package, CheckCircle, Eye } from "lucide-react";
import { getAlls } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";

interface JobData {
  _id: string;
  jobId: string;
  ticketId: {
    issue_Details: string;
  };
  services: {
    activityId: {
      technicianServiceType: string;
    };
    duration: string;
    description?: string;
  }[];
  parts: {
    partId: {
      partName: string;
    };
  }[];
  createdAt: string;
  jobStatusId: {
    technicianJobStatus: string;
  };
  isJobCompleted: boolean;
}

interface OverviewProps {
  refreshTrigger?: number;
}

const Overview = ({ refreshTrigger }: OverviewProps) => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [refreshTrigger]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response: any = await getAlls("/technician-dashboard-jobs");
      
      if (response.success && response.data?.jobs) {
        // Filter only completed jobs
        const completedJobs = response.data.jobs.filter(
          (job: JobData) => job.isJobCompleted === true
        );
        
        // Sort by date in descending order (newest first)
        const sortedJobs = completedJobs.sort((a: JobData, b: JobData) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setJobs(sortedJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load recent activities");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDuration = (duration: string) => {
    const hours = parseFloat(duration);
    if (hours === 1) return "1 hour";
    return `${hours} hours`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-500">
        <Activity className="text-green-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Recent Activities</h2>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Activity size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg">No completed activities yet</p>
          </div>
        ) : (
          jobs.map((job) => {
            const firstService = job.services[0];
            const serviceType = firstService?.activityId?.technicianServiceType || "N/A";
            const issueDetails = job.ticketId?.issue_Details || "No issue details available";
            const duration = firstService?.duration || "0";

            return (
              <div
                key={job._id}
                className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between  gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{job.jobId}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle size={14} />
                        completed
                      </span>
                    </div>
                    
                    {/* Service Type */}
                    <p className="text-indigo-600 font-semibold text-sm mb-1">
                      {serviceType}
                    </p>
                    
                    {/* Issue Details */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {issueDetails}
                    </p>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-gray-400" />
                    <span>{formatDuration(duration)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                {/* Parts Used */}
                {job.parts && job.parts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <Package size={16} className="text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">
                          Parts Used:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.parts.map((part, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                            >
                              {part.partId.partName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* View All Button */}
      {jobs.length > 0 && (
        <button
          onClick={() => {
            // You can add navigation to all activities page here
            toast.success("View all activities feature coming soon");
          }}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-200"
        >
          <Eye size={18} />
          <span>View All Activities</span>
        </button>
      )}
    </div>
  );
};

export default Overview;
