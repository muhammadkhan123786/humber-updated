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
  Briefcase,
  Wrench,
  ListTodo,
  Search,
  ImageIcon,
  MessageSquare,
  MessageSquareCode,
} from "lucide-react";
import { jobsAnimations } from "./JobsAnimation";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <style>{jobsAnimations}</style>
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideUp max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-start bg-gray-50/50 animate-slideDown">
          <div>
            <div className="flex items-center gap-3 mb-1 animate-slideInLeft">
              <h2 className="font-semibold text-2xl bg-linear-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {job.jobId}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm animate-slideInLeft animate-delay-100">
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
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fadeInUp">
                <div className="flex items-center gap-2 mb-6 animate-slideInLeft">
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

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fadeInUp animate-delay-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-orange-500" size={20} />
                  <h2 className="text-lg font-bold text-slate-800">
                    Completion Summary
                  </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {job.completionSummary || "No summary provided."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="grid grid-cols-1 gap-4">
              {job.services?.length > 0 ? (
                job.services.map((s: any, i: number) => {
                  const isDiagnostic =
                    s.description?.toLowerCase().includes("diagnostic") ||
                    s.description?.toLowerCase().includes("fault");

                  const isRepair =
                    s.description?.toLowerCase().includes("repair") ||
                    (i % 3 === 0 && !isDiagnostic);
                  const isJob =
                    s.description?.toLowerCase().includes("job") ||
                    (i % 3 === 1 && !isDiagnostic);

                  return (
                    <div
                      key={i}
                      style={{ animationDelay: `${i * 0.1}s` }}
                      className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between animate-fadeInUp"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl ${
                              isDiagnostic
                                ? "bg-purple-100 text-purple-600"
                                : isRepair
                                  ? "bg-orange-100 text-orange-600"
                                  : isJob
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-emerald-100 text-emerald-600"
                            }`}
                          >
                            {isDiagnostic ? (
                              <Search size={20} />
                            ) : isRepair ? (
                              <Wrench size={20} />
                            ) : isJob ? (
                              <Briefcase size={20} />
                            ) : (
                              <ListTodo size={20} />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white w-fit ${
                                isDiagnostic
                                  ? "bg-purple-500"
                                  : isRepair
                                    ? "bg-orange-500"
                                    : isJob
                                      ? "bg-blue-500"
                                      : "bg-emerald-500"
                              }`}
                            >
                              {isDiagnostic
                                ? "DIAGNOSTIC"
                                : isRepair
                                  ? "REPAIR"
                                  : isJob
                                    ? "JOB"
                                    : "SERVICE"}
                            </span>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-gray-800 text-xs font-semibold">
                                {s.date || "15/01/2024"}
                              </span>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-gray-800 text-xs font-semibold">
                                {s.time || "09:30:00"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            Duration
                          </p>
                          <p
                            className={`font-black text-lg leading-tight ${
                              isDiagnostic
                                ? "text-purple-600"
                                : isRepair
                                  ? "text-orange-600"
                                  : isJob
                                    ? "text-blue-600"
                                    : "text-emerald-600"
                            }`}
                          >
                            {s.duration || "45"}m
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-gray-800 font-bold text-base">
                          {s.description ||
                            "Initial system diagnostic and fault identification"}
                        </h4>

                        {s.additionalNotes && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {s.additionalNotes ||
                                "Found battery connection issue and motor fault"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full">
                  <EmptyState message="No services recorded" />
                </div>
              )}
            </div>
          )}

          {activeTab === "parts" && (
            <div className="flex flex-col items-center space-y-4">
              {job.parts?.length > 0 ? (
                job.parts.map((p: any, i: number) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    className="w-full sm:w-80 md:w-[400px] lg:w-[450px] p-4 rounded-2xl border border-gray-200 bg-white shadow-md animate-fadeInUp"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                          Part Name
                        </p>
                        <h4 className="text-gray-900 font-bold text-lg">
                          {p.partId?.partName || "Motor Assembly"}
                        </h4>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                          Part Number
                        </p>
                        <p className="text-gray-700 font-semibold text-lg">
                          {p.partId?.partNumber || "MOT-12V-350W"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                          Old Part Condition
                        </p>
                        <p className="text-gray-800 font-medium text-sm">
                          {p.oldPartConditionDescription ||
                            "Damaged - burnt wiring"}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                          New Serial Number
                        </p>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 font-bold text-sm rounded-lg">
                          {p.newSerialNumber || "SN-MOT-2024-0125"}
                        </span>
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
                            "245.00"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="flex items-center gap-2 font-medium select-none text-xs text-gray-600 uppercase mb-1">
                        Reason for Change
                      </p>
                      <p className="text-gray-800 font-medium text-sm">
                        {p.reasonForChange ||
                          "Motor failure due to electrical short"}
                      </p>
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
                ))
              ) : (
                <EmptyState message="No parts recorded" />
              )}
            </div>
          )}

          {activeTab === "inspections" && (
            <div className="space-y-4">
              {job.inspections?.length > 0 ? (
                job.inspections.map((ins: any, i: number) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-indigo-200 transition-all animate-fadeInUp"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${ins.status === "PASS" ? "bg-emerald-500" : ins.status === "FAIL" ? "bg-red-500" : "bg-gray-500"}`}
                      >
                        {ins.status || "N/A"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        TYPE ID: {ins.inspectionTypeId?.slice(-6) || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Inspector Notes
                      </p>
                      <p className="text-gray-600 text-sm italic">
                        {ins.notes || "No notes provided"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No inspections recorded" />
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* General Notes */}
              {job.generalNotes && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeInUp">
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
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeInUp animate-delay-100">
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
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeInUp animate-delay-200">
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
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeInUp animate-delay-300">
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
                        <img
                          src={img}
                          alt={`Job note ${idx + 1}`}
                          className="w-full h-32 object-cover"
                        />
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

export default JobDetailModal;