"use client";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Layers } from "lucide-react";
import { ISubServicesInterface } from "../../../../../../common/ISubServices.interface";
import { toast } from "react-hot-toast";

interface Props {
  data: (ISubServicesInterface & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: ISubServicesInterface & { _id: string }) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  themeColor: string;
}

// Icon gradients matching the Business Type style
const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const SubServicesTable = ({ data, displayView, onEdit, onDelete, onStatusChange }: Props) => {
  // Card View logic
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`bg-white rounded-3xl border-2 border-blue-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300   hover:border-blue-400 transform ${
              !item.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="p-4 flex items-start justify-between bg-white">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Layers size={18} />
              </div>
              
              <StatusBadge 
                isActive={!!item.isActive}
                onChange={(newStatus) => onStatusChange?.(item._id, newStatus)}
                editable={!item.isDefault}
              />
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {item.subServiceName}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </h3>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                  {typeof item.masterServiceId === 'object' 
                    ? (item.masterServiceId as any).MasterServiceType 
                    : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                  {item.notes || "No notes available"}
                </p>
                <p className="text-lg font-bold text-gray-700 mt-1">${item.cost || 0}</p>
              </div>

              <div className="pt-4">
                <TableActionButton
                  itemName="sub-service"
                  fullWidth={true}
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      return toast.error("Default records cannot be deleted.");
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
            <p>No sub-services found.</p>
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
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Sub-Service</th>
            <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Category</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Cost</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-3 rounded-lg w-fit text-white`}>
                  <Layers size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {item.subServiceName}
                  {item.isDefault && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <div className="text-xs text-gray-400 font-normal line-clamp-1">{item.notes}</div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                  {typeof item.masterServiceId === 'object' 
                    ? (item.masterServiceId as any).MasterServiceType 
                    : 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-bold text-gray-700">
                ${item.cost || 0}
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
                  itemName="sub-service"
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) return toast.error("Default records cannot be deleted.");
                    onDelete(item._id!);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No sub-services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubServicesTable;