"use client";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Globe, Trash2 } from "lucide-react";
import { ICountry } from "../../../../../../common/Country.interface";

interface Props {
  data: (ICountry & { _id: string })[];
  displayView: "table" | "card";
  onEdit: (item: ICountry & { _id: string }) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const getIconGradient = (index: number) => {
  const gradients = [
       "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

const CountryTable = ({ data, displayView, onEdit, onDelete }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item._id} className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="p-4 flex items-start justify-between">
              <div className={`${getIconGradient(index)} p-3 rounded-xl text-white`}>
                <Globe size={18} />
              </div>
              <StatusBadge isActive={!!item.isActive} />
            </div>
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {item.countryName}
                {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
              </h3>
              <div className="flex gap-2 pt-4">
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 px-3 text-sm text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-semibold transition-all">
                  Edit
                </button>
                <button 
                  onClick={() => !item.isDefault ? onDelete(item._id) : alert("Default country cannot be deleted")}
                  className={`p-2 rounded-lg transition-all ${item.isDefault ? 'text-gray-300' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 shadow-lg border border-gray-200 overflow-hidden rounded-xl">
      <table className="w-full text-left">
        <thead className="bg-[#ECFEFF] border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Icon</th>
            <th className="px-6 py-4 font-bold text-gray-700">Country Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4">
                <div className={`${getIconGradient(index)} p-2.5 rounded-lg w-fit text-white`}>
                  <Globe size={18} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item.countryName}
                  {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge isActive={!!item.isActive} />
              </td>
              <td className="px-6 py-4 text-center">
                <TableActionButton 
                    onEdit={() => onEdit(item)} 
                    onDelete={() => {
                        if(item.isDefault) return alert("Default record cannot be deleted.");
                        onDelete(item._id);
                    }} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CountryTable;