"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Gavel } from "lucide-react";
import { IDecision } from "../../../../../../common/master-interfaces/IDecision.interface";
import { toast } from "react-hot-toast";

interface Props {
  data: (IDecision & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: IDecision & { _id: string }) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

// Helper to get gradient
const getGradient = (hex: string) => {
  if (!hex) return '#3b82f6';
  // Check if it's already a gradient (if stored that way in future)
  if (hex.startsWith('linear')) return hex;
  
  // Same logic as form
  const adjust = (color: string, amount: number) => {
      // Basic hex validation/cleaning
      const c = color.replace('#', '');
      if (c.length !== 6) return color;
      return '#' + c.replace(/../g, co => ('0'+Math.min(255, Math.max(0, parseInt(co, 16) + amount)).toString(16)).substr(-2));
  }
  return `linear-gradient(135deg, ${hex}, ${adjust(hex, -40)})`;
};

const TicketDecisionTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {
  // Card View
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Header Section with Icon and Toggle */}
            <div className="p-4 flex items-start justify-between bg-white">
              <div 
                className="p-3 rounded-xl text-white shadow-sm"
                style={{ background: getGradient(item.color) }}
              >
                <Gavel size={18} />
              </div>

              {/* Status Toggle Switch */}
              <StatusBadge
                isActive={!!item.isActive}
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            {/* Content Section */}
            <div className="px-4 pb-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {item.decision}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <TableActionButton
                  itemName="decision"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default decisions cannot be deleted.");
                    }
                    onDelete(item._id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No tickect decisions found.</p>
          </div>
        )}
      </div>
    );
  }

  // Table View (Default)
  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px]! text-left min-w-max">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Color</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Decision</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Description</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div 
                    className="p-3 rounded-lg w-fit text-white shadow-sm"
                    style={{ background: getGradient(item.color) }}
                >
                  <Gavel size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {item.decision}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={item.description}>
                {item.description}
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
                  itemName="decision"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default decisions cannot be deleted.");
                    }
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                No decisions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketDecisionTable;
