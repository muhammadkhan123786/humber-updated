"use client";

import { User, UserPlus } from 'lucide-react';
import type { Customer } from '../types';
import CustomerRow from './CustomerRow';
import ActionMenu from './ActionMenu';

interface CustomerTableProps {
    customers: Customer[];
    filteredCustomers: Customer[];
    searchQuery?: string;
    statusFilter?: string;
    actionMenu: {
        isOpen: boolean;
        customerId: string | null;
        position?: { x: number; y: number } | null;
    };
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onAdd?: () => void;
    onActionMenuClick: (event: React.MouseEvent, customerId: string) => void;
    onActionMenuClose: () => void;
    onDelete: (customerId: string) => void;

}

export default function CustomerTable({
    customers,
    filteredCustomers,
    searchQuery,
    statusFilter,
    actionMenu,
    onView,
    onEdit,
    onAdd,
    onActionMenuClick,
    onActionMenuClose,
    onDelete
}: CustomerTableProps) {

    // Check agar koi filter active hai ya nahi (Vehicle filter remove kar diya gaya hai)
    const isFilterActive = searchQuery || statusFilter !== 'all';

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                {/* Vehicle Info Header khtm kar diya gaya hai */}
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <CustomerRow
                                        key={customer.id}
                                        customer={customer}
                                        actionMenu={actionMenu}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onActionMenuClick={onActionMenuClick}
                                    />
                                ))
                            ) : (
                                <tr>
                                    {/* colSpan 6 se 5 kar diya gaya hai kyunki ek column kam ho gaya hai */}
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                <User className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <p className="text-gray-900 font-semibold text-lg">No customers found</p>
                                            <p className="text-gray-500 max-w-xs mx-auto mt-1 mb-6">
                                                {isFilterActive
                                                    ? 'No results match your current filters. Try resetting them.'
                                                    : 'Your customer database is empty. Get started by adding a new customer.'}
                                            </p>
                                            {!isFilterActive && (
                                                <button
                                                    onClick={onAdd}
                                                    className="inline-flex items-center px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition-all shadow-sm font-medium"
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Add New Customer
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Summary */}
                {filteredCustomers.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{customers.length}</span> customers
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50">Previous</button>
                            <button className="px-3 py-1.5 bg-[#FE6B1D] text-white rounded-md text-sm font-bold shadow-sm">1</button>
                            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white">Next</button>
                        </div>
                    </div>
                )}
            </div>

            <ActionMenu
                menuState={actionMenu}
                customers={customers}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onClose={onActionMenuClose}
            />
        </>
    );
}