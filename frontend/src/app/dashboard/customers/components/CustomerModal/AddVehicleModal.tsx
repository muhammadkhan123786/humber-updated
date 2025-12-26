"use client";

import { Car, X, Tag, Calendar, Factory, Wrench } from 'lucide-react';

export type VehicleFields = 
    | 'vehicleMake'
    | 'vehicleModel'
    | 'serialNumber'
    | 'manufacturing'
    | 'yearOfDesign';

export interface VehicleData {
    id: string;
    vehicleMake: string;
    vehicleModel: string;
    serialNumber: string;
    manufacturing: string;
    yearOfDesign: string;
}

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleData: VehicleData;
    onVehicleDataChange: (field: VehicleFields, value: string) => void;
    onSave: () => void;
    editingVehicleId?: string | null;
    isOptional?: boolean; // New prop to make vehicle optional
}

export default function AddVehicleModal({ 
    isOpen, 
    onClose, 
    vehicleData, 
    onVehicleDataChange, 
    onSave,
    editingVehicleId,
    isOptional = false // Default to false for backward compatibility
}: AddVehicleModalProps) {
    if (!isOpen) return null;

    const vehicleMakes = [
        { value: 'toyota', label: 'Toyota' },
        { value: 'honda', label: 'Honda' },
        { value: 'ford', label: 'Ford' },
        { value: 'bmw', label: 'BMW' },
        { value: 'mercedes', label: 'Mercedes-Benz' },
        { value: 'audi', label: 'Audi' },
        { value: 'tesla', label: 'Tesla' },
        { value: 'hyundai', label: 'Hyundai' },
        { value: 'kia', label: 'Kia' },
        { value: 'nissan', label: 'Nissan' },
        { value: 'volkswagen', label: 'Volkswagen' },
        { value: 'other', label: 'Other' },
    ];

    const years = Array.from({ length: 30 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    });

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
                                    {isOptional ? 'Enter vehicle information (Optional)' : 'Enter vehicle information. All fields marked <span className="text-red-500">*</span> are required.'}
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
                        {/* Make */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Factory className="w-4 h-4 text-[#FE6B1D]" />
                                    Make {!isOptional && <span className="text-red-500">*</span>}
                                </div>
                            </label>
                            <select
                                value={vehicleData.vehicleMake}
                                onChange={(e) => onVehicleDataChange('vehicleMake', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                required={!isOptional}
                            >
                                <option value="">Select brand</option>
                                {vehicleMakes.map((make) => (
                                    <option key={make.value} value={make.value}>
                                        {make.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4 text-[#FE6B1D]" />
                                    Model {!isOptional && <span className="text-red-500">*</span>}
                                </div>
                            </label>
                            <input
                                type="text"
                                value={vehicleData.vehicleModel}
                                onChange={(e) => onVehicleDataChange('vehicleModel', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                placeholder="e.g., Camry, Civic, Model 3"
                                required={!isOptional}
                            />
                        </div>

                        {/* Serial Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#FE6B1D]" />
                                    Serial Number (If available)
                                </div>
                            </label>
                            <input
                                type="text"
                                value={vehicleData.serialNumber}
                                onChange={(e) => onVehicleDataChange('serialNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                placeholder="Enter serial number if available"
                            />
                        </div>

                        {/* Manufacturing */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Factory className="w-4 h-4 text-[#FE6B1D]" />
                                    Manufacturing {!isOptional && <span className="text-red-500">*</span>}
                                </div>
                            </label>
                            <input
                                type="text"
                                value={vehicleData.manufacturing}
                                onChange={(e) => onVehicleDataChange('manufacturing', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                placeholder="e.g., Xiomi"
                                required={!isOptional}
                            />
                        </div>

                        {/* Year of Design */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#FE6B1D]" />
                                    Year of Design {!isOptional && <span className="text-red-500">*</span>}
                                </div>
                            </label>
                            <select
                                value={vehicleData.yearOfDesign}
                                onChange={(e) => onVehicleDataChange('yearOfDesign', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                required={!isOptional}
                            >
                                <option value="">Select year</option>
                                {years.map((year) => (
                                    <option key={year.value} value={year.value}>
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Required Fields Note */}
                        {!isOptional && (
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    <span className="text-red-500">*</span> Indicates required field
                                </p>
                            </div>
                        )}
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