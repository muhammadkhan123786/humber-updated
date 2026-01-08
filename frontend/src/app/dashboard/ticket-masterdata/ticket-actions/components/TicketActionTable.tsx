"use client";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ITicketActions } from "../../../../../../../common/Ticket-management-system/ITicketActions.interface";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star } from "lucide-react";
interface Props {
  data: (ITicketActions & { _id: string })[];
  onEdit: (item: ITicketActions & { _id: string }) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}
const TicketActionTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4">Action Code</th>
            <th className="px-6 py-4">Label</th>
            <th className="px-6 py-4 text-center">Default</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-orange-600">
                {item.code}
              </td>
              <td className="px-6 py-4 text-gray-800">{item.label}</td>
              <td className="px-6 py-4 text-center">
                {item.isDefault ? (
                  <Star
                    size={20}
                    className="text-yellow-500 fill-yellow-500 mx-auto"
                  />
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge isActive={!!item.isActive} />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault)
                      return alert("System default actions cannot be deleted.");
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                No ticket actions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketActionTable;
