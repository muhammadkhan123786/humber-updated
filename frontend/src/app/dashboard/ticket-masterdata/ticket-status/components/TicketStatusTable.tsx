"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Tag, Terminal } from "lucide-react";
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";
import { CardData } from "@/app/common-form/DataCard";

interface Props {
  data: (ITicketStatus & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: ITicketStatus & { _id: string }) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const TicketStatusTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {
  
  if (displayView === "card") {
    return (
      <CardData
        data={data}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        getId={(item) => item._id}
        getIsActive={(item) => !!item.isActive}
        getIsDefault={(item) => !!item.isDefault}
        renderIcon={() => <Tag size={18} />}
        renderContent={(item) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {item.label}
                {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
              </h3>
              <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
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
        )}
      />
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden rounded-xl">
      <table className="w-full text-left">
        <thead className="bg-orange-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Code</th>
            <th className="px-6 py-4 font-bold text-gray-700">Label</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Terminal</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-orange-50/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-orange-600">{item.code}</td>
              <td className="px-6 py-4 font-bold text-gray-900">
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
                   onEdit={() => onEdit(item)} 
                   onDelete={() => !item.isDefault ? onDelete(item._id) : alert("Default cannot be deleted")} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketStatusTable;