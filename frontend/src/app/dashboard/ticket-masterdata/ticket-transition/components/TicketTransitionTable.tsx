"use client";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { ArrowRight, GitCompare, Ticket, Star, XCircle } from "lucide-react";
import { PopulatedTransition } from "./TicketTransitionClient";
import { toast } from "react-hot-toast";

interface Props {
  data: PopulatedTransition[];
  displayView: "table" | "card";
  onEdit: (item: PopulatedTransition) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

// Icon colors for different transitions
const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const TicketTransitionTable = ({
  data,
  displayView,
  onEdit,
  onDelete,
  onStatusChange,
  themeColor,
}: Props) => {
  // Card View
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 cursor-pointer transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Header Section with Icon and Toggle */}
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <GitCompare size={18} />
              </div>
              
              {/* Status Toggle Switch */}
              <StatusBadge 
                isActive={!!item.isActive}
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            {/* Content Section */}
            <div className="px-4 pb-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {item.from_status_id?.code || "INITIAL"}
                  <ArrowRight size={16} className="text-blue-500" />
                  {item.to_status_id?.code || "END"}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Ticket size={14} className="text-gray-400" />
                  {item.ticket_type_id?.code || "GENERAL"} • {item.action_id?.code || "AUTO"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <TableActionButton
                  itemName="transition"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default transitions cannot be deleted.");
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
            <p>No transition rules found.</p>
          </div>
        )}
      </div>
    );
  }

  // Table View (Default)
  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-x-auto rounded-lg">
      <table className="w-full text-[16px]! text-left min-w-max">
        <thead className="bg-[#ECFEFF] text=[#364153]! border-b-2 border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">From Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Trigger Action</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">To Status</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Ticket Type</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200">
                  {item.from_status_id?.code || "INITIAL"}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-orange-600 font-bold text-[10px] uppercase tracking-wider bg-orange-50 border border-orange-200 px-2 py-0.5 rounded shadow-sm">
                    {item.action_id?.code || "AUTO"}
                  </span>
                  <ArrowRight size={14} className="text-gray-400 mt-1" />
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200 shadow-sm">
                    {item.to_status_id?.code || "END"}
                  </span>
                  {item.isDefault && (
                    <span title="Default Transition">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Ticket size={14} className="text-gray-400" />
                  <span className="font-medium text-sm">
                    {item.ticket_type_id?.code || "GENERAL"}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 text-center">
                <StatusBadge 
                  isActive={!!item.isActive}
                  onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                  editable={!item.isDefault}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  itemName="transition"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault)
                      return toast.error("Default cannot be deleted.");
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No transition rules found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTransitionTable;
