// app/dashboard/customers/components/CustomerTable/ActionMenu.tsx
"use client";

import { Eye, Edit, Trash2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import type { ActionMenuState, Customer } from '../types';

interface ActionMenuProps {
    menuState: ActionMenuState;
    customers: Customer[];
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customerId: string) => void;
    onClose: () => void;
}

export default function ActionMenu({
    menuState,
    customers,
    onView,
    onEdit,
    onDelete,
    onClose
}: ActionMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!menuState.isOpen || !menuState.position) return null;

    const customer = customers.find(c => c.id === menuState.customerId);

    if (!customer) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-9999 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px]"
            style={{
                left: menuState.position.x,
                top: menuState.position.y
            }}
        >
            <div className="py-1">
                <button
                    onClick={() => {
                        onView(customer);
                        onClose();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </button>
                <button
                    onClick={() => {
                        onEdit(customer);
                        onClose();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    <Edit className="w-4 h-4" />
                    Edit Customer
                </button>
                <button
                    onClick={() => {
                        onDelete(customer.id);
                        onClose();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Customer
                </button>
            </div>
        </div>
    );
}