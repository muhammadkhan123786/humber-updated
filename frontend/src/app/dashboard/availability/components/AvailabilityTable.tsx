"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Clock } from "lucide-react";
import { IAvailability } from "../../../../../../common/IAvailibility.interface";
import { toast } from "react-hot-toast";

interface Props {
  data: (IAvailability & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: IAvailability & { _id: string }) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-purple-400 to-indigo-600",
    "bg-gradient-to-br from-cyan-400 to-teal-600",
  ];
  return gradients[index % gradients.length];
};

const AvailabilityTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) => {
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
            <div className="px-4 pb-4 space-y-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {item.availabilityName}{" "}
                {item.isDefault && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              <div className="bg-gray-50 p-2 rounded-lg text-sm text-gray-600 font-medium">
                ⏱ {item.fromTime} - {item.toTime}
              </div>
              <TableActionButton
                itemName="availability"
                fullWidth={true}
                onEdit={() => onEdit(item)}
                onDelete={() =>
                  item.isDefault
                    ? toast.error("Default cannot be deleted")
                    : onDelete(item._id)
                }
              />
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
            <th className="px-6 py-4 font-bold text-gray-700">Name</th>
            <th className="px-6 py-4 font-bold text-gray-700">Time Range</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">
              Status
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.availabilityName}{" "}
                  {item.isDefault && (
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 font-semibold">
                {item.fromTime} - {item.toTime}
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
                  onDelete={() =>
                    item.isDefault
                      ? toast.error("Default cannot be deleted")
                      : onDelete(item._id)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityTable;
