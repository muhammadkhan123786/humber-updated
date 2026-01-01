"use client";
import { UserPlus, Edit, Eye, X } from 'lucide-react';
import type { ModalMode, Customer } from '../types';
import AddEditCustomer from './AddEditCustomer';
import ViewCustomer from './ViewCustomer';

interface CustomerModalProps {
    isOpen: boolean;
    isClosing: boolean;
    modalMode: ModalMode;
    formData: any; 
    selectedCustomer: Customer | null;
    modalRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
    onSubmit: () => void;
    onPersonalInfoChange: (field: string, value: any) => void;
    onEdit: () => void;
}

export default function CustomerModal({
    isOpen,
    isClosing,
    modalMode,
    formData,
    selectedCustomer,
    modalRef,
    onClose,
    onSubmit,
    onPersonalInfoChange,
    onEdit
}: CustomerModalProps) {
    if (!isOpen) return null;

    const getModalTitle = () => {
        switch (modalMode) {
            case 'add': return 'Add New Customer';
            case 'edit': return 'Edit Customer';
            case 'view': return 'View Customer Details';
            default: return 'Customer';
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={`fixed inset-0 z-9999 flex items-end md:items-center justify-center p-4 transition-all duration-500 ease-out ${isClosing ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
                style={{ pointerEvents: 'none' }}
            >
                <div
                    ref={modalRef}
                    className={`bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto transition-all duration-500 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} modal-scrollbar`}
                    style={{ pointerEvents: 'auto' }}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${modalMode === 'add' ? 'bg-[#FE6B1D]' : modalMode === 'edit' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                {modalMode === 'add' && <UserPlus className="w-5 h-5 text-white" />}
                                {modalMode === 'edit' && <Edit className="w-5 h-5 text-white" />}
                                {modalMode === 'view' && <Eye className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{getModalTitle()}</h2>
                                <p className="text-gray-500 text-sm">
                                    {modalMode === 'view' ? 'Full customer profile information' : 'Fill in the customer details below'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {modalMode === 'view' && selectedCustomer ? (
                            <ViewCustomer
                                customer={selectedCustomer}
                                onEdit={onEdit}
                                onClose={onClose}
                                // Vehicle-related props removed here
                            />
                        ) : (
                            <AddEditCustomer
                                mode={modalMode}
                                formData={formData}
                                onPersonalInfoChange={onPersonalInfoChange}
                                onSubmit={onSubmit}
                                onClose={onClose}
                            />
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Customer Management System &bull; Humber
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}