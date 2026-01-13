"use client";
import React from "react";
import { Edit, Trash2, Star } from "lucide-react";

interface Props {
  data: any[];
  onEdit: (data: any) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const PriorityLevelTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="p-4 font-semibold">Priority Name</th>
            <th className="p-4 font-semibold text-center">Color Tag</th>
            <th className="p-4 font-semibold">Description</th>
            <th className="p-4 font-semibold text-center">Status</th>
            <th className="p-4 font-semibold text-center">Default</th>
            <th className="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                {/* Priority Name */}
                <td className="p-4">
                  <span className="font-bold text-gray-800">
                    {item.serviceRequestPrioprity}
                  </span>
                </td>

                {/* Color Tag - Separated Column */}
                <td className="p-4 text-center">
                  <div className="flex justify-center">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-black/5"
                      style={{ backgroundColor: item.backgroundColor }}
                      title={`Hex Code: ${item.backgroundColor}`}
                    />
                  </div>
                </td>

                {/* Description */}
                <td className="p-4 text-sm text-gray-500 max-w-[200px]">
                  <p className="truncate" title={item.description}>
                    {item.description}
                  </p>
                </td>

                {/* Status */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>

                {/* Default Star */}
                <td className="p-4 text-center">
                  {item.isDefault ? (
                    <Star
                      size={20}
                      className="inline text-yellow-500 fill-yellow-500"
                    />
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => !item.isDefault && onDelete(item._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isDefault
                          ? "text-gray-200 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                      disabled={item.isDefault}
                      title={
                        item.isDefault ? "Cannot delete default" : "Delete"
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-10 text-center text-gray-400 italic">
                No priority levels found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PriorityLevelTable;
