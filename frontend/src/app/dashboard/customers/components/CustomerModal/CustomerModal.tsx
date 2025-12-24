// app/dashboard/customers/components/CustomerModal/CustomerModal.tsx
"use client";
import { UserPlus, Edit, Eye, X } from 'lucide-react';
import type { ModalMode, Customer, FormData, Step } from '../types';
import AddEditCustomer from './AddEditCustomer';
import ViewCustomer from './ViewCustomer';

interface CustomerModalProps {
    isOpen: boolean;
    isClosing: boolean;
    modalMode: ModalMode;
    currentStep: number;
    formData: FormData;
    selectedCustomer: Customer | null;
    steps: Step[];
    modalRef: React.RefObject<HTMLDivElement | null>;
    getVehicleMakeLabel: (make: string) => string; // CHANGE 1: Updated prop name
    getStatusIcon: (status: string) => React.ReactNode;
    onClose: () => void;
    onNextStep: () => void;
    onPrevStep: () => void;
    onSubmit: () => void;
    onPersonalInfoChange: (field: string, value: string) => void;
    onContactDetailsChange: (field: string, value: any) => void; // CHANGE 2: Updated type from string to any
    onPreferencesChange: (field: string, value: string | boolean) => void;
    onEdit: () => void;
}

export default function CustomerModal({
    isOpen,
    isClosing,
    modalMode,
    currentStep,
    formData,
    selectedCustomer,
    steps,
    modalRef,
    getVehicleMakeLabel, // CHANGE 3: Updated prop name
    getStatusIcon,
    onClose,
    onNextStep,
    onPrevStep,
    onSubmit,
    onPersonalInfoChange,
    onContactDetailsChange,
    onPreferencesChange,
    onEdit
}: CustomerModalProps) {
    if (!isOpen) return null;

    const getModalTitle = () => {
        switch (modalMode) {
            case 'add':
                return 'Add New Customer';
            case 'edit':
                return 'Edit Customer';
            case 'view':
                return 'View Customer Details';
            default:
                return 'Customer';
        }
    };

    return (
        <>
            {/* Background Blur Overlay with fade animation */}
            <div
                className={`fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Modal Container with slide-up animation */}
            <div
                className={`fixed inset-0 z-9999 flex items-end md:items-center justify-center p-4 transition-all duration-500 ease-out ${isClosing ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
            >
                <div
                    ref={modalRef}
                    className={`bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto transition-all duration-500 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} modal-scrollbar`}
                    style={{
                        animation: !isClosing ? 'modalSlideUp 0.5s ease-out' : 'none'
                    }}
                >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${modalMode === 'add' ? 'bg-[#FE6B1D]' : modalMode === 'edit' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                {modalMode === 'add' && <UserPlus className="w-5 h-5 text-white" />}
                                {modalMode === 'edit' && <Edit className="w-5 h-5 text-white" />}
                                {modalMode === 'view' && <Eye className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{getModalTitle()}</h2>
                                <p className="text-gray-600 text-sm">
                                    {modalMode === 'view' ? 'Customer information' : `Step ${currentStep} of ${steps.length}`}
                                </p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        {modalMode === 'view' && selectedCustomer ? (
                            <ViewCustomer
                                customer={selectedCustomer}
                                onEdit={onEdit}
                                onClose={onClose}
                                getVehicleMakeLabel={getVehicleMakeLabel} // CHANGE 4: Updated prop name
                                getStatusIcon={getStatusIcon}
                            />
                        ) : (
                            <AddEditCustomer
                                mode={modalMode}
                                currentStep={currentStep}
                                formData={formData}
                                steps={steps}
                                onNextStep={onNextStep}
                                onPrevStep={onPrevStep}
                                onClose={onClose}
                                onSubmit={onSubmit}
                                onPersonalInfoChange={onPersonalInfoChange}
                                onContactDetailsChange={onContactDetailsChange} // CHANGE 5: Correct prop name
                                onPreferencesChange={onPreferencesChange}
                            />
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center">
                        <p className="text-sm text-gray-500">
                            {modalMode === 'view' ? 'Press ESC or click outside to close' : 'Click outside the modal or press ESC to close'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}