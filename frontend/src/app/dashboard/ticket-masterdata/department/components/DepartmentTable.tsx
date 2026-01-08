import React from "react";
import { Building2, Star } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

export default function DepartmentTable({ data, onEdit, onDelete, themeColor }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4">Department Name</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Default</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item: IDepartments) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={18} /></div>
                  <span className="font-bold text-gray-800">{item.departmentName}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge isActive={!!item.isActive} />
              </td>
              <td className="px-6 py-4 text-center">
                {item.isDefault ? <Star size={18} className="inline text-yellow-500 fill-yellow-500" /> : "-"}
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton 
                  onEdit={() => onEdit(item)} 
                  onDelete={() => onDelete(item._id!)} 
                  isDefault={item.isDefault}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}