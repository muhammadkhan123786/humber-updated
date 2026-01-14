"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Briefcase } from "lucide-react";
import { IBusinessTypes } from "../../../../../../common/suppliers/IBusiness.types.interface";

interface Props {
  data: (IBusinessTypes & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: IBusinessTypes & { _id: string }) => void;
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

const BussinessTypeTable = ({ data, displayView, onEdit, onDelete, themeColor }: Props) => {
  // Card View
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-2 cursor-pointer"
          >
            {/* Header Section with Icon and Toggle */}
            <div className={`${getIconGradient(index)} p-6 flex items-start justify-between`}>
              <div className={`${getIconGradient(index)} p-3 rounded-lg text-white`}>
                <Briefcase size={32} />
              </div>
              
              {/* Status Toggle Switch */}
              <div className="flex items-center gap-2">
                <div className={`relative w-12 h-7 rounded-full transition-all ${
                  item.isActive ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    item.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.businessTypeName}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-all hover:text-blue-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    if (item.isDefault) {
                      alert("Default types cannot be deleted.");
                      return;
                    }
                    onDelete(item._id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No business types found.</p>
          </div>
        )}
      </div>
    );
  }

  // Table View (Default)
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}>
                  <Briefcase size={24} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.businessTypeName}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                {/* Status Toggle Switch */}
                <div className="flex justify-center">
                  <div className={`relative w-12 h-7 rounded-full transition-all cursor-pointer ${
                    item.isActive ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      item.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault)
                      return alert("Default types cannot be deleted.");
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-10 text-gray-400">
                No business types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BussinessTypeTable;