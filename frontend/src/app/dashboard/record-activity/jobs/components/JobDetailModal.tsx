"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "../../../../../helper/apiHelper";
import {
  X,
  FileText,
  Settings,
  Package,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  ImageIcon,
  MessageSquare,
  MessageSquareCode,
} from "lucide-react";
import ListInspectionJob from "./ListInspectionJob";
import TechnicianActivityViewOnly, {
  TechnicianActivity,
} from "./TechnicianActivityViewOnly";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  calculations: {
    partsCost: number;
    labourCost: number;
    totalBill: number;
  };
}

const JobDetailModal = ({ isOpen, onClose, job, calculations }: ModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: activitiesData, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ["technicianActivities", job?._id],
    queryFn: () =>
      getAll<TechnicianActivity>("/technician-job-activities", {
        JobAssignedId: job?._id,
        limit: "100",
      }),
    enabled: !!job?._id && isOpen,
  });

  const activities = activitiesData?.data || [];
  if (!isOpen) return null;

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString("en-GB") : "Not recorded";

  const partsCount = job.parts?.length || 0;
  const totalJobDuration =
    job.services?.reduce((total: number, service: any) => {
      return total + (parseInt(service.duration) || 0);
    }, 0) || 0;

  const ticketSource = job.ticketId?.ticketSource || "Service";

  const ticketStatus = job.ticketId?.ticketStatusId?.label || "OPEN";

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
  console.log("notes ", job);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-semibold text-2xl bg-linear-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {job.jobId}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Complete activity report for{" "}
              {[
                job.technicianId?.personId?.firstName,
                job.technicianId?.personId?.middleName,
                job.technicianId?.personId?.lastName,
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex border-b px-6 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 border border-orange-400 rounded-md">
                    <Calendar className="text-orange-500" size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Timeline & Status
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
                      {job.createdAt ? formatDate(job.createdAt) : "-"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Ticket Created
                    </p>
                    <div className="text-sm font-semibold text-gray-800">
                      {job.ticketId?.createdAt
                        ? formatDate(job.ticketId.createdAt)
                        : "Not recorded"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {job.updatedAt
                        ? formatDate(job.updatedAt)
                        : "Not updated"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0fdf4] p-6 rounded-3xl border border-[#dcfce7]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1 text-[#10b981]">
                    <Package size={22} />
                  </div>
                  <h2 className="text-lg font-bold text-[#064e3b]">
                    Total Bill
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
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
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
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

                <div className="bg-[#00c853] p-6 rounded-2xl flex justify-between items-center text-white shadow-lg">
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

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-orange-500" size={20} />
                  <h2 className="text-lg font-bold text-slate-800">
                    Admin Notes
                  </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {job.adminNotes || "No summary provided."}
                </p>
              </div>
            </div>
          )}
          {activeTab === "services" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Technician Activities
                </h3>
                <span className="text-sm text-gray-500">
                  Total: {activities.length} activities
                </span>
              </div>
              <TechnicianActivityViewOnly
                activities={activities}
                isLoading={isActivitiesLoading}
              />
            </div>
          )}

          {activeTab === "parts" && (
            <div className="flex flex-col items-center space-y-4">
              {job.parts?.length > 0 ||
              job.quotationId?.partsList?.length > 0 ? (
                (job.parts || job.quotationId?.partsList || []).map(
                  (p: any, i: number) => (
                    <div
                      key={i}
                      className="w-full sm:w-80 md:w-[400px] lg:w-[450px] p-4 rounded-2xl border border-gray-200 bg-white shadow-md"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                            Part Name
                          </p>
                          <h4 className="text-gray-900 font-bold text-lg">
                            {p.partId?.partName ||
                              p.partName ||
                              "Motor Assembly"}
                          </h4>
                        </div>
                        <div>
                          <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                            Part Number
                          </p>
                          <p className="text-gray-700 font-semibold text-lg">
                            {p.partId?.partNumber ||
                              p.partNumber ||
                              "MOT-12V-350W"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                            Quantity
                          </p>
                          <p className="text-gray-800 font-medium text-lg">
                            {p.quantity || 1}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                            Cost
                          </p>
                          <p className="text-emerald-700 font-bold text-xl">
                            £
                            {p.totalCost?.toLocaleString() ||
                              p.unitCost?.toLocaleString() ||
                              p.total?.toLocaleString() ||
                              "245.00"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                          Replaced At
                        </p>
                        <p className="text-gray-800 font-medium text-sm">
                          {new Date(
                            p.updatedAt || job.createdAt,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }) || "15/01/2024"}
                        </p>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <EmptyState message="No parts recorded" />
              )}
            </div>
          )}
          {activeTab === "inspections" && <ListInspectionJob jobId={job._id} />}
          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* General Notes */}
              {job.generalNotes && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      General Notes
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {job.generalNotes}
                  </p>
                </div>
              )}

              {/* Completion Summary */}
              {job.completionSummary && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <ClipboardCheck size={16} className="text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Completion Summary
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {job.completionSummary}
                  </p>
                </div>
              )}

              {/* Job Notes Messages */}
              {job.jobNotes?.messages?.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-purple-50 rounded-lg">
                      <MessageSquareCode
                        size={16}
                        className="text-purple-600"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Job Notes Messages ({job.jobNotes.messages.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {job.jobNotes.messages.map((msg: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                      >
                        <p className="text-gray-700 text-sm">{msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Notes Images */}
              {job.jobNotes?.images?.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-amber-50 rounded-lg">
                      <ImageIcon size={16} className="text-amber-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Images ({job.jobNotes.images.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {job.jobNotes.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-gray-200"
                      >
                        <a
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                        >
                          View Full
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Notes Message */}
              {!job.generalNotes &&
                !job.completionSummary &&
                !job.jobNotes?.messages?.length &&
                !job.jobNotes?.images?.length && (
                  <EmptyState message="No notes or media recorded" />
                )}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <Package size={48} className="opacity-10 mb-2" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default JobDetailModal;
