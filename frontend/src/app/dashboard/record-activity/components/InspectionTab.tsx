"use client";
import React, { useMemo } from "react";
import { ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

interface InspectionType {
  _id: string;
  technicianInspection: string;
  technicianInspectionDescription: string;
}

interface InspectionTabProps {
  form: UseFormReturn<any>;
  inspectionTypes: InspectionType[];
}

type InspectionStatus = "PENDING" | "PASS" | "FAIL" | "N/A";

interface InspectionItemUI {
  id: string;
  title: string;
  description: string;
  status: InspectionStatus;
  timestamp: string | null;
}

export const InspectionTab = ({
  form,
  inspectionTypes,
}: InspectionTabProps) => {
  const items: InspectionItemUI[] = useMemo(
    () =>
      inspectionTypes.map((item) => ({
        id: item._id,
        title: item.technicianInspection,
        description: item.technicianInspectionDescription,
        status: "PENDING",
        timestamp: null,
      })),
    [inspectionTypes],
  );

  const handleStatusChange = (id: string, newStatus: InspectionStatus) => {
    const now = new Date().toLocaleString();
    const index = inspectionTypes.findIndex((i) => i._id === id);

    if (index === -1) return;

    form.setValue(`inspections.${index}.inspectionTypeId`, id);
    form.setValue(`inspections.${index}.status`, newStatus);
    form.setValue(`inspections.${index}.timestamp`, now);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 px-2 text-[#10B981] font-bold text-sm">
        <ListChecks size={18} />
        <span>Inspection Checklist</span>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const status = form.watch(`inspections.${index}.status`) || "PENDING";
          const timestamp =
            form.watch(`inspections.${index}.timestamp`) || null;

          return (
            <div
              key={item.id}
              className="bg-white border-2 hover:border-green-500 border-gray-50 rounded-[2.5rem] p-6 shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-extrabold text-gray-800 text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {item.description}
                  </p>
                </div>

                {status !== "PENDING" && (
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                      status === "PASS"
                        ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                        : status === "FAIL"
                          ? "bg-red-50 text-red-500 border-red-100"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {status}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-5">
                {(["PASS", "FAIL", "N/A"] as InspectionStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(item.id, s)}
                    className={`flex-1 py-3 rounded-2xl font-bold text-xs border-2 transition-all ${
                      status === s
                        ? s === "PASS"
                          ? "bg-[#10B981] text-white border-[#10B981]"
                          : s === "FAIL"
                            ? "bg-[#EF4444] text-white border-[#EF4444]"
                            : "bg-[#374151] text-white border-[#374151]"
                        : "bg-gray-50 text-gray-400 border-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">
                  Notes
                </label>
                <input
                  type="text"
                  className="w-full bg-[#F9FAFB] border-2 border-gray-50 rounded-2xl px-5 py-3 text-xs mt-1"
                  {...form.register(`inspections.${index}.notes`)}
                />
              </div>

              {timestamp && (
                <p className="text-[10px] text-gray-300 mt-4 ml-2 italic">
                  Checked: {timestamp}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
