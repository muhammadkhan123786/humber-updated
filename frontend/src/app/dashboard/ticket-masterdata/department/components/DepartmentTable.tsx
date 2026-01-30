"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Building2, Trash2 } from "lucide-react";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";
import { toast } from "react-hot-toast";

interface Props {
  data: (IDepartments & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: IDepartments & { _id: string }) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-purple-400 to-indigo-600",
    "bg-gradient-to-br from-teal-400 to-emerald-600",
    "bg-gradient-to-br from-orange-400 to-pink-600",
  ];
  return gradients[index % gradients.length];
};

const DepartmentTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div 
            key={item._id} 
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="p-4 flex items-start justify-between">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Building2 size={18} />
              </div>
              <StatusBadge 
                isActive={!!item.isActive} 
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)} 
                editable={!item.isDefault} 
              />
            </div>
            <div className="px-4 pb-4 space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {item.departmentName}
                {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
              </h3>
              <div className="pt-4">
                <TableActionButton
                  itemName="department"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default departments cannot be deleted.");
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

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px] text-left min-w-max">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Department Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}>
                  <Building2 size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.departmentName}
                  {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
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
                  itemName="department"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default cannot be deleted.");
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

export default DepartmentTable;