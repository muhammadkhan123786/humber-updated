import React from "react";
import { Star, ClipboardCheck } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { IItemsConditions } from "../../../../../../../common/IItems.conditions.interface";

interface TableProps {
    data: IItemsConditions[];
    onEdit: (item: IItemsConditions) => void;
    onDelete: (id: string) => void;
    themeColor: string;
}

export default function ItemConditionTable({ data, onEdit, onDelete, themeColor }: TableProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="text-white" style={{ backgroundColor: themeColor }}>
                    <tr>
                        <th className="px-6 py-4">Condition Name</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Default</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.length > 0 ? data.map((item) => (
                        <tr key={item._id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><ClipboardCheck size={18} /></div>
                                    <span className="font-bold text-gray-800">{item.itemConditionName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <StatusBadge isActive={!!item.isActive} />
                            </td>
                            <td className="px-6 py-4 text-center">
                                {item.isDefault ? <Star size={20} className="inline text-yellow-500 fill-yellow-500" /> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <TableActionButton
                                    onEdit={() => onEdit(item)}
                                    onDelete={() => {
                                        if (item.isDefault) {
                                            alert("Default item cannot be deleted.");
                                            return;
                                        }
                                        onDelete(item._id!);
                                    }}
                                />
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No conditions found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}