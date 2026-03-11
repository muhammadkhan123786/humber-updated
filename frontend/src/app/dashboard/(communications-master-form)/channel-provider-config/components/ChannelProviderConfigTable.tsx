"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-hot-toast";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface ChannelProviderConfig {
  _id: string;
  providerId: string | { _id: string; providerName: string; channelId: any };
  fields: Field[];
  userId: string;
  isActive: boolean;
  isDeleted: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  data: ChannelProviderConfig[];
  displayView: "table" | "card";
  onEdit: (item: ChannelProviderConfig) => void;
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

const ChannelProviderConfigTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) => {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  console.log("provider", data);
  const getProviderName = (item: ChannelProviderConfig) => {
    if (item.providerId && typeof item.providerId === "object") {
      return item.providerId.providerName || "N/A";
    }
    return "N/A";
  };

  const getFieldTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      text: "Text",
      password: "Password",
      number: "Number",
      select: "Select",
      boolean: "Yes/No",
    };
    return types[type] || type;
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
                <Settings size={18} />
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
                  {getProviderName(item)}
                  {item.isDefault && (
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  )}
                </h3>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Fields ({item.fields.length})
                    </span>
                    <button
                      onClick={() => toggleRow(item._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {expandedRows.has(item._id) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>

                  {expandedRows.has(item._id) && (
                    <div className="bg-blue-50/50 rounded-xl p-3 space-y-2">
                      {item.fields.map((field, idx) => (
                        <div
                          key={idx}
                          className="text-sm border-b border-blue-100 last:border-0 pb-2 last:pb-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">
                              {field.label}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {getFieldTypeLabel(field.type)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-mono">{field.name}</span>
                            {field.required && (
                              <span className="ml-2 text-red-500">
                                *Required
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <TableActionButton
                  itemName="configuration"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error(
                        "Default configuration cannot be deleted.",
                      );
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
            <p>No configurations found.</p>
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
              Provider
            </th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
              Fields
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
            <React.Fragment key={item._id}>
              <tr className="hover:bg-[#ECFEFF] transition-colors">
                <td className="px-6 py-4">
                  <div
                    className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}
                  >
                    <Settings size={18} />
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getProviderName(item)}
                    {item.isDefault && (
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                      {item.fields.length}{" "}
                      {item.fields.length === 1 ? "Field" : "Fields"}
                    </span>
                    <button
                      onClick={() => toggleRow(item._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {expandedRows.has(item._id) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
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
                    itemName="configuration"
                    onEdit={() => onEdit(item)}
                    onDelete={() => {
                      if (item.isDefault) {
                        return toast.error(
                          "Default configuration cannot be deleted.",
                        );
                      }
                      onDelete(item._id);
                    }}
                  />
                </td>
              </tr>
              {expandedRows.has(item._id) && (
                <tr className="bg-blue-50/50">
                  <td colSpan={5} className="px-6 py-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Configuration Fields:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.fields.map((field, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-800">
                                {field.label}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {getFieldTypeLabel(field.type)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="font-mono">{field.name}</span>
                              {field.required && (
                                <span className="ml-2 text-red-500">
                                  *Required
                                </span>
                              )}
                            </div>
                            {field.placeholder && (
                              <div className="text-xs text-gray-400 mt-1">
                                Placeholder: {field.placeholder}
                              </div>
                            )}
                            {field.options && field.options.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {field.options.map((opt, optIdx) => (
                                  <span
                                    key={optIdx}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                No configurations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChannelProviderConfigTable;
