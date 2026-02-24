"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, ClipboardList, CheckCircle, XCircle, MinusCircle, Save, Loader2 } from "lucide-react";

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

interface TechnicianInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

const TechnicianInspectionModal = ({ isOpen, onClose, job }: TechnicianInspectionModalProps) => {
  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([]);
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const [inspectionTime, setInspectionTime] = useState<"BEFORE SERVICE" | "AFTER SERVICE">("BEFORE SERVICE");
  const [inspectionSummary, setInspectionSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingTypes, setFetchingTypes] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch inspection types
  useEffect(() => {
    if (isOpen) {
      console.log("Job object in modal:", job);
      fetchInspectionTypes();
    }
  }, [isOpen]);

  const fetchInspectionTypes = async () => {
    setFetchingTypes(true);
    try {
      const rawToken = localStorage.getItem("token");
      const cleanToken = rawToken ? rawToken.replace(/"/g, "").trim() : "";
      
      const response = await axios.get(`${BASE_URL}/technician-inspection`, {
        headers: { Authorization: `Bearer ${cleanToken}` },
      });

      if (response.data?.success) {
        const activeTypes = response.data.data.filter((type: InspectionType) => type.isActive);
        setInspectionTypes(activeTypes);
        
        // Initialize inspections with PENDING status
        const initialInspections = activeTypes.map((type: InspectionType) => ({
          inspectionTypeId: type._id,
          status: "PENDING" as const,
          notes: "",
        }));
        setInspections(initialInspections);
      }
    } catch (error: any) {
      console.error("Error fetching inspection types:", error);
      toast.error("Failed to load inspection types");
    } finally {
      setFetchingTypes(false);
    }
  };

  const updateInspectionStatus = (index: number, status: "PASS" | "FAIL" | "N/A") => {
    const newInspections = [...inspections];
    newInspections[index].status = status;
    setInspections(newInspections);
  };

  const updateInspectionNotes = (index: number, notes: string) => {
    const newInspections = [...inspections];
    newInspections[index].notes = notes;
    setInspections(newInspections);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
        return "bg-green-500 text-white";
      case "FAIL":
        return "bg-red-500 text-white";
      case "N/A":
        return "bg-gray-700 text-white";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getButtonClass = (currentStatus: string, buttonStatus: string) => {
    if (currentStatus === buttonStatus) {
      switch (buttonStatus) {
        case "PASS":
          return "bg-green-500 text-white shadow-lg";
        case "FAIL":
          return "bg-red-500 text-white shadow-lg";
        case "N/A":
          return "bg-gray-700 text-white shadow-lg";
        default:
          return "bg-gray-200 text-gray-700";
      }
    }
    return "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  const handleSave = async () => {
    // Validate that at least one inspection has been checked
    const hasCheckedInspections = inspections.some(
      (inspection) => inspection.status !== "PENDING"
    );

    if (!hasCheckedInspections) {
      toast.error("Please complete at least one inspection");
      return;
    }

    console.log("Full Job object:", JSON.stringify(job, null, 2));
    
    // Extract technicianId - try multiple possible paths
    let technicianId = 
      job.technicianId?._id || 
      job.technicianId || 
      job.technician?.id ||
      job.technician?._id;
    
    console.log("Extracted technicianId:", technicianId);
    
    // If still not found, try to get from localStorage/token as fallback
    if (!technicianId) {
      try {
        const rawToken = localStorage.getItem("token");
        const cleanToken = rawToken ? rawToken.replace(/"/g, "").trim() : "";
        const tokenParts = cleanToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          technicianId = payload.technicianId;
          console.log("Extracted technicianId from token:", technicianId);
        }
      } catch (e) {
        console.error("Error extracting from token:", e);
      }
    }
    
    if (!technicianId) {
      console.error("Job object:", job);
      console.error("Could not find technicianId anywhere");
      toast.error("Technician ID not found. Please try again.");
      return;
    }

    if (!job._id) {
      console.error("Job object:", job);
      toast.error("Job ID not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const rawToken = localStorage.getItem("token");
      const cleanToken = rawToken ? rawToken.replace(/"/g, "").trim() : "";

      const payload = {
        jobId: job._id,
        tecnicianId: technicianId,
        inspectionTIME: inspectionTime,
        inspectionSummary: inspectionSummary || "Inspection completed",
        inspections: inspections
          .filter((inspection) => inspection.status !== "PENDING") // Only send completed inspections
          .map((inspection) => ({
            inspectionTypeId: inspection.inspectionTypeId,
            status: inspection.status,
            notes: inspection.notes || "",
          })),
      };

      console.log("Payload being sent:", payload);

      const response = await axios.post(
        `${BASE_URL}/technician-vehicle-inspections`,
        payload,
        {
          headers: { Authorization: `Bearer ${cleanToken}` },
        }
      );
      console.log("API response from save inspection:", response);


      if (response.data?.success) {
        toast.success("Inspection saved successfully!");
        onClose();
      }
    } catch (error: any) {
      console.error("Error saving inspection:", error);
      toast.error(error.response?.data?.message || "Failed to save inspection");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 via-emerald-500 to-teal-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ClipboardList size={32} className="text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Inspection Checklist</h2>
              <p className="text-green-100 text-sm">Job: {job?.jobId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Inspection Time Selector */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Inspection Time
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setInspectionTime("BEFORE SERVICE")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                inspectionTime === "BEFORE SERVICE"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Before Service
            </button>
            <button
              onClick={() => setInspectionTime("AFTER SERVICE")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                inspectionTime === "AFTER SERVICE"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              After Service
            </button>
          </div>
        </div>

        {/* Inspection Summary */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Inspection Summary (Optional)
          </label>
          <textarea
            value={inspectionSummary}
            onChange={(e) => setInspectionSummary(e.target.value)}
            placeholder="Add overall inspection summary..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        {/* Inspections List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {fetchingTypes ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="animate-spin text-green-600" size={48} />
              <p className="mt-4 text-gray-400 font-medium">Loading inspections...</p>
            </div>
          ) : inspectionTypes.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No active inspection types found
            </div>
          ) : (
            inspectionTypes.map((type, index) => {
              const inspection = inspections[index];
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={type._id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                    isHovered ? "border-green-500 shadow-lg" : "border-gray-200"
                  }`}
                >
                  {/* Inspection Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {type.technicianInspection}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {type.technicianInspectionDescription || "Check and verify the inspection item"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                        inspection?.status || "PENDING"
                      )}`}
                    >
                      {inspection?.status || "PENDING"}
                    </span>
                  </div>

                  {/* Status Buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => updateInspectionStatus(index, "PASS")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${getButtonClass(
                        inspection?.status,
                        "PASS"
                      )}`}
                    >
                      <CheckCircle size={18} />
                      Pass
                    </button>
                    <button
                      onClick={() => updateInspectionStatus(index, "FAIL")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${getButtonClass(
                        inspection?.status,
                        "FAIL"
                      )}`}
                    >
                      <XCircle size={18} />
                      Fail
                    </button>
                    <button
                      onClick={() => updateInspectionStatus(index, "N/A")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${getButtonClass(
                        inspection?.status,
                        "N/A"
                      )}`}
                    >
                      <MinusCircle size={18} />
                      N/A
                    </button>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={inspection?.notes || ""}
                      onChange={(e) => updateInspectionNotes(index, e.target.value)}
                      placeholder="Add notes..."
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || fetchingTypes}
            className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Inspection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianInspectionModal;
