"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star, Trash2 } from "lucide-react";
import { IIcons } from "../../../../../../common/master-interfaces/IIcons.interface";

interface Props {
  data: IIcons[];
  displayView: "table" | "card";
  onEdit: (item: IIcons) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const IconsTable = ({ data, displayView, onEdit, onDelete, themeColor }: Props) => {
  if (displayView === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <div key={item._id} className="bg-white rounded-3xl border-2 border-blue-200 p-4 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-2 cursor-pointer transform overflow-hidden">
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 flex justify-center relative group">
                <img src={item.icon} alt={item.iconName} className="h-20 w-20 object-contain transition-transform group-hover:scale-110" />
                <div className="absolute top-2 right-2">
                   <StatusBadge isActive={!!item.isActive} />
                </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center justify-center gap-2">
              {item.iconName}
              {item.isDefault && <Star size={16} className="fill-yellow-500 text-yellow-500" />}
            </h3>
            <div className="mt-5 flex gap-2">
              <button 
                onClick={() => onEdit(item)} 
                className="flex-1 py-2 bg-gray-50 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-all"
              >
                Edit
              </button>
              <button 
                onClick={() => !item.isDefault && item._id && onDelete(item._id)} 
                className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={20}/>
              </button>
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
            <th className="px-6 py-4 font-bold text-gray-700">Preview</th>
            <th className="px-6 py-4 font-bold text-gray-700">Icon Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-[#ECFEFF] transition-colors">
              <td className="px-6 py-4">
                <div className="p-2 rounded-lg border bg-white w-fit shadow-sm">
                   <img src={item.icon} className="h-10 w-10 object-contain" alt="icon" />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center gap-2 text-lg">
                  {item.iconName}
                  {item.isDefault && <Star size={18} className="text-yellow-500 fill-yellow-500" />}
                </div>
              </td>
              <td className="px-6 py-4 text-center"><StatusBadge isActive={!!item.isActive} /></td>
              <td className="px-6 py-4 text-center">
                <TableActionButton 
                  onEdit={() => onEdit(item)} 
                  onDelete={() => {
                    if (item.isDefault) return alert("Default icons cannot be deleted.");
                    if(!item._id) return
                    onDelete(item._id);
                  }} 
                />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-10 text-gray-400">No icons found in the gallery.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IconsTable;