"use client";

import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ArrowRight, Ticket, CheckCircle2, XCircle, Star } from "lucide-react";
import { PopulatedTransition } from "./TicketTransitionClient";

interface Props {
  data: PopulatedTransition[];
  onEdit: (item: PopulatedTransition) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const TicketTransitionTable = ({
  data,
  onEdit,
  onDelete,
  themeColor,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4">From Status</th>
            <th className="px-6 py-4 text-center">Trigger Action</th>
            <th className="px-6 py-4">To Status</th>
            <th className="px-6 py-4">Ticket Type</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
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
                <div className="flex justify-center">
                  {item.isActive ? (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-bold uppercase">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <XCircle size={14} />
                      <span className="text-[10px] font-bold uppercase">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton
                  onEdit={() => onEdit(item)}
                  onDelete={() => {
                    if (item.isDefault) {
                      alert("Default item cannot be deleted");
                      return;
                    }
                    onDelete(item._id);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="p-10 text-center text-gray-400 italic">
          No transition rules set up yet.
        </div>
      )}
    </div>
  );
};

export default TicketTransitionTable;
