"use client";
import React from "react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Box } from "lucide-react";

const getGradient = (index: number) => {
  const colors = [
    "from-indigo-400 to-blue-600",
    "from-purple-400 to-pink-600",
    "from-cyan-400 to-teal-600",
  ];
  return colors[index % colors.length];
};

const ModuleTable = ({ data = [], displayView, onStatusChange }: any) => {
  console.log("data", data);
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-10 text-center rounded-xl border border-dashed border-gray-300 mt-8">
        <p className="text-gray-500">No modules found to display.</p>
      </div>
    );
  }

  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {data.map((item: any, index: number) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-indigo-100 overflow-hidden shadow-md hover:shadow-xl transition-all ${!item.isActive ? "opacity-60" : ""}`}
          >
            <div className="p-4 flex justify-between items-start">
              <div
                className={`bg-linear-to-br ${getGradient(index)} p-3 rounded-xl text-white`}
              >
                <Box size={18} />
              </div>
              <StatusBadge
                isActive={item.isActive}
                onChange={(s) => onStatusChange?.(item._id, s)}
                editable={!item.isDefault}
              />
            </div>
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                {item.moduleName}
                {item.isDefault && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-[#ECFEFF] text-[#364153] border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold">Icon</th>
            <th className="px-6 py-4 font-bold">Module Name</th>
            <th className="px-6 py-4 text-center font-bold">Status</th>
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
                  <Box size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                {item.moduleName}
                {item.isDefault && (
                  <Star
                    size={14}
                    className="inline text-yellow-500 ml-1 fill-yellow-500"
                  />
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

export default ModuleTable;
