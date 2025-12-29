import { Edit, Trash2, Star, MapPin } from "lucide-react";

interface Props {
  data: any[];
  onEdit: (data: any) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const AddressTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="p-4">Full Address</th>
            <th className="p-4">Location (City/Country)</th>
            <th className="p-4 text-center">Zip Code</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Default</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? data.map((item) => (
            <tr key={item._id} className="hover:bg-orange-50 transition-colors">
              <td className="p-4">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 text-gray-400" />
                  <div>
                    <div className="font-bold text-gray-800">{item.address}</div>
                    <div className="text-xs text-gray-400">
                      Lat: {item.latitude || '0'}, Long: {item.longitude || '0'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm font-medium text-gray-700">
                  {item.cityId?.cityName || 'N/A'}, 
                  <span className="ml-1 text-gray-500">
                    {item.countryId?.countryName || item.CountryId?.countryName || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="p-4 text-center font-mono text-sm text-gray-600">
                {item.zipCode || '-----'}
              </td>
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td className="p-4 text-center">
                {item.isDefault ? (
                  <Star size={20} className="inline text-yellow-500 fill-yellow-500" />
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  {/* Aap Edit toggle ya status change ke liye edit button rakh sakte hain */}
                  <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="p-10 text-center text-gray-400 italic">No addresses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddressTable;