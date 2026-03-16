"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

const getGradient = (index: number) => {
  const colors = [
    "from-indigo-400 to-blue-600",
    "from-purple-400 to-pink-600",
    "from-cyan-400 to-teal-600",
  ];
  return colors[index % colors.length];
};

const EventActionTable = ({
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
                <Zap size={18} />
              </div>
              <StatusBadge
                isActive={item.isActive}
                onChange={(s) => onStatusChange?.(item._id, s)}
                editable={!item.isDefault}
              />
            </div>
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {item.name}
                {item.isDefault && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              <p className="text-xs font-mono text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded mt-1">
                {item.eventKey}
              </p>
              <p className="text-sm text-gray-500 mt-3 whitespace-pre-wrap wrap-break-word">
                {item.description}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <TableActionButton
                  itemName="event"
                  fullWidth
                  onEdit={() => onEdit(item)}
                  onDelete={() =>
                    item.isDefault
                      ? toast.error("Default cannot be deleted")
                      : onDelete(item._id)
                  }
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
      <table className="w-full text-left">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Event Details</th>
            <th className="px-6 py-4 font-bold text-gray-700">Key</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">
              Status
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">
              Actions
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
                  <Zap size={18} />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">
                    {item.name}
                    {item.isDefault && (
                      <Star size={14} className="inline text-yellow-500 ml-1" />
                    )}
                  </span>
                  {/* Table view remains clamped to 1 line */}
                  <span className="text-xs text-gray-500 line-clamp-1">
                    {item.description}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {item.eventKey}
                </code>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge
                  isActive={item.isActive}
                  onChange={(s) => onStatusChange?.(item._id, s)}
                  editable={!item.isDefault}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  itemName="event"
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
export default EventActionTable;
