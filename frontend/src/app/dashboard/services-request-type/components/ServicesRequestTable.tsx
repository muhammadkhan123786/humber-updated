"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Settings2, Trash2 } from "lucide-react";

interface Props {
  data: any[];
  displayView: "table" | "card";
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const ServiceRequestTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div key={item._id} className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-3 cursor-pointer transform">
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Settings2 size={18} />
              </div>
              <StatusBadge 
                isActive={!!item.isActive} 
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>
            <div className="px-4 pb-4 space-y-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                {item.serviceRequestType}
                {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
              </h3>
              <div className="flex gap-2 pt-4">
                <button onClick={() => onEdit(item)} className="flex-1 flex text-sm items-center justify-center gap-1 py-1 px-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold transition-all hover:text-blue-600">Edit</button>
                <button 
                  onClick={() => {
                    if (item.isDefault) return alert("Default types cannot be deleted.");
                    onDelete(item._id);
                  }} 
                  className={`p-2 bg-gray-50 rounded-lg transition-all ${item.isDefault ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`} 
                  disabled={item.isDefault}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-[16px]! text-left">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}>
                  <Settings2 size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.serviceRequestType}
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
                <TableActionButton onEdit={() => onEdit(item)} onDelete={() => {
                  if (item.isDefault) return alert("Default types cannot be deleted.");
                  onDelete(item._id);
                }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceRequestTable;