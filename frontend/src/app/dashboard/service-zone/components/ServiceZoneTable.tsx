"use client";
import React from "react";
import { Trash2, Star, LocateFixed } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { IServicesZones } from "../../../../../../common/service.zones.interface";

interface Props {
  data: IServicesZones[];
  displayView: "table" | "card";
  onEdit: (data: IServicesZones) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-orange-400 to-red-600",
    "bg-gradient-to-br from-blue-400 to-indigo-600",
    "bg-gradient-to-br from-emerald-400 to-teal-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
  ];
  return gradients[index % gradients.length];
};

const ServiceZoneTable = ({ data, displayView, onEdit, onDelete, onStatusChange }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div key={item._id} className="bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-3 cursor-pointer transform">
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <LocateFixed size={18} />
              </div>
              <StatusBadge 
                isActive={!!item.isActive} 
                editable={!item.isDefault}
                onChange={(val) => item._id && onStatusChange?.(item._id, val)}
              />
            </div>
            <div className="px-4 pb-4 space-y-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                {item.serviceZone}
                {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
              </h3>
              <div className="flex gap-2 pt-4">
                <button onClick={() => onEdit(item)} className="flex-1 flex text-sm items-center justify-center gap-1 py-1 px-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold transition-all hover:text-orange-600">Edit</button>
                <button 
                  onClick={() => {
                    if (item.isDefault) return alert("Default records cannot be deleted.");
                    item._id && onDelete(item._id);
                  }}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-red-50 rounded-lg transition-all"
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
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden rounded-xl">
      <table className="w-full text-left">
        <thead className="bg-[#ECFEFF] text-[#364153]! border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Zone Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}>
                  <LocateFixed size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.serviceZone}
                  {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge 
                  isActive={!!item.isActive} 
                  editable={!item.isDefault}
                  onChange={(val) => item._id && onStatusChange?.(item._id, val)}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton 
                   onEdit={() => onEdit(item)} 
                   onDelete={() => {
                     if (item.isDefault) return alert("Default records cannot be deleted.");
                     item._id && onDelete(item._id);
                   }} 
                />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center py-10 text-gray-400 font-medium">No service zones found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceZoneTable;