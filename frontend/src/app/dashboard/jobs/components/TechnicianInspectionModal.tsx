"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ClipboardList, CheckCircle, XCircle, MinusCircle, Save, Loader2, ArrowLeft } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface InspectionType {
  _id: string;
  technicianInspection: string;
  technicianInspectionDescription?: string;
  isActive: boolean;
}

interface InspectionItem {
  inspectionTypeId: string;
  status: "PASS" | "FAIL" | "N/A" | "PENDING";
  notes: string;
}

interface TechnicianInspectionProps {
  job: any;
  onBack: () => void;
}

const TechnicianInspection = ({ job, onBack }: TechnicianInspectionProps) => {
  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([]);
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const [inspectionTime, setInspectionTime] = useState<"BEFORE SERVICE" | "AFTER SERVICE">("BEFORE SERVICE");
  const [inspectionSummary, setInspectionSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingTypes, setFetchingTypes] = useState(false);
  const [existingInspectionId, setExistingInspectionId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadInspectionData();
  }, [inspectionTime]);

  const loadInspectionData = async () => {
    setFetchingTypes(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();
      
      // Fetch inspection types first
      const typesResponse = await axios.get(`${BASE_URL}/technician-inspection`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!typesResponse.data?.success) {
        toast.error("Failed to load inspection types");
        return;
      }

      const activeTypes = typesResponse.data.data.filter((type: InspectionType) => type.isActive);
      setInspectionTypes(activeTypes);

      // Then try to fetch existing inspection
      try {
        const existingResponse = await axios.get(
          `${BASE_URL}/technician-vehicle-inspections/inspectionbyjobid?jobId=${job._id}&inspectionTIME=${inspectionTime}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (existingResponse.data?.success && existingResponse.data.data) {
          // Existing inspection found - prefill mode
          const existingData = existingResponse.data.data;
          setExistingInspectionId(existingData._id);
          setInspectionSummary(existingData.inspectionSummary || "");
          setIsEditMode(true);

          // Create a map of existing inspections by inspectionTypeId
          const existingMap = new Map<string, { status: "PASS" | "FAIL" | "N/A"; notes: string }>(
            existingData.inspections.map((item: any) => [
              item.inspectionTypeId._id || item.inspectionTypeId,
              { status: item.status, notes: item.notes || "" }
            ])
          );

          // Merge with current inspection types
          const mergedInspections = activeTypes.map((type: InspectionType) => {
            const existing = existingMap.get(type._id);
            return existing
              ? { inspectionTypeId: type._id, status: existing.status, notes: existing.notes }
              : { inspectionTypeId: type._id, status: "PENDING" as const, notes: "" };
          });

          setInspections(mergedInspections);
        } else {
          // No existing inspection - create mode
          setExistingInspectionId(null);
          setIsEditMode(false);
          setInspectionSummary("");
          setInspections(
            activeTypes.map((type: InspectionType) => ({
              inspectionTypeId: type._id,
              status: "PENDING" as const,
              notes: "",
            }))
          );
        }
      } catch (error) {
        // No existing inspection - create mode
        console.log("No existing inspection found");
        setExistingInspectionId(null);
        setIsEditMode(false);
        setInspectionSummary("");
        setInspections(
          activeTypes.map((type: InspectionType) => ({
            inspectionTypeId: type._id,
            status: "PENDING" as const,
            notes: "",
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to load inspection data");
    } finally {
      setFetchingTypes(false);
    }
  };

  const updateInspectionStatus = (index: number, status: "PASS" | "FAIL" | "N/A") => {
    setInspections((prev) => prev.map((item, i) => (i === index ? { ...item, status } : item)));
  };

  const updateInspectionNotes = (index: number, notes: string) => {
    setInspections((prev) => prev.map((item, i) => (i === index ? { ...item, notes } : item)));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PASS: "bg-green-100 text-green-600",
      FAIL: "bg-red-100 text-red-600",
      "N/A": "bg-gray-100 text-gray-600",
      PENDING: "bg-amber-100 text-amber-600",
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const getButtonStyle = (current: string, target: string) => {
    if (current !== target) return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    const styles = {
      PASS: "bg-green-600 text-white",
      FAIL: "bg-red-600 text-white",
      "N/A": "bg-gray-700 text-white",
    };
    return styles[target as keyof typeof styles];
  };

  const handleSave = async () => {
    const completedInspections = inspections.filter((item) => item.status !== "PENDING");

    if (completedInspections.length === 0) {
      toast.error("Please complete at least one inspection");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim() || "";
      
      // Extract technician ID from token
      let technicianId = job.technicianId?._id || job.technicianId;
      if (!technicianId) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        technicianId = tokenPayload.technicianId;
      }

      const payload = {
        jobId: job._id,
        tecnicianId: technicianId,
        inspectionTIME: inspectionTime,
        inspectionSummary: inspectionSummary || "Inspection completed",
        inspections: completedInspections.map((item) => ({
          inspectionTypeId: item.inspectionTypeId,
          status: item.status,
          notes: item.notes || "",
        })),
      };

      // Use PUT for update, POST for create
      const url = isEditMode && existingInspectionId
        ? `${BASE_URL}/technician-vehicle-inspections/${existingInspectionId}`
        : `${BASE_URL}/technician-vehicle-inspections`;
      
      const method = isEditMode && existingInspectionId ? 'put' : 'post';

      const response = await axios[method](
        url,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast.success(isEditMode ? "Inspection updated successfully!" : "Inspection saved successfully!");
        onBack();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'save'} inspection`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <ClipboardList size={32} className="text-green-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Inspection Checklist</h2>
                    {isEditMode && (
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        EDITING
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Job: {job?.jobId}</p>
                </div>
              </div>
            </div>
          
          </div>
        </div>

        {/* Inspection Time & Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Inspection Time
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setInspectionTime("BEFORE SERVICE")}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                    inspectionTime === "BEFORE SERVICE"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Before Service
                </button>
                <button
                  onClick={() => setInspectionTime("AFTER SERVICE")}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                    inspectionTime === "AFTER SERVICE"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  After Service
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Summary (Optional)
              </label>
              <textarea
                value={inspectionSummary}
                onChange={(e) => setInspectionSummary(e.target.value)}
                placeholder="Add overall summary..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Inspections List */}
        {fetchingTypes ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
            <p className="text-gray-400 font-medium">Loading inspections...</p>
          </div>
        ) : inspectionTypes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20 text-center text-gray-500">
            No active inspection types found
          </div>
        ) : (
          <div className="space-y-4">
            {inspectionTypes.map((type, index) => {
              const inspection = inspections[index];
              return (
                <div
                  key={type._id}
                  className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 hover:border-green-500 transition-all duration-200 p-5"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {type.technicianInspection}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {type.technicianInspectionDescription || "Check and verify the inspection item"}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-sm ${getStatusColor(
                        inspection?.status || "PENDING"
                      )}`}
                    >
                      {inspection?.status === "N/A" ? "NOT-APPLICABLE" : inspection?.status || "PENDING"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => updateInspectionStatus(index, "PASS")}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${getButtonStyle(
                        inspection?.status,
                        "PASS"
                      )}`}
                    >
                      <CheckCircle size={16} />
                      Pass
                    </button>
                    <button
                      onClick={() => updateInspectionStatus(index, "FAIL")}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${getButtonStyle(
                        inspection?.status,
                        "FAIL"
                      )}`}
                    >
                      <XCircle size={16} />
                      Fail
                    </button>
                    <button
                      onClick={() => updateInspectionStatus(index, "N/A")}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${getButtonStyle(
                        inspection?.status,
                        "N/A"
                      )}`}
                    >
                      <MinusCircle size={16} />
                      N/A
                    </button>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600  mb-2 uppercase tracking-wide">
                      Notes
                    </label>
                    <textarea
                      value={inspection?.notes || ""}
                      onChange={(e) => updateInspectionNotes(index, e.target.value)}
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 bg-gray-200 text-gray-700  border border-gray-300 rounded-lg text-sm focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all outline-none resize-none"
                      rows={2}
                    />
                  </div>
                  
                  {/* Timestamp (if inspection is completed) */}
                  {inspection?.status !== "PENDING" && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Checked: {new Date().toLocaleDateString("en-GB")}, {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-end mt-3">
          <button
              onClick={handleSave}
              disabled={loading || fetchingTypes}
              className="px-6 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> {isEditMode ? 'Updating...' : 'Saving...'}</>
              ) : (
                <><Save size={18} /> {isEditMode ? 'Update Inspection' : 'Save Inspection'}</>
              )}
            </button>
            </div>
      </div>
    </div>
  );
};

export default TechnicianInspection;
