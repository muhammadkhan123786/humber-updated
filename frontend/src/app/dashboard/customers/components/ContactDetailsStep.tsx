"use client";

import { User, Mail, Phone, Car, Plus, Trash2, Edit } from 'lucide-react';
import { VehicleData } from './types';

export type ContactDetailsFields =
    | 'ownerName'
    | 'ownerEmail'
    | 'ownerPhone'
    | 'vehicles';

interface ContactDetailsStepProps {
    formData: {
        ownerName: string;
        ownerEmail: string;
        ownerPhone: string;
        vehicles: VehicleData[];
    };
    onInputChange: (field: ContactDetailsFields, value: any) => void;
    onAddVehicleClick: () => void;
    onEditVehicleClick: (vehicleId: string) => void;
    onDeleteVehicleClick: (vehicleId: string) => void;
    onSetPrimaryVehicle: (vehicleId: string) => void;
    getVehicleMakeLabel: (make: string) => string;
}

export default function ContactDetailsStep({ 
    formData, 
    onInputChange,
    onAddVehicleClick,
    onEditVehicleClick,
    onDeleteVehicleClick,
    onSetPrimaryVehicle,
    getVehicleMakeLabel
}: ContactDetailsStepProps) {
   
    const vehicles = formData.vehicles || [];
    const hasVehicles = vehicles.length > 0;
    const primaryVehicle = hasVehicles ? vehicles.find(v => v.isPrimary) || vehicles[0] : null;

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Step 2: Vehicle & Owner Details</h3>
                <p className="text-gray-600 mt-1">
                    Enter vehicle and owner information. All fields marked <span className="text-red-500">*</span> are required.
                </p>
            </div>

            <div className="space-y-6">
                {/* Owner Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#FE6B1D]" />
                        Owner Information
                    </h4>

                    <div className="space-y-4">
                        {/* Owner Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#FE6B1D]" />
                                    Owner Full Name <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                type="text"
                                value={formData.ownerName}
                                onChange={(e) => onInputChange('ownerName', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                placeholder="Enter owner's full name"
                                required
                            />
                        </div>

                        {/* Owner Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#FE6B1D]" />
                                        Owner Email <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <input
                                    type="email"
                                    value={formData.ownerEmail}
                                    onChange={(e) => onInputChange('ownerEmail', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                    placeholder="Enter owner's email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#FE6B1D]" />
                                        Owner Phone <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.ownerPhone}
                                    onChange={(e) => onInputChange('ownerPhone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                    placeholder="Enter owner's phone number"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Car className="w-4 h-4 text-[#FE6B1D]" />
                            Vehicle Information
                        </h4>
                        <button
                            onClick={onAddVehicleClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Add Vehicle
                        </button>
                    </div>

                    {/* Vehicles List */}
                    {hasVehicles ? (
                        <div className="space-y-4 mb-6">
                            <h5 className="text-sm font-medium text-gray-700">Registered Vehicles ({vehicles.length})</h5>
                            <div className="space-y-3">
                                {vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Car className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium">{vehicle.vehicleModel}</span>
                                                    {vehicle.isPrimary && (
                                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Make: </span>
                                                        {getVehicleMakeLabel(vehicle.vehicleMake)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Model: </span>
                                                        {vehicle.vehicleModel}
                                                    </div>
                                                    {vehicle.serialNumber && (
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Serial Number: </span>
                                                            {vehicle.serialNumber}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-medium">Manufacturing: </span>
                                                        {vehicle.manufacturing}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Year: </span>
                                                        {vehicle.yearOfDesign}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 ml-4">
                                                {!vehicle.isPrimary && (
                                                    <button
                                                        onClick={() => onSetPrimaryVehicle(vehicle.id)}
                                                        className="p-2 hover:bg-green-50 rounded-lg text-green-600 text-xs font-medium"
                                                        title="Set as Primary"
                                                    >
                                                        Set Primary
                                                    </button>
                                                )}
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => onEditVehicleClick(vehicle.id)}
                                                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                                                        title="Edit Vehicle"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteVehicleClick(vehicle.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                                        title="Delete Vehicle"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-6 bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                            <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">No vehicles added yet</p>
                            <button
                                onClick={onAddVehicleClick}
                                className="flex items-center gap-2 px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Vehicle
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Required Fields Note */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Indicates required field
                </p>
            </div>
        </div>
    );
}