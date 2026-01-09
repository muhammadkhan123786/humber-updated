"use client";
import React from "react";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Star } from "lucide-react";
import { IJobTypes } from "../../../../../../common/IJob.types.interface";

interface Props {
  data: (IJobTypes & { _id: string })[];
  onEdit: (item: IJobTypes & { _id: string }) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const JobTypeTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-white" style={{ backgroundColor: themeColor }}>
          <tr>
            <th className="px-6 py-4">Job Type Name</th>
            <th className="px-6 py-4 text-center">Default</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-800">
                {item.jobTypeName}
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
                      return alert("Default types cannot be deleted.");
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

export default JobTypeTable;
