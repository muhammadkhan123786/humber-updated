"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Layers, Trash2 } from "lucide-react";
import { ISubServicesInterface } from "../../../../../../common/ISubServices.interface"; // Adjust path

interface Props {
  data: ISubServicesInterface[];
  displayView?: "table" | "card"; // Optional with default
  onEdit: (item: ISubServicesInterface) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

// Icon colors for different business types
const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const SubServicesTable = ({ data, displayView = "table", onEdit, onDelete, themeColor }: Props) => {
  
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div key={item._id} className="...">
             {/* Card Content using item properties */}
             <div className="px-4 pb-4 space-y-3">
               <h3 className="text-lg font-bold">{item.subServiceName}</h3>
               <p className="text-lg font-bold">${item.cost || 0}</p>
               {/* ... other card fields ... */}
             </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4">Icon</th>
            <th className="px-6 py-4">Sub-Service</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4 text-center">Cost</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}>
                  <Layers size={18} />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  {item.subServiceName}
                  {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                </div>
                <div className="text-xs text-gray-400 line-clamp-1">{item.notes}</div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                  {typeof item.masterServiceId === 'object' 
                    ? (item.masterServiceId as any).MasterServiceType 
                    : 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-mono font-bold text-gray-700">
                ${item.cost || 0}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge isActive={!!item.isActive} />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) return alert("Default records cannot be deleted.");
                    onDelete(item._id!);
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

export default SubServicesTable;