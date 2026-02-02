"use client";
import React from "react";
import { Layers, Star, Building, Trash2 } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ITicketType } from "../../../../../../../common/Ticket-management-system/ITicketType.interface";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";
import { toast } from "react-hot-toast";

// Interface for Populated Data
export interface IPopulatedTicketType extends Omit<ITicketType, 'departmentId'> {
  _id: string;
  departmentId: IDepartments; 
}

interface TableProps {
  data: IPopulatedTicketType[];
  displayView: "table" | "card";
  onEdit: (item: IPopulatedTicketType) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

// Icon gradients for Card view
const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

export default function TicketTypeTable({ 
  data, 
  displayView, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  themeColor 
}: TableProps) {

  // --- Card View ---
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-300 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Header Section */}
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white shadow-lg`}>
                <Layers size={18} />
              </div>
              
              <StatusBadge 
                isActive={!!item.isActive}
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            {/* Content Section */}
            <div className="px-5 pb-5 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {item.code}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full">
                <Building size={12} />
                {typeof item.departmentId === 'object' ? item.departmentId?.departmentName : "Unassigned"}
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <TableActionButton
                  itemName="ticket type"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) return toast.error("Default types cannot be deleted.");
                    onDelete(item._id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📂</div>
            <p className="font-medium italic">No ticket types found.</p>
          </div>
        )}
      </div>
    );
  }

  // --- Table View (Default) ---
  return (
    <div className="bg-white mt-8 shadow-xl border border-gray-200 rounded-2xl overflow-x-auto">
      <table className="w-full text-left min-w-max">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Type Info</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Department</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`${getIconGradient(index)} p-3 rounded-lg text-white shadow-sm`}>
                      <Layers size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        {item.code}
                        {item.isDefault && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{item.label}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <Building size={14} className="text-blue-400" />
                    {typeof item.departmentId === 'object' 
                      ? item.departmentId?.departmentName 
                      : <span className="text-gray-300 italic">Unassigned</span>}
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
                    itemName="ticket type"
                    onEdit={() => onEdit(item)} 
                    onDelete={() => {
                      if (item.isDefault) return toast.error("Default cannot be deleted.");
                      onDelete(item._id);
                    }} 
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-20 text-gray-400 italic">
                No ticket types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}