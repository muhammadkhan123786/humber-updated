"use client";

import { Save } from 'lucide-react';
import PersonalInfoStep from '../PersonalInfoStep';
import type { FormData } from '../types';

interface AddEditCustomerProps {
    mode: 'add' | 'edit' | 'view'; 
    formData: FormData;
    onClose: () => void;
    onSubmit: () => void;
    onPersonalInfoChange: (field: string, value: string) => void;
}

export default function AddEditCustomer({
    mode,
    formData,
    onClose,
    onSubmit,
    onPersonalInfoChange,
}: AddEditCustomerProps) {
    
    return (
        <div className="space-y-6">
            {/* Form Body - Only Personal Info */}
            <div className="min-h-[300px]">
                <PersonalInfoStep 
                    formData={{
                        ...formData,
                        // Backend compatibility ke liye fields ensure karein
                        companyName: formData.companyName || '',
                        registrationNo: formData.registrationNo || '',
                        vatNo: formData.vatNo || '',
                        website: formData.website || '',
                    }} 
                    onInputChange={onPersonalInfoChange} 
                />
            </div>
            
            {/* Footer Buttons - Simplified */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-gray-200">
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        type="button"
                        onClick={onSubmit} 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition font-semibold shadow-sm"
                    >
                        <Save className="w-4 h-4" /> 
                        {mode === 'add' ? 'Create Customer' : 'Update Customer'}
                    </button>
                </div>
            </div>
        </div>
    );
}