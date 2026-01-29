"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Settings } from "lucide-react";
import { IServiceType } from "../types";
import { toast } from "react-hot-toast";

interface Props {
  data: IServiceType[];
  displayView: "table" | "card";
  onEdit: (item: IServiceType) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-cyan-400 to-teal-600",
    "bg-gradient-to-br from-indigo-400 to-violet-600",
    "bg-gradient-to-br from-sky-400 to-blue-700",
  ];
  return gradients[index % gradients.length];
};

const ServicesTable = ({ data, displayView, onEdit, onDelete, onStatusChange }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Settings size={18} />
              </div>
              <StatusBadge 
                isActive={!!item.isActive} 
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {item.MasterServiceType}
                  </h3>
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10">
                  {item.description || "No description available"}
                </p>
              </div>

              <div className="pt-4">
                <TableActionButton
                  itemName="service type"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default service types cannot be deleted.");
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
            <p>No service types found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden rounded-xl">
      <table className="w-full text-[16px]! text-left">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Service Type</th>
            <th className="px-6 py-4 font-bold text-gray-700">Description</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors group">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white group-hover:scale-110 transition-transform`}>
                  <Settings size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.MasterServiceType}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 line-clamp-1 max-w-[300px]">
                  {item.description || "-"}
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
                  itemName="service type"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) return toast.error("Default service types cannot be deleted.");
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                No service types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;