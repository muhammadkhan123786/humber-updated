"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Settings,
  Package,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  MessageSquare,
  Users,
} from "lucide-react";
import { jobsAnimations } from "../../jobs/components/JobsAnimation";
import ListInspections from "../../jobs/components/ListInspections";
import Services from "../../jobs/components/Services";
import Parts from "../../jobs/components/Parts";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface SharedJobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any; // The shared job assignment
  calculations: {
    partsCost: number;
    labourCost: number;
    totalBill: number;
  };
}

const SharedJobDetailModal = ({ isOpen, onClose, assignment, calculations }: SharedJobDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [fullJobData, setFullJobData] = useState<any>(null);
  const [loadingJobData, setLoadingJobData] = useState(true);

  // Get the job data - use fullJobData if available, otherwise fallback to assignment.job
  const job = fullJobData || assignment?.job;

  // Fetch complete job data with all populated fields
  useEffect(() => {
    if (!isOpen || !assignment?._id) {
      return;
    }

    const fetchFullJobData = async () => {
      try {
        setLoadingJobData(true);
        const token = localStorage.getItem("token")?.replace(/"/g, "").trim();
        
        // Fetch the complete assignment data with populated fields
        const response = await axios.get(
          `${BASE_URL}/technician-job-assignments/${assignment._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data?.success && response.data.data) {
          // The jobId field contains the populated job data
          setFullJobData(response.data.data.jobId);
        } else {
          // Fallback to assignment.job if fetch fails
          setFullJobData(assignment.job || assignment.jobId);
        }
      } catch (error) {
        console.error("Failed to fetch full assignment data:", error);
        // Fallback to assignment.job
        setFullJobData(assignment.job || assignment.jobId);
      } finally {
        setLoadingJobData(false);
      }
    };

    fetchFullJobData();
  }, [isOpen, assignment?._id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString("en-GB") : "Not recorded";

  // Get parts count from quotationId.partsList (same source as Parts component)
  const partsCount = job?.quotationId?.partsList?.length || 0;
  const totalJobDuration =
    job?.services?.reduce((total: number, service: any) => {
      return total + (parseInt(service.duration) || 0);
    }, 0) || 0;

  const ticketSource = job?.ticketId?.ticketSource || "Service";

  const ticketStatus = job?.ticketId?.ticketStatusId?.label || "OPEN";

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText size={18} /> },
    { id: "services", label: "Services", icon: <Settings size={18} /> },
    { id: "parts", label: "Parts", icon: <Package size={18} /> },
    {
      id: "inspections",
      label: "Inspections",
      icon: <ClipboardCheck size={18} />,
    },
    {
      id: "notes",
      label: "Notes",
      icon: <MessageSquare size={18} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <style>{jobsAnimations}</style>
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideUp max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-start bg-gray-50/50 animate-slideDown">
          <div>
            <div className="flex items-center gap-3 mb-1 animate-slideInLeft">
              <h2 className="font-semibold text-2xl bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {job?.jobId || "N/A"}
              </h2>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full uppercase">
                {assignment.role}
              </span>
            </div>
            <p className="text-muted-foreground text-sm animate-slideInLeft animate-delay-100">
              Shared job activity report
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors animate-scaleIn"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex border-b px-6 bg-white animate-fadeIn animate-delay-100">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`flex items-center gap-1 px-3 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap animate-fadeInUp ${
                activeTab === tab.id
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loadingJobData ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading job details...</p>
            </div>
          ) : activeTab === "overview" && (
            <div className="space-y-6">
              {/* Shared Job Assignment Info */}
              <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 shadow-sm animate-fadeInUp">
                <div className="flex items-center gap-2 mb-4 animate-slideInLeft">
                  <div className="p-1.5 border border-teal-400 rounded-md">
                    <Users className="text-teal-500" size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-teal-900">
                    Shared Job Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-teal-700 font-medium mb-2">
                      Assignment Role
                    </p>
                    <span className="px-4 py-1.5 bg-teal-500 text-white text-xs font-black rounded-full uppercase tracking-wider">
                      {assignment.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-teal-700 font-medium mb-2">
                      Assignment Status
                    </p>
                    <span className="px-4 py-1.5 bg-cyan-500 text-white text-xs font-black rounded-full uppercase tracking-wider">
                      {assignment.jobStatus}
                    </span>
                  </div>
                </div>

                {assignment.generalNotes && (
                  <div className="mb-4">
                    <p className="text-sm text-teal-700 font-medium mb-2">
                      General Notes
                    </p>
                    <p className="text-sm text-gray-800 bg-white p-3 rounded-lg">
                      {assignment.generalNotes}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-teal-100">
                  <div>
                    <p className="text-sm text-teal-700 font-medium mb-1">
                      Assigned At
                    </p>
                    <div className="text-sm font-semibold text-gray-800">
                      {formatDate(assignment.createdAt)}
                    </div>
                  </div>
                  {assignment.acceptedAt && (
                    <div>
                      <p className="text-sm text-teal-700 font-medium mb-1">
                        Accepted At
                      </p>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatDate(assignment.acceptedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Timeline & Status */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fadeInUp">
                <div className="flex items-center gap-2 mb-6 animate-slideInLeft">
                  <div className="p-1.5 border border-orange-400 rounded-md">
                    <Calendar className="text-orange-500" size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Job Timeline & Status
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">
                      Ticket Source
                    </p>
                    <span className="px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                      {ticketSource}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">
                      Status
                    </p>
                    <span className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                      {ticketStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">
                      Total Duration
                    </p>
                    <p className="text-base font-bold text-gray-800">
                      {totalJobDuration}m
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Job Created
                    </p>
                    <div className="text-sm font-semibold text-gray-800">
                      {job?.createdAt ? formatDate(job.createdAt) : "-"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Ticket Created
                    </p>
                    <div className="text-sm font-semibold text-gray-800">
                      {job?.ticketId?.createdAt
                        ? formatDate(job.ticketId.createdAt)
                        : "Not recorded"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {job?.updatedAt
                        ? formatDate(job.updatedAt)
                        : "Not updated"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Bill */}
              <div className="bg-[#f0fdf4] p-6 rounded-3xl border border-[#dcfce7] animate-fadeInUp animate-delay-100">
                <div className="flex items-center gap-2 mb-6 animate-slideInRight">
                  <div className="p-1 text-[#10b981]">
                    <Package size={22} />
                  </div>
                  <h2 className="text-lg font-bold text-[#064e3b]">
                    Total Bill
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-scaleIn">
                    <p className="text-sm text-gray-400 font-medium mb-1">
                      Parts Cost
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      £{calculations.partsCost.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {partsCount} part(s) changed
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-scaleIn animate-delay-100">
                    <p className="text-sm text-gray-400 font-medium mb-1">
                      Labour Cost
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      £{calculations.labourCost.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Based on duration
                    </p>
                  </div>
                </div>

                <div className="bg-[#00c853] p-6 rounded-2xl flex justify-between items-center text-white shadow-lg animate-bounceIn">
                  <div>
                    <p className="text-xs font-medium opacity-90 mb-1">
                      Total Amount
                    </p>
                    <p className="text-4xl font-black">
                      £{calculations.totalBill.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#22c55e] p-3 rounded-full shadow-inner border border-[#4ade80]">
                    <TrendingUp size={32} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Completion Summary */}
              {job?.adminNotes && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fadeInUp animate-delay-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-orange-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-800">
                      Admin Notes
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {job.adminNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {!loadingJobData && activeTab === "services" && (
            <Services job={job} />
          )}

          {!loadingJobData && activeTab === "parts" && (
            <Parts job={job} />
          )}

          {!loadingJobData && activeTab === "inspections" && (
            <ListInspections jobId={job?._id} />
          )}

          {!loadingJobData && activeTab === "notes" && (
            <div className="space-y-6">
              {/* Shared Job General Notes */}
              {assignment.generalNotes && (
                <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100 shadow-sm animate-fadeInUp">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Users size={16} className="text-teal-600" />
                    </div>
                    <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider">
                      Shared Job Notes (Role: {assignment.role})
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-xl border border-teal-100">
                    {assignment.generalNotes}
                  </p>
                </div>
              )}

              {/* Job Admin Notes */}
              {job?.adminNotes && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeInUp animate-delay-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Admin Notes
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {job.adminNotes}
                  </p>
                </div>
              )}

              {/* No Notes Message */}
              {!assignment.generalNotes && !job?.adminNotes && (
                <EmptyState message="No notes recorded" />
              )}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end animate-fadeIn">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-gray-200 animate-bounceIn"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400 animate-fadeIn">
    <Package size={48} className="opacity-10 mb-2 animate-pulse" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default SharedJobDetailModal;
