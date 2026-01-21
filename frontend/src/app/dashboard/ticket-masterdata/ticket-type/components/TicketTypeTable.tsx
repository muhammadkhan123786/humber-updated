"use client";
import React from "react";
import { Layers, Star, Building, Trash2 } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ITicketType } from "../../../../../../../common/Ticket-management-system/ITicketType.interface";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

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
            className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-300 hover:scale-105 hover:-translate-y-2 cursor-pointer transform"
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
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 flex text-sm items-center justify-center gap-1 py-2 px-3 text-gray-700 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-bold transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (item.isDefault) return alert("Default types cannot be deleted.");
                    onDelete(item._id);
                  }}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete"  
                >
                  <Trash2 size={20} />
                </button>
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
    <div className="bg-white mt-8 shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-orange-50 border-b-2 border-orange-100">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Type Info</th>
            <th className="px-6 py-4 font-bold text-gray-700">Department</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id} className="hover:bg-orange-50/40 transition-colors group">
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
                    <Building size={14} className="text-orange-400" />
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
                    onEdit={() => onEdit(item)} 
                    onDelete={() => {
                      if (item.isDefault) return alert("Default types cannot be deleted.");
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