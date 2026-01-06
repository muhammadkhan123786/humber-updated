"use client";

import { Ruler, Star } from "lucide-react";
import { ISize } from "../../../../../../../common/ISize.interface";
import { StatusBadge } from "../../../../common-form/StatusBadge";
import { TableActionButton } from "../../../../common-form/TableActionButtons";

interface Props {
  data: ISize[];
  onEdit: (item: ISize) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const SizeTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white" style={{ backgroundColor: themeColor }}>
            <tr>
              <th className="px-6 py-4">Size Name / Value</th>
              <th className="px-6 py-4 text-center">Default</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Ruler size={18} />
                      </div>
                      <span className="font-bold text-gray-800">
                        {item.size}
                      </span>
                    </div>
                  </td>
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
                          return alert("Default size cannot be deleted.");
                        if (item._id) onDelete(item._id);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No size records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeTable;
