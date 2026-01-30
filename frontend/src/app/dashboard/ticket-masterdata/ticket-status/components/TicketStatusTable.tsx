"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Tag, Terminal } from "lucide-react";
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";
import { toast } from "react-hot-toast";

interface Props {
  data: (ITicketStatus & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: ITicketStatus & { _id: string }) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-orange-400 to-orange-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-blue-400 to-blue-600",
  ];
  return gradients[index % gradients.length];
};

const TicketStatusTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 ">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Header Section with Icon and Toggle */}
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Tag size={18} />
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {item.label}
                    {item.isDefault && (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    )}
                  </h3>
                  <span className="text-xs font-mono bg-orange-50 text-orange-600 px-2 py-1 rounded-md border border-orange-100">
                    {item.code}
                  </span>
                </div>
                <div className="flex gap-2">
                  {item.is_Terminal && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      <Terminal size={10} /> Terminal
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <TableActionButton
                  itemName="ticket status"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default status cannot be deleted.");
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
            <p>No ticket statuses found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px]! text-left min-w-max">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Code</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Label</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Terminal</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-orange-600 whitespace-nowrap">{item.code}</td>
              <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {item.label}
                  {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                {item.is_Terminal ? (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Yes</span>
                ) : (
                  <span className="text-gray-300">-</span>
                )}
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
                  itemName="ticket status"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default status cannot be deleted.");
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
                No ticket statuses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketStatusTable;