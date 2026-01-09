"use client";
import React, { useState } from "react";
import { Layers, ListChecks, Eye } from "lucide-react";
import { StatusBadge } from "../../../../common-form/StatusBadge";
import { TableActionButton } from "../../../../common-form/TableActionButtons";
import { IAttribute } from "../../../../../../../common/IProductAttributes.interface";

interface AttributeTableProps {
  data: IAttribute[];
  onEdit: (item: IAttribute) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const AttributeTable = ({
  data,
  onEdit,
  onDelete,
  themeColor,
}: AttributeTableProps) => {
  const [popupData, setPopupData] = useState<IAttribute | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* ================= HEADER ================= */}
            <thead
              className="text-white"
              style={{ backgroundColor: themeColor }}
            >
              <tr>
                <th className="px-6 py-4 font-semibold">Attribute</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold text-center">
                  Required
                </th>
                <th className="px-6 py-4 font-semibold text-center">Options</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            {/* ================= BODY ================= */}
            <tbody className="divide-y divide-gray-100">
              {data.length > 0 ? (
                data.map((item) => {
                  if (!item._id) return null; // ✅ HARD SAFETY

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      {/* Attribute Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor: `${themeColor}20`,
                              color: themeColor,
                            }}
                          >
                            <Layers size={18} />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {item.attributeName}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 capitalize">{item.type}</td>

                      {/* Required */}
                      <td className="px-6 py-4 text-center">
                        {item.isRequired ? "Yes" : "No"}
                      </td>

                      {/* Options */}
                      <td className="px-6 py-4 text-center">
                        {item.options?.length ? (
                          <>
                            {item.options.length}
                            <button
                              onClick={() => setPopupData(item)}
                              className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            >
                              View
                            </button>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <StatusBadge isActive={item.status === "active"} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <TableActionButton
                          onEdit={() => onEdit(item)}
                          onDelete={() => {
                            if (!item._id) return;
                            onDelete(item._id);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-gray-400 italic"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ListChecks size={40} className="text-gray-200" />
                      <p>No attributes found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= OPTIONS POPUP ================= */}
      {popupData?.options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Eye size={18} /> Options for {popupData.attributeName}
            </h3>

            <ul className="space-y-2">
              {popupData.options.map((opt, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 border rounded-md bg-gray-50"
                >
                  {idx + 1}. {opt.label} ({opt.value})
                </li>
              ))}
            </ul>

            <button
              onClick={() => setPopupData(null)}
              className="mt-4 w-full py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AttributeTable;
