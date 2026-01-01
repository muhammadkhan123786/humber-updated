"use client";

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import PersonalInfoStep from '../PersonalInfoStep';
import ContactDetailsStep from '../ContactDetailsStep';
import PreferencesStep from '../PreferencesStep';
import FormStepper from '../FormStepper';
import AddVehicleModal from './AddVehicleModal';
import type { FormData, VehicleData } from '../types';

interface AddEditCustomerProps {
    mode: 'add' | 'edit' | 'view'; 
    currentStep: number;
    formData: FormData;
    steps: Array<{ id: number; title: string }>;
    onNextStep: () => void;
    onPrevStep: () => void;
    onClose: () => void;
    onSubmit: () => void;
    onPersonalInfoChange: (field: string, value: string) => void;
    onContactDetailsChange: (field: string, value: any) => void;
    onPreferencesChange: (field: string, value: any) => void;
}

export default function AddEditCustomer({
    mode,
    currentStep,
    formData,
    steps,
    onNextStep,
    onPrevStep,
    onClose,
    onSubmit,
    onPersonalInfoChange,
    onContactDetailsChange,
    onPreferencesChange
}: AddEditCustomerProps) {
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
    const [currentVehicleData, setCurrentVehicleData] = useState<VehicleData>({
        id: '',
        vehicleMake: '',
        vehicleModel: '',
        serialNumber: '',
        manufacturing: '',
        yearOfDesign: '',
        isPrimary: false
    });

    const vehicles = formData.vehicles || [];

    const getVehicleMakeLabel = useCallback((make: string): string => {
        const makeMap: Record<string, string> = {
            'toyota': 'Toyota', 'honda': 'Honda', 'ford': 'Ford', 'bmw': 'BMW',
            'mercedes': 'Mercedes-Benz', 'audi': 'Audi', 'tesla': 'Tesla',
            'hyundai': 'Hyundai', 'kia': 'Kia', 'nissan': 'Nissan',
            'volkswagen': 'Volkswagen', 'other': 'Other'
        };
        return makeMap[make] || make;
    }, []);

    const handleAddVehicleClick = () => {
        setCurrentVehicleData({
            id: Date.now().toString(),
            vehicleMake: '',
            vehicleModel: '',
            serialNumber: '',
            manufacturing: '',
            yearOfDesign: '',
            isPrimary: vehicles.length === 0
        });
        setEditingVehicleId(null);
        setShowAddVehicleModal(true);
    };

    const handleSaveVehicle = () => {
        if (!currentVehicleData.vehicleMake || !currentVehicleData.vehicleModel) {
            alert('Please fill Make and Model fields');
            return;
        }

        let updatedVehicles: VehicleData[];
        if (editingVehicleId) {
            updatedVehicles = vehicles.map(v => v.id === editingVehicleId ? { ...currentVehicleData, id: editingVehicleId } : v);
        } else {
            updatedVehicles = [...vehicles, { ...currentVehicleData, id: Date.now().toString(), isPrimary: vehicles.length === 0 }];
        }

        onContactDetailsChange('vehicles', updatedVehicles);
        setShowAddVehicleModal(false);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep 
                        formData={{
                            ...formData,
                            // Ensure backend field names match exactly
                            companyName: formData.companyName || '',
                            registrationNo: formData.registrationNo || '',
                            vatNo: formData.vatNo || '',
                            website: formData.website || '',
                        }} 
                        onInputChange={onPersonalInfoChange} 
                    />
                );
            case 2:
                return (
                    <ContactDetailsStep 
                        formData={{ 
                            ownerName: formData.ownerName, 
                            ownerEmail: formData.ownerEmail, 
                            ownerPhone: formData.ownerPhone, 
                            vehicles 
                        }}
                        onInputChange={onContactDetailsChange}
                        onAddVehicleClick={handleAddVehicleClick}
                        onEditVehicleClick={(id) => {
                            const v = vehicles.find(veh => veh.id === id);
                            if(v) { setCurrentVehicleData(v); setEditingVehicleId(id); setShowAddVehicleModal(true); }
                        }}
                        onDeleteVehicleClick={(id) => {
                            if(confirm('Are you sure you want to remove this vehicle?')) {
                                onContactDetailsChange('vehicles', vehicles.filter(v => v.id !== id));
                            }
                        }}
                        onSetPrimaryVehicle={(id) => onContactDetailsChange('vehicles', vehicles.map(v => ({...v, isPrimary: v.id === id})))}
                        getVehicleMakeLabel={getVehicleMakeLabel}
                    />
                );
            case 3:
                return (
                    <PreferencesStep 
                        formData={{
                            issues: formData.issues || [], 
                            description: formData.description || ""
                        }} 
                        onInputChange={onPreferencesChange} 
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <FormStepper steps={steps} currentStep={currentStep} />
            
            <div className="min-h-[450px]">{renderStepContent()}</div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                <div className="flex gap-3 w-full sm:w-auto">
                    {currentStep > 1 && (
                        <button onClick={onPrevStep} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                    )}
                    <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                        Cancel
                    </button>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    {/* Quick Save */}
                    {currentStep < steps.length && (
                        <button 
                            type="button" 
                            onClick={onSubmit} 
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
                        >
                            <Save className="w-4 h-4" /> Save & Exit
                        </button>
                    )}

                    {currentStep < steps.length ? (
                        <button 
                            type="button"
                            onClick={onNextStep} 
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition font-semibold"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={onSubmit} 
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            <Save className="w-4 h-4" /> {mode === 'add' ? 'Create Customer' : 'Update Customer'}
                        </button>
                    )}
                </div>
            </div>

            {showAddVehicleModal && (
                <AddVehicleModal
                    isOpen={showAddVehicleModal}
                    onClose={() => setShowAddVehicleModal(false)}
                    vehicleData={currentVehicleData}
                    onVehicleDataChange={(f, v) => setCurrentVehicleData(p => ({...p, [f]: v}))}
                    onSave={handleSaveVehicle}
                    editingVehicleId={editingVehicleId}
                />
            )}
        </div>
    );
}