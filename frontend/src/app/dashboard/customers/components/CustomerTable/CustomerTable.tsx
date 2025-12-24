// app/dashboard/customers/components/CustomerTable/CustomerTable.tsx
"use client";

import { User, UserPlus } from 'lucide-react';
import type { Customer } from '../types';
import CustomerRow from './CustomerRow';
import ActionMenu from './ActionMenu';

interface CustomerTableProps {
    customers: Customer[];
    filteredCustomers: Customer[];
    searchQuery: string;
    statusFilter: string;
    vehicleMakeFilter: string;
    actionMenu: {
        isOpen: boolean;
        customerId: string | null;
        position?: { x: number; y: number } | null;
    };
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onAdd: () => void;
    onActionMenuClick: (event: React.MouseEvent, customerId: string) => void;
    onActionMenuClose: () => void;
    onDelete: (customerId: string) => void;
    getVehicleMakeLabel: (make: string) => string;
}

export default function CustomerTable({
    customers,
    filteredCustomers,
    searchQuery,
    statusFilter,
    vehicleMakeFilter,
    actionMenu,
    onView,
    onEdit,
    onAdd,
    onActionMenuClick,
    onActionMenuClose,
    onDelete,
    getVehicleMakeLabel
}: CustomerTableProps) {
    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <CustomerRow
                                        key={`${customer.id}-${customer.createdAt.getTime()}`}
                                        customer={customer}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onActionMenuClick={onActionMenuClick}
                                        getVehicleMakeLabel={getVehicleMakeLabel}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <User className="w-12 h-12 mb-4 text-gray-300" />
                                            <p className="text-lg font-medium mb-2">No customers found</p>
                                            <p className="mb-4">
                                                {searchQuery || statusFilter !== 'all' || vehicleMakeFilter !== 'all'
                                                    ? 'Try adjusting your search or filters'
                                                    : 'Start by adding your first customer'}
                                            </p>
                                            {!searchQuery && statusFilter === 'all' && vehicleMakeFilter === 'all' && (
                                                <button
                                                    onClick={onAdd}
                                                    className="px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition-colors"
                                                >
                                                    <UserPlus className="w-4 h-4 inline mr-2" />
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

                {/* Pagination/Summary */}
                {filteredCustomers.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                            <span className="font-medium">{customers.length}</span> customers
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 bg-[#FE6B1D] text-white rounded text-sm hover:bg-[#FE6B1D]/90">
                                1
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Menu */}
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