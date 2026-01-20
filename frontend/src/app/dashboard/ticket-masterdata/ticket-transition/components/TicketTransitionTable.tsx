"use client";

import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { ArrowRight, GitCompare, Ticket, Star, XCircle } from "lucide-react";
import { PopulatedTransition } from "./TicketTransitionClient";

interface Props {
  data: PopulatedTransition[];
  displayView: "table" | "card";
  onEdit: (item: PopulatedTransition) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

// Icon colors for different transitions
const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const TicketTransitionTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
  themeColor,
}: Props) => {
  // Card View
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
        {data.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-3 cursor-pointer transform"
          >
            {/* Header Section with Icon and Toggle */}
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <GitCompare size={18} />
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
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {item.from_status_id?.code || "INITIAL"}
                  <ArrowRight size={16} className="text-blue-500" />
                  {item.to_status_id?.code || "END"}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Ticket size={14} className="text-gray-400" />
                  {item.ticket_type_id?.code || "GENERAL"} • {item.action_id?.code || "AUTO"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 flex text-sm items-center justify-center gap-1 py-1 px-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold transition-all hover:text-blue-600"
                >
                    Edit
                </button>
                <button
                  onClick={() => {
                    if (item.isDefault) {
                      alert("Default transitions cannot be deleted.");
                      return;
                    }
                    onDelete(item._id);
                  }}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"  
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No transition rules found.</p>
          </div>
        )}
      </div>
    );
  }

  // Table View (Default)
  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-[16px]! text-left">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">From Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Trigger Action</th>
            <th className="px-6 py-4 font-bold text-gray-700">To Status</th>
            <th className="px-6 py-4 font-bold text-gray-700">Ticket Type</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200">
                  {item.from_status_id?.code || "INITIAL"}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-orange-600 font-bold text-[10px] uppercase tracking-wider bg-orange-50 border border-orange-200 px-2 py-0.5 rounded shadow-sm">
                    {item.action_id?.code || "AUTO"}
                  </span>
                  <ArrowRight size={14} className="text-gray-400 mt-1" />
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200 shadow-sm">
                    {item.to_status_id?.code || "END"}
                  </span>
                  {item.isDefault && (
                    <span title="Default Transition">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Ticket size={14} className="text-gray-400" />
                  <span className="font-medium text-sm">
                    {item.ticket_type_id?.code || "GENERAL"}
                  </span>
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
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault)
                      return alert("Default transitions cannot be deleted.");
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No transition rules found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTransitionTable;
