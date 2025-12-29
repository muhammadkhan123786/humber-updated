import { Edit, Trash2, Star } from "lucide-react";
import { IRepairStatus } from "../types";

interface Props {
  data: IRepairStatus[];
  onEdit: (status: IRepairStatus) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const RepairTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="p-4">Repair Status</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Total Jobs</th>
            <th className="p-4 text-center">Default</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-orange-50 transition-colors">
              <td className="p-4 font-medium text-gray-800">{item.repairStatus}</td>
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
                <td className="p-4 text-center">0</td>
              <td className="p-4 text-center">
                {item.isDefault && <Star className="inline text-yellow-500 fill-yellow-500" size={18} />}
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(item._id)} disabled={item.isDefault} className={`p-2 ${item.isDefault ? 'text-gray-300' : 'text-red-600 hover:bg-red-50'} rounded-lg`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepairTable;