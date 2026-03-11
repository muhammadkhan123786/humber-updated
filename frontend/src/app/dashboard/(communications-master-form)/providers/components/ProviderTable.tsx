"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { IProviders } from "../../../../../../../common/communication-channels-integrations/IProviders.interface";

type PopulatedProvider = IProviders & {
  _id: string;
  channelId?: string | { _id: string; channelName: string };
};

interface Props {
  data: PopulatedProvider[];
  displayView: "table" | "card";
  onEdit: (item: PopulatedProvider) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-rose-400 to-rose-600",
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "bg-gradient-to-br from-emerald-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
  ];
  return gradients[index % gradients.length];
};

const ProviderTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) => {
  const getChannelName = (channelId: any) => {
    if (
      channelId &&
      typeof channelId === "object" &&
      "channelName" in channelId
    ) {
      return channelId.channelName;
    }
    return "N/A";
  };

  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="p-4 flex items-start justify-between bg-white">
              <div
                className={`${getIconGradient(index)} p-3 rounded-xl text-white`}
              >
                <MessageSquare size={18} />
              </div>
              <StatusBadge
                isActive={!!item.isActive}
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {item.providerName}
                  {item.isDefault && (
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  )}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Channel:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    {getChannelName(item.channelId)}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <TableActionButton
                  itemName="provider"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default provider cannot be deleted.");
                    }
                    onDelete(item._id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No providers found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px]! text-left min-w-max">
        <thead className="bg-[#ECFEFF] text-[#364153]! border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
              Icon
            </th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
              Provider Name
            </th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
              Channel
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">
              Status
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div
                  className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}
                >
                  <MessageSquare size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {item.providerName}
                  {item.isDefault && (
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  {getChannelName(item.channelId)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge
                  isActive={!!item.isActive}
                  onChange={(newStatus) =>
                    onStatusChange?.(item._id, newStatus)
                  }
                  editable={!item.isDefault}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  itemName="provider"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default provider cannot be deleted.");
                    }
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                No providers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderTable;
