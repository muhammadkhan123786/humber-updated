"use client";

import {
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Receipt,
  Calendar,
  Star,
} from "lucide-react";
import { ITax } from "../../../../../../../common/ITax.interface";

interface Props {
  data: ITax[];
  onEdit: (item: ITax) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}
const TaxTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white" style={{ backgroundColor: themeColor }}>
            <tr>
              <th className="px-6 py-4">Tax Details</th>
              <th className="px-6 py-4 text-center">Rate</th>
              <th className="px-6 py-4 text-center">Validity</th>
              <th className="px-6 py-4 text-center">Default</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-orange-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Receipt size={18} />
                      </div>
                      <span className="font-bold text-gray-800">
                        {item.taxName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono font-bold text-lg text-gray-700">
                      {item.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-[11px] text-gray-500 flex flex-col items-center leading-tight">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(item.startDate)}
                      </span>
                      <span className="text-gray-300">to</span>
                      <span>{formatDate(item.endDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.isDefault ? (
                      <div className="flex justify-center">
                        <Star
                          size={20}
                          className="text-yellow-500 fill-yellow-500"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {item.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Tax"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (item.isDefault) {
                            alert("Default tax cannot be deleted.");
                            return;
                          }
                          if (item._id) onDelete(item._id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isDefault
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-100"
                        }`}
                        disabled={item.isDefault}
                        title={
                          item.isDefault
                            ? "Cannot delete default"
                            : "Delete Tax"
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
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No tax records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxTable;
