"use client";

import { Car, X, Tag, Palette, Calendar } from 'lucide-react';

export type VehicleFields = 
    | 'vehicleNumber'
    | 'vehicleType'
    | 'vehicleModel'
    | 'vehicleColor'
    | 'registrationDate';

export interface VehicleData {
    id: string;
    vehicleNumber: string;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    registrationDate: string;
}

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleData: VehicleData;
    onVehicleDataChange: (field: VehicleFields, value: string) => void;
    onSave: () => void;
    editingVehicleId?: string | null;
}

export default function AddVehicleModal({ 
    isOpen, 
    onClose, 
    vehicleData, 
    onVehicleDataChange, 
    onSave,
    editingVehicleId 
}: AddVehicleModalProps) {
    if (!isOpen) return null;

    const vehicleTypes = [
        { value: 'car', label: 'Car' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'truck', label: 'Truck' },
        { value: 'suv', label: 'SUV' },
        { value: 'van', label: 'Van' },
        { value: 'bus', label: 'Bus' },
    ];

    const vehicleColors = [
        { value: 'white', label: 'White' },
        { value: 'black', label: 'Black' },
        { value: 'silver', label: 'Silver' },
        { value: 'gray', label: 'Gray' },
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'brown', label: 'Brown' },
        { value: 'other', label: 'Other' },
    ];

    const vehicleModels = [
        { value: 'toyota_camry', label: 'Toyota Camry' },
        { value: 'honda_civic', label: 'Honda Civic' },
        { value: 'ford_f150', label: 'Ford F-150' },
        { value: 'bmw_3series', label: 'BMW 3 Series' },
        { value: 'mercedes_cclass', label: 'Mercedes C-Class' },
        { value: 'audi_a4', label: 'Audi A4' },
        { value: 'tesla_model3', label: 'Tesla Model 3' },
        { value: 'hyundai_elantra', label: 'Hyundai Elantra' },
        { value: 'kia_sportage', label: 'Kia Sportage' },
        { value: 'other', label: 'Other Model' },
    ];

    return (
        <>
            {/* Background Overlay */}
            <div className="fixed inset-0 z-10000 bg-black/50 backdrop-blur-sm transition-all duration-300" />

            {/* Modal Container */}
            <div className="fixed inset-0 z-10001 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#FE6B1D]">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingVehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Enter vehicle information. All fields marked <span className="text-red-500">*</span> are required.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-6">
                        {/* Vehicle Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#FE6B1D]" />
                                    Vehicle Number/Plate <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                type="text"
                                value={vehicleData.vehicleNumber}
                                onChange={(e) => onVehicleDataChange('vehicleNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                placeholder="e.g., ABC-1234 or DL-01-AB-1234"
                                required
                            />
                        </div>

                        {/* Vehicle Type & Model */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-[#FE6B1D]" />
                                        Vehicle Type <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <select
                                    value={vehicleData.vehicleType}
                                    onChange={(e) => onVehicleDataChange('vehicleType', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                    required
                                >
                                    <option value="">Select vehicle type</option>
                                    {vehicleTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-[#FE6B1D]" />
                                        Vehicle Model <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <select
                                    value={vehicleData.vehicleModel}
                                    onChange={(e) => onVehicleDataChange('vehicleModel', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                    required
                                >
                                    <option value="">Select vehicle model</option>
                                    {vehicleModels.map((model) => (
                                        <option key={model.value} value={model.value}>
                                            {model.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Vehicle Color & Registration Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-[#FE6B1D]" />
                                        Vehicle Color <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <select
                                    value={vehicleData.vehicleColor}
                                    onChange={(e) => onVehicleDataChange('vehicleColor', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                    required
                                >
                                    <option value="">Select vehicle color</option>
                                    {vehicleColors.map((color) => (
                                        <option key={color.value} value={color.value}>
                                            {color.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#FE6B1D]" />
                                        Registration Date <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <input
                                    type="date"
                                    value={vehicleData.registrationDate}
                                    onChange={(e) => onVehicleDataChange('registrationDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Required Fields Note */}
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                <span className="text-red-500">*</span> Indicates required field
                            </p>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="px-6 py-3 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition flex items-center gap-2"
                            >
                                <Car className="w-4 h-4" />
                                {editingVehicleId ? 'Update Vehicle' : 'Add Vehicle'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}