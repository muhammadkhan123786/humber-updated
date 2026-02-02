"use client";

import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Palette, Trash2 } from "lucide-react";
import { IColor } from "../../../../../../../common/IColor.interface";

interface Props {
  data: (IColor & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: IColor & { _id: string }) => void;
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

const ColorsTable = ({ data, displayView, onEdit, onDelete, onStatusChange, themeColor }: Props) => {
  
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-3 cursor-pointer transform"
          >
            <div className="p-4 flex items-start justify-between bg-white">
              <div 
                className="w-12 h-12 rounded-xl shadow-inner border-4 border-white"
                style={{ backgroundColor: item.colorCode }}
              />
              <StatusBadge 
                isActive={!!item.isActive} 
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            <div className="px-4 pb-4 space-y-1">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {item.colorName}
                {item.isDefault && <Star size={14} className="fill-yellow-500 text-yellow-500" />}
              </h3>
              <p className="text-xs font-mono text-gray-500 uppercase">{item.colorCode}</p>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 py-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-semibold transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => !item.isDefault && onDelete(item._id)}
                  className={`p-2 rounded-lg transition-all ${item.isDefault ? 'opacity-20 cursor-not-allowed' : 'bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
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
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px]! text-left min-w-max">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Preview</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Name & Code</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: item.colorCode }}
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    {item.colorName}
                    {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                  </div>
                  <span className="text-xs font-mono text-gray-500 uppercase">{item.colorCode}</span>
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
                    if (item.isDefault) return alert("Default cannot be deleted.");
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

export default ColorsTable;