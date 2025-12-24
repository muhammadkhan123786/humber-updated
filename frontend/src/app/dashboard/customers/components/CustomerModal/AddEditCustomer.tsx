"use client";

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
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
    onPreferencesChange: (field: string, value: string | boolean) => void;
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

    // Helper functions for vehicle labels
    const getVehicleMakeLabel = useCallback((make: string): string => {
        const makeMap: Record<string, string> = {
            'toyota': 'Toyota',
            'honda': 'Honda',
            'ford': 'Ford',
            'bmw': 'BMW',
            'mercedes': 'Mercedes-Benz',
            'audi': 'Audi',
            'tesla': 'Tesla',
            'hyundai': 'Hyundai',
            'kia': 'Kia',
            'nissan': 'Nissan',
            'volkswagen': 'Volkswagen',
            'other': 'Other'
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

    const handleEditVehicleClick = (vehicleId: string) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            setCurrentVehicleData(vehicle);
            setEditingVehicleId(vehicleId);
            setShowAddVehicleModal(true);
        }
    };

    const handleDeleteVehicleClick = (vehicleId: string) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
            
            if (updatedVehicles.length > 0) {
                updatedVehicles[0].isPrimary = true;
            }
            
            onContactDetailsChange('vehicles', updatedVehicles);
        }
    };

    const handleSetPrimaryVehicle = (vehicleId: string) => {
        const updatedVehicles = vehicles.map(vehicle => ({
            ...vehicle,
            isPrimary: vehicle.id === vehicleId
        }));
        onContactDetailsChange('vehicles', updatedVehicles);
    };

    const handleVehicleDataChange = (field: string, value: string) => {
        setCurrentVehicleData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveVehicle = () => {
        if (!currentVehicleData.vehicleMake || !currentVehicleData.vehicleModel) {
            alert('Please fill Make and Model fields');
            return;
        }

        let updatedVehicles: VehicleData[];
        
        if (editingVehicleId) {
            updatedVehicles = vehicles.map(vehicle => 
                vehicle.id === editingVehicleId ? { ...currentVehicleData, id: editingVehicleId } : vehicle
            );
        } else {
            const newVehicle = {
                ...currentVehicleData,
                id: Date.now().toString(),
                isPrimary: vehicles.length === 0
            };
            updatedVehicles = [...vehicles, newVehicle];
        }

        onContactDetailsChange('vehicles', updatedVehicles);
        setShowAddVehicleModal(false);
        setCurrentVehicleData({
            id: '',
            vehicleMake: '',
            vehicleModel: '',
            serialNumber: '',
            manufacturing: '',
            yearOfDesign: '',
            isPrimary: false
        });
        setEditingVehicleId(null);
    };

    const handleSubmit = () => {
        if (vehicles.length === 0) {
            alert('Please add at least one vehicle');
            return;
        }
        
        onSubmit();
    };

    const contactDetailsFormData = {
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        vehicles: vehicles
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        formData={{
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            mobileNumber: formData.mobileNumber,
                            address: formData.address,
                            city: formData.city,
                            postCode: formData.postCode,
                        }}
                        onInputChange={onPersonalInfoChange}
                    />
                );
            case 2:
                return (
                    <ContactDetailsStep
                        formData={contactDetailsFormData}
                        onInputChange={onContactDetailsChange}
                        onAddVehicleClick={handleAddVehicleClick}
                        onEditVehicleClick={handleEditVehicleClick}
                        onDeleteVehicleClick={handleDeleteVehicleClick}
                        onSetPrimaryVehicle={handleSetPrimaryVehicle}
                        getVehicleMakeLabel={getVehicleMakeLabel}
                    />
                );
            case 3:
                return (
                    <PreferencesStep
                        formData={{
                            contactMethod: formData.contactMethod,
                            preferredLanguage: formData.preferredLanguage,
                            receiveUpdates: formData.receiveUpdates,
                            termsAccepted: formData.termsAccepted,
                        }}
                        onInputChange={onPreferencesChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Stepper */}
                <FormStepper
                    steps={steps}
                    currentStep={currentStep}
                />

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {renderStepContent()}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        {currentStep > 1 && (
                            <button
                                onClick={onPrevStep}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                    
                    <div className="flex gap-3">
                        {currentStep < steps.length ? (
                            <button
                                onClick={onNextStep}
                                className="flex items-center gap-2 px-6 py-3 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <Save className="w-4 h-4" />
                                {mode === 'add' ? 'Create Customer' : 'Update Customer'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Vehicle Modal */}
            {showAddVehicleModal && (
                <AddVehicleModal
                    isOpen={showAddVehicleModal}
                    onClose={() => {
                        setShowAddVehicleModal(false);
                        setEditingVehicleId(null);
                        setCurrentVehicleData({
                            id: '',
                            vehicleMake: '',
                            vehicleModel: '',
                            serialNumber: '',
                            manufacturing: '',
                            yearOfDesign: '',
                            isPrimary: false
                        });
                    }}
                    vehicleData={currentVehicleData}
                    onVehicleDataChange={handleVehicleDataChange}
                    onSave={handleSaveVehicle}
                    editingVehicleId={editingVehicleId}
                />
            )}
        </>
    );
}