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
          <div key={item._id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all text-center">
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 flex justify-center">
              <img src={item.icon} alt={item.iconName} className="h-16 w-16 object-contain" />
            </div>
            <h3 className="font-bold text-gray-900 flex items-center justify-center gap-2">
              {item.iconName}
              {item.isDefault && <Star size={14} className="fill-yellow-500 text-yellow-500" />}
            </h3>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onEdit(item)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">Edit</button>
              <button onClick={() => !item.isDefault && onDelete(item._id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-blue-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-700">Preview</th>
            <th className="px-6 py-4 font-bold text-gray-700">Icon Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4">
                <img src={item.icon} className="h-10 w-10 object-contain rounded-lg border bg-white p-1" alt="icon" />
              </td>
              <td className="px-6 py-4 font-bold text-gray-800">
                <div className="flex items-center gap-2">
                  {item.iconName}
                  {item.isDefault && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                </div>
              </td>
              <td className="px-6 py-4 text-center"><StatusBadge isActive={!!item.isActive} /></td>
              <td className="px-6 py-4 text-center">
                <TableActionButton 
                  onEdit={() => onEdit(item)} 
                  onDelete={() => !item.isDefault && onDelete(item._id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IconsTable;