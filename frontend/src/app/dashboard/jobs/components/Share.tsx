"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, Share2, Users, FileText, Loader2, Briefcase, Search } from "lucide-react";
import { jobsAnimations } from "./JobsAnimation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onSuccess?: () => void;
}

interface Technician {
  _id: string;
  employeeId?: string;
  personId?: {
    firstName: string;
    lastName: string;
  };
  contactId?: {
    email: string;
    phoneNumber: string;
  };
  roleId?: {
    roleName: string;
  };
}

const ShareJobModal = ({ isOpen, onClose, job, onSuccess }: ShareJobModalProps) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingTechnicians, setFetchingTechnicians] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen && job?._id) {
      const delayDebounce = setTimeout(() => {
        fetchTechnicians();
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery, isOpen, job?._id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.custom-dropdown')) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const fetchTechnicians = async () => {
    if (!job?._id) {
      console.warn("No job ID available");
      return;
    }
    
    setFetchingTechnicians(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim() || "";
      const params = new URLSearchParams({
        jobId: job._id,
        page: "1",
        limit: "50",
      });
      
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const url = `${BASE_URL}/technician-job-assignments/getavailabletechniciansforjob?${params.toString()}`;
      console.log("Fetching technicians from:", url);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Response:", response.data);

      if (response.data?.data) {
        setTechnicians(response.data.data);
      } else {
        setTechnicians([]);
      }
    } catch (error: any) {
      console.error("Error fetching available technicians:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to load technicians");
      setTechnicians([]);
    } finally {
      setFetchingTechnicians(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTechnician) {
      toast.error("Please select a technician");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim() || "";
      const response = await axios.post(
        `${BASE_URL}/technician-job-assignments`,
        {
          jobId: job._id,
          technicianId: selectedTechnician,
          generalNotes: generalNotes,
          role: "SHARED",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        toast.success("Job shared successfully!");
        onSuccess?.();
        onClose();
        // Reset form
        setSelectedTechnician("");
        setGeneralNotes("");
        setSearchQuery("");
      }
    } catch (error: any) {
      console.error("Error sharing job:", error);
      toast.error(error.response?.data?.message || "Failed to share job");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setIsClosing(true);
      setTimeout(() => {
        setSelectedTechnician("");
        setGeneralNotes("");
        setSearchQuery("");
        setIsDropdownOpen(false);
        setIsClosing(false);
        onClose();
      }, 200);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: jobsAnimations }} />
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${isClosing ? '' : 'animate-modalBackdrop'}`}
        onClick={handleBackdropClick}
      >
        <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden ${isClosing ? 'animate-modalSlideDown' : 'animate-modalSlideUp'}`}>
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Share2 className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share Job</h2>
              <p className="text-white/90 text-sm">
                Job ID: {job?.jobId || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-white hover:text-orange-500  hover:bg-white hover:bg-opacity-20 cursor-pointer rounded-lg transition-all duration-200 hover:rotate-90"
          >
            <X className="" size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Job Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase size={18} className="text-orange-500" />
              Job Information
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Ticket:</span>{" "}
                {job?.ticketId?.ticketCode || "N/A"}
              </p>
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {job?.ticketId?.customerId?.personId?.firstName}{" "}
                {job?.ticketId?.customerId?.personId?.lastName || "N/A"}
              </p>
              <p>
                <span className="font-medium">Product:</span>{" "}
                {job?.ticketId?.vehicleId?.productName ||
                  job?.ticketId?.vehicleId?.vehicleType ||
                  "N/A"}
              </p>
            </div>
          </div>

          {/* Technician Selection */}
          <div className="mb-4 relative">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Users size={16} className="text-orange-500" />
              Select Technician <span className="text-red-500">*</span>
            </label>
            
            {/* Hidden input for form validation */}
            <input
              type="hidden"
              name="technicianId"
              value={selectedTechnician}
              required
            />
            
            {/* Custom Searchable Dropdown */}
            <div className="relative custom-dropdown">
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-left flex items-center justify-between"
              >
                <span className={selectedTechnician ? "text-gray-900" : "text-gray-500"}>
                  {selectedTechnician
                    ? (() => {
                        const tech = technicians.find(t => t._id === selectedTechnician);
                        return tech
                          ? `${tech.personId?.firstName} ${tech.personId?.lastName}${tech.employeeId ? ` (${tech.employeeId})` : ''}${tech.roleId?.roleName ? ` - ${tech.roleId.roleName}` : ''}`
                          : "-- Select Technician --";
                      })()
                    : "-- Select Technician --"}
                </span>
                <Users size={18} className="text-gray-400" />
              </button>

              {/* Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-hidden">
                  {/* Search Bar Inside Dropdown */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Employee ID or Name..."
                        disabled={loading}
                        autoFocus
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Technician List */}
                  <div className="max-h-64 overflow-y-auto">
                    {fetchingTechnicians ? (
                      <div className="flex items-center justify-center py-8 text-gray-500">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Loading technicians...
                      </div>
                    ) : technicians.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No available technicians found
                      </div>
                    ) : (
                      technicians.map((tech) => (
                        <button
                          key={tech._id}
                          type="button"
                          onClick={() => {
                            setSelectedTechnician(tech._id);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedTechnician === tech._id
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {tech.personId?.firstName} {tech.personId?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tech.employeeId && `ID: ${tech.employeeId}`}
                                {tech.roleId?.roleName && ` • ${tech.roleId.roleName}`}
                              </div>
                            </div>
                            {selectedTechnician === tech._id && (
                              <div className="text-orange-500">✓</div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-orange-500" />
              Notes (Optional)
            </label>
            <textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="Add any notes or instructions for the technician..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTechnician}
              className="flex-1 px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 size={18} />
                  Share Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default ShareJobModal;
