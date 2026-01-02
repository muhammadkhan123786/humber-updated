import { Edit2, Trash2, Star, Tv } from "lucide-react";
import { StatusBadge } from "@/app/dashboard/common-form/StatusBadge";
import { IChannel } from "../../../../../../../common/IChannel.interface";

interface TableProps {
  data: IChannel[];
  onEdit: (item: IChannel) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

export default function ProductChannelTable({ data, onEdit, onDelete, themeColor }: TableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4 text-center w-20">Icon</th>
            <th className="px-6 py-4">Channel Name</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Default</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item: IChannel) => (
              <tr key={(item as any)._id} className="hover:bg-orange-50 transition-colors">
                <td className="px-6 py-4 text-center">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg inline-block"><Tv size={18} /></div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{item.channelName}</td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge isActive={!!item.isActive} />
                </td>
                <td className="px-6 py-4 text-center">
                  {item.isDefault ? (
                    <Star size={20} className="inline text-yellow-500 fill-yellow-500" />
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
                      onClick={() => onDelete((item as any)._id)} 
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
              <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                No product channels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}