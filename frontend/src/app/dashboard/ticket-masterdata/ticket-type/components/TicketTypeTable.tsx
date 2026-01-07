"use client";
import React from "react";
import { Layers, Star, Building } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ITicketType } from "../../../../../../../common/Ticket-management-system/ITicketType.interface";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

// Interface for Populated Data (Jahan departmentId object hota hai)
export interface IPopulatedTicketType extends Omit<ITicketType, 'departmentId'> {
  departmentId: IDepartments; 
}

interface TableProps {
  data: IPopulatedTicketType[];
  onEdit: (item: IPopulatedTicketType) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

export default function TicketTypeTable({ data, onEdit, onDelete, themeColor }: TableProps) {
    console.log("this is my data", data)
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4">Type Info</th>
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Default</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Layers size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{item.code}</div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building size={14} className="text-gray-400" />
                    {/* Safe check for populated departmentName */}
                    {typeof item.departmentId === 'object' 
                      ? item.departmentId?.departmentName 
                      : "Unassigned"}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge isActive={!!item.isActive} />
                </td>
                <td className="px-6 py-4 text-center">
                  {item.isDefault ? (
                    <Star size={18} className="inline text-yellow-500 fill-yellow-500" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <TableActionButton 
                    onEdit={() => onEdit(item)} 
                    onDelete={() => onDelete(item._id!)} 
                    isDefault={item.isDefault} 
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400 italic">
                No ticket types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}