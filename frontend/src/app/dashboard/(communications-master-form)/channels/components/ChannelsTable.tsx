"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Radio } from "lucide-react";
import { toast } from "react-hot-toast";

const getGradient = (index: number) => {
  const colors = [
    "from-indigo-400 to-blue-600",
    "from-purple-400 to-pink-600",
    "from-cyan-400 to-teal-600",
  ];
  return colors[index % colors.length];
};

const ChannelsTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
}: any) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item: any, index: number) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-indigo-100 overflow-hidden shadow-md hover:shadow-xl transition-all ${!item.isActive ? "opacity-60" : ""}`}
          >
            <div className="p-4 flex justify-between items-start">
              <div
                className={`bg-linear-to-br ${getGradient(index)} p-3 rounded-xl text-white`}
              >
                <Radio size={18} />
              </div>
              <StatusBadge
                isActive={item.isActive}
                onChange={(s) => onStatusChange?.(item._id, s)}
                editable={!item.isDefault}
              />
            </div>
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {item.channelName}{" "}
                {item.isDefault && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              {/* <div className="mt-4">
                <TableActionButton
                  itemName="channel"
                  fullWidth
                  onEdit={() => onEdit(item)}
                  onDelete={() =>
                    item.isDefault
                      ? toast.error("Default cannot be deleted")
                      : onDelete(item._id)
                  }
                />
              </div> */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Channel Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item: any, index: number) => (
            <tr
              key={item._id}
              className="hover:bg-indigo-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div
                  className={`bg-linear-to-br ${getGradient(index)} p-2.5 rounded-lg w-fit text-white`}
                >
                  <Radio size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                {item.channelName}{" "}
                {item.isDefault && (
                  <Star size={14} className="inline text-yellow-500 ml-1" />
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge
                  isActive={item.isActive}
                  onChange={(s) => onStatusChange?.(item._id, s)}
                  editable={!item.isDefault}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ChannelsTable;
