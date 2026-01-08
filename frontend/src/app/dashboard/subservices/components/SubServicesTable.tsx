import { Edit, Trash2, Star } from "lucide-react";

interface Props {
  data: any[];
  onEdit: (data: any) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const SubServicesTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="p-4">Sub-Service</th>
            <th className="p-4">Category (Master)</th>
            <th className="p-4 text-center">Cost</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Default</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-orange-50 transition-colors">
              <td className="p-4">
                <div className="font-medium text-gray-800">{item.subServiceName}</div>
                <div className="text-xs text-gray-400 italic">{item.notes || "No notes"}</div>
              </td>
              <td className="p-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                  {typeof item.masterServiceId === 'object' ? item.masterServiceId.MasterServiceType : 'N/A'}
                </span>
              </td>
              <td className="p-4 text-center text-gray-700 font-mono">${item.cost || 0}</td>
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              {/* Default Column Logic */}
              <td className="p-4 text-center">
                {item.isDefault ? (
                  <Star size={20} className="inline text-yellow-500 fill-yellow-500" />
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (item.isDefault) {
                        alert("Default record cannot be deleted.");
                      } else {
                        onDelete(item._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={item.isDefault ? "Default record cannot be deleted" : "Delete"}
                  >
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

export default SubServicesTable;