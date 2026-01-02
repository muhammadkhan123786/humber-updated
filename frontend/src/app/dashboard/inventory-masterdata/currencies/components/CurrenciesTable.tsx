import { Star, Coins } from "lucide-react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { TableActionButton } from "@/app/common-form/TableActionButtons";
import { ICurrency } from "../../../../../../../common/ICurrency.interface";

interface TableProps {
    data: ICurrency[];
    onEdit: (item: ICurrency) => void;
    onDelete: (id: string) => void;
    themeColor: string;
}

export default function CurrenciesTable({ data, onEdit, onDelete, themeColor }: TableProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-white" style={{ backgroundColor: themeColor }}>
                        <tr>
                            <th className="px-6 py-4">Currency</th>
                            <th className="px-6 py-4">Symbol</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Default</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((item: ICurrency) => (
                                <tr key={item._id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                                <Coins size={18} />
                                            </div>
                                            <span className="font-bold text-gray-800">{item.currencyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 px-3 py-1 rounded-lg font-mono font-bold text-gray-600">
                                            {item.currencySymbol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge isActive={!!item.isActive} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.isDefault ? (
                                            <Star size={20} className="inline text-yellow-500 fill-yellow-500" />
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                    No currencies found. Click "Add Currency" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}