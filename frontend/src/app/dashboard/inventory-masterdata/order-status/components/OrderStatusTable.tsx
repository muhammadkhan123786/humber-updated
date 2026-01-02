"use client";
import {
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  ListChecks,
} from "lucide-react";
import { IOrderStatus } from "../../../../../../../common/order.status.interface";

interface Props {
  data: IOrderStatus[];
  onEdit: (item: IOrderStatus) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const OrderStatusTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white" style={{ backgroundColor: themeColor }}>
            <tr>
              <th className="px-6 py-4">Status Name</th>
              <th className="px-6 py-4 text-center">Current Status</th>
              <th className="px-6 py-4 text-center">Is Default</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={(item as { _id: string })._id}
                  className="hover:bg-orange-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                        <ListChecks size={18} />
                      </div>
                      <span className="font-bold text-gray-800">
                        {item.orderStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {item.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.isDefault ? (
                      <Star
                        size={20}
                        className="inline text-yellow-500 fill-yellow-500"
                      />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (item.isDefault) {
                            alert("Default status cannot be deleted.");
                            return;
                          }
                          onDelete((item as { _id: string })._id); // <- yaha bhi same cast
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
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
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No order statuses found. Click Add Status to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderStatusTable;
