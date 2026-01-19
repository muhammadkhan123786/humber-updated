"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Layers, Trash2 } from "lucide-react";
import { ISubServicesInterface } from "../../../../../../common/ISubServices.interface";

interface Props {
  data: ISubServicesInterface[];
  displayView: "table" | "card";
  onEdit: (item: ISubServicesInterface) => void;
  onDelete: (id: string) => void;
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

const SubServicesTable = ({ data, displayView, onEdit, onDelete, themeColor }: Props) => {
  // Card View
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-3 cursor-pointer transform"
          >
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Layers size={18} />
              </div>
              <StatusBadge isActive={!!item.isActive} />
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.subServiceName}
                </h3>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                  {typeof item.masterServiceId === 'object' ? (item.masterServiceId as any).MasterServiceType : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-1">{item.notes || "No notes available"}</p>
                <p className="text-lg font-bold text-gray-700 mt-1">${item.cost || 0}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 flex text-sm items-center justify-center gap-1 py-1 px-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold transition-all hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (item.isDefault) {
                      alert("Default records cannot be deleted.");
                      return;
                    }
                    onDelete(item._id!);
                  }}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No sub-services found.</p>
          </div>
        )}
      </div>
    );
  }

  // Table View
  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-[16px]! text-left">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Sub-Service</th>
            <th className="px-6 py-4 font-bold text-gray-700">Category</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Cost</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
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
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.subServiceName}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <div className="text-xs text-gray-400 font-normal line-clamp-1">{item.notes}</div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                  {typeof item.masterServiceId === 'object' 
                    ? (item.masterServiceId as any).MasterServiceType 
                    : 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-bold text-gray-700">
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
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No sub-services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubServicesTable;