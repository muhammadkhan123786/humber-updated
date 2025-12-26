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
    onPreferencesChange: (field: string, value: any) => void; // Value type updated to any for array support
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
                return <PersonalInfoStep 
                    formData={{
                        firstName: formData.firstName, lastName: formData.lastName,
                        email: formData.email, mobileNumber: formData.mobileNumber,
                        address: formData.address, city: formData.city, postCode: formData.postCode,
                    }} 
                    onInputChange={onPersonalInfoChange} 
                />;
            case 2:
                return <ContactDetailsStep 
                    formData={{ ownerName: formData.ownerName, ownerEmail: formData.ownerEmail, ownerPhone: formData.ownerPhone, vehicles }}
                    onInputChange={onContactDetailsChange}
                    onAddVehicleClick={handleAddVehicleClick}
                    onEditVehicleClick={(id) => {
                        const v = vehicles.find(veh => veh.id === id);
                        if(v) { setCurrentVehicleData(v); setEditingVehicleId(id); setShowAddVehicleModal(true); }
                    }}
                    onDeleteVehicleClick={(id) => {
                        if(confirm('Delete?')) onContactDetailsChange('vehicles', vehicles.filter(v => v.id !== id));
                    }}
                    onSetPrimaryVehicle={(id) => onContactDetailsChange('vehicles', vehicles.map(v => ({...v, isPrimary: v.id === id})))}
                    getVehicleMakeLabel={getVehicleMakeLabel}
                />;
            case 3:
                return <PreferencesStep 
                    formData={{
                        // Ensure defaults exist to avoid TS errors
                        issues: (formData as any).issues || [], 
                        description: (formData as any).description || ""
                    }} 
                    onInputChange={onPreferencesChange} 
                />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <FormStepper steps={steps} currentStep={currentStep} />
            <div className="min-h-[400px]">{renderStepContent()}</div>
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                    {currentStep > 1 && (
                        <button onClick={onPrevStep} className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition">
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                    )}
                    <button onClick={onClose} className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
                <div className="flex gap-3">
                    {currentStep < steps.length ? (
                        <button onClick={onNextStep} className="flex items-center gap-2 px-6 py-3 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={onSubmit} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
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