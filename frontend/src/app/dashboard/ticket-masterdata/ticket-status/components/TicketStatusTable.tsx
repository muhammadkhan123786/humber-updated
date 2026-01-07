"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star } from "lucide-react";

interface Props {
  data: (ITicketStatus & { _id: string })[];
  onEdit: (item: ITicketStatus & { _id: string }) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const TicketStatusTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">Label</th>
            <th className="px-6 py-4 text-center">Terminal</th>
            <th className="px-6 py-4 text-center">Default</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-blue-600">
                {item.code}
              </td>
              <td className="px-6 py-4 text-gray-800">{item.label}</td>
              <td className="px-6 py-4 text-center">
                {item.is_Terminal ? (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                    Yes
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    No
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {item.isDefault ? (
                  <Star
                    size={20}
                    className="text-yellow-500 fill-yellow-500 mx-auto"
                  />
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge isActive={!!item.isActive} />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault)
                      return alert("Default Ticket Status cannot be deleted.");
                    if (item._id) onDelete(item._id);
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

export default TicketStatusTable;
