"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  data: any[];
  displayView: "table" | "card";
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const PriorityLevelTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {

  // Sort data by index (ascending) before rendering
  const sortedData = [...data].sort((a, b) => (Number(a.index) || 0) - (Number(b.index) || 0));

  // --- Card View ---
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedData.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="p-4 flex items-start justify-between bg-white">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-100"
                  style={{ background: item.backgroundColor || '#3b82f6' }}
                >
                 
                </div>
                {/* Index Badge */}
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 border border-gray-200">
                  #{item.index ?? 0}
                </span>
              </div>
              <StatusBadge
                isActive={!!item.isActive}
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 transition-colors">
                  {item.serviceRequestPrioprity}
                </h3>
                {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 h-10 italic">
                {item.description || "No description provided."}
              </p>

              <div className="pt-4">
                <TableActionButton
                  itemName="priority level"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default priorities cannot be deleted.");
                    }
                    onDelete(item._id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Table View (Default) ---
  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px]! text-left min-w-max">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 w-20 text-center whitespace-nowrap">Order</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Tag</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Priority Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4 text-center">
                <span className="font-mono bg-gray-50 px-2 py-1 rounded text-gray-600 text-sm border border-gray-100">
                  {item.index ?? 0}
                </span>
              </td>
              <td className="px-6 py-4">
                <div
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-100"
                  style={{ background: item.backgroundColor }}
                />
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.serviceRequestPrioprity}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge
                  isActive={!!item.isActive}
                  onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                  editable={!item.isDefault}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  itemName="priority level"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default priorities cannot be deleted.");
                    }
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriorityLevelTable;