// app/dashboard/customers/components/CustomerModal/DeleteConfirmation.tsx
"use client";

import { Trash2 } from 'lucide-react';

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customerName?: string;
}

export default function DeleteConfirmation({
    isOpen,
    onClose,
    onConfirm,
    customerName = 'this customer'
}: DeleteConfirmationProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm" />
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Delete Customer</h3>
                            <p className="text-gray-600">This action cannot be undone</p>
                        </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete {customerName}? All associated data will be permanently removed.
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Delete Customer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}