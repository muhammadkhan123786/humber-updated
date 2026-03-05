"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface InspectionItem {
  _id: string;
  inspectionTypeId: {
    _id: string;
    technicianInspection: string;
    technicianInspectionDescription?: string;
  };
  status: "PASS" | "FAIL" | "N/A";
  notes: string;
}

interface InspectionData {
  _id: string;
  jobId: string;
  inspectionTIME: "BEFORE SERVICE" | "AFTER SERVICE";
  inspectionSummary: string;
  inspections: InspectionItem[];
  createdAt: string;
  updatedAt: string;
}

interface ListInspectionsProps {
  jobId: string;
}

const ListInspectionJob = ({ jobId }: ListInspectionsProps) => {
  const [inspections, setInspections] = useState<InspectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInspections();
  }, [jobId]);

  const fetchInspections = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();

      const beforeResponse = axios.get(
        `${BASE_URL}/technician-vehicle-inspections/inspectionbyjobid?jobId=${jobId}&inspectionTIME=BEFORE SERVICE`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const afterResponse = axios.get(
        `${BASE_URL}/technician-vehicle-inspections/inspectionbyjobid?jobId=${jobId}&inspectionTIME=AFTER SERVICE`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const [beforeResult, afterResult] = await Promise.all([
        beforeResponse,
        afterResponse,
      ]);

      const allInspections: InspectionData[] = [];

      if (beforeResult.data?.success && beforeResult.data.data) {
        allInspections.push(beforeResult.data.data);
      }

      if (afterResult.data?.success && afterResult.data.data) {
        allInspections.push(afterResult.data.data);
      }

      setInspections(allInspections);
    } catch (err: any) {
      console.error("Error fetching inspections:", err);
      setError(err.response?.data?.message || "Failed to load inspections");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PASS: "bg-emerald-500",
      FAIL: "bg-red-500",
      "N/A": "bg-gray-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle size={16} className="text-emerald-600" />;
      case "FAIL":
        return <XCircle size={16} className="text-red-600" />;
      case "N/A":
        return <MinusCircle size={16} className="text-gray-600" />;
      default:
        return <MinusCircle size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fadeIn">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-500">
          Loading inspections...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500 animate-fadeIn">
        <XCircle size={48} className="opacity-30 mb-2" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (inspections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 animate-fadeIn">
        <Package size={48} className="opacity-10 mb-2 animate-pulse" />
        <p className="text-sm font-medium">No inspections recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {inspections.map((inspection, inspectionIndex) => (
        <div
          key={inspection._id}
          style={{ animationDelay: `${inspectionIndex * 0.1}s` }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeInUp"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-5 border-b border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Clock size={20} className="text-indigo-600" />
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${
                      inspection.inspectionTIME === "BEFORE SERVICE"
                        ? "bg-blue-600"
                        : "bg-green-600"
                    }`}
                  >
                    {inspection.inspectionTIME}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(inspection.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            {inspection.inspectionSummary && (
              <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-gray-500" />
                  <p className="text-xs font-bold text-gray-600 uppercase">
                    Summary
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {inspection.inspectionSummary}
                </p>
              </div>
            )}
          </div>

          {/* Inspection Items */}
          <div className="p-5 space-y-3">
            {inspection.inspections.map((item, itemIndex) => (
              <div
                key={item._id}
                style={{
                  animationDelay: `${inspectionIndex * 0.1 + itemIndex * 0.05}s`,
                }}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all animate-fadeInUp"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(item.status)}
                      <h4 className="text-sm font-bold text-gray-900">
                        {item.inspectionTypeId?.technicianInspection ||
                          "Inspection Item"}
                      </h4>
                    </div>
                    {item.inspectionTypeId?.technicianInspectionDescription && (
                      <p className="text-xs text-gray-500 ml-6">
                        {item.inspectionTypeId.technicianInspectionDescription}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Notes */}
                {item.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-gray-700">{item.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100 flex justify-between items-center text-xs">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-600" />
                <span className="font-semibold text-gray-700">
                  {
                    inspection.inspections.filter((i) => i.status === "PASS")
                      .length
                  }{" "}
                  Pass
                </span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle size={14} className="text-red-600" />
                <span className="font-semibold text-gray-700">
                  {
                    inspection.inspections.filter((i) => i.status === "FAIL")
                      .length
                  }{" "}
                  Fail
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MinusCircle size={14} className="text-gray-600" />
                <span className="font-semibold text-gray-700">
                  {
                    inspection.inspections.filter((i) => i.status === "N/A")
                      .length
                  }{" "}
                  N/A
                </span>
              </div>
            </div>
            <span className="text-gray-500">
              Total: {inspection.inspections.length} items
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListInspectionJob;
