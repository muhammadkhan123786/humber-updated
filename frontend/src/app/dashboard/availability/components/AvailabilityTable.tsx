"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Clock, Star } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  data: any[];
  displayView: "table" | "card";
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

// Helper function to convert 24h (13:00) to 12h (1:00 PM)
const format12Hour = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const AvailabilitieTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) => {
  const handleDelete = (item: any) => {
    if (item.isDefault) {
      return toast.error("Default availability cannot be deleted.");
    }
    onDelete(item._id);
  };

  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 shadow-md hover:shadow-2xl transition-all ${!item.isActive ? "opacity-60" : ""}`}
          >
            <div className="p-4 flex justify-between">
              <div
                className={`${getIconGradient(index)} p-3 rounded-xl text-white`}
              >
                <Clock size={18} />
              </div>
              <StatusBadge
                isActive={!!item.isActive}
                onChange={(s) => onStatusChange?.(item._id, s)}
                editable={!item.isDefault}
              />
            </div>
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {item.name}{" "}
                {item.isDefault && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              {/* Displaying formatted 12-hour time */}
              <p className="text-blue-600 font-bold">
                {format12Hour(item.fromTime)} — {format12Hour(item.toTime)}
              </p>
              <div className="pt-4">
                <TableActionButton
                  itemName="availability"
                  fullWidth
                  onEdit={() => onEdit(item)}
                  onDelete={() => handleDelete(item)}
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
      <table className="w-full text-left min-w-max">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Name</th>
            <th className="px-6 py-4 font-bold text-gray-700 text-center">
              Time Slot
            </th>
            <th className="px-6 py-4 font-bold text-gray-700 text-center">
              Status
            </th>
            <th className="px-6 py-4 font-bold text-gray-700 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div
                  className={`${getIconGradient(index)} p-3 rounded-lg text-white w-fit`}
                >
                  <Clock size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                {item.name}{" "}
                {item.isDefault && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </td>
              {/* Displaying formatted 12-hour time */}
              <td className="px-6 py-4 text-center font-bold text-blue-600">
                {format12Hour(item.fromTime)} - {format12Hour(item.toTime)}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge
                  isActive={!!item.isActive}
                  onChange={(s) => onStatusChange?.(item._id, s)}
                  editable={!item.isDefault}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  itemName="availability"
                  onEdit={() => onEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilitieTable;
