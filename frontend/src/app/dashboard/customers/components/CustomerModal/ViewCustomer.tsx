"use client";

import { User, Mail, Phone, Car, MapPin, Calendar, Edit, List } from 'lucide-react';
import type { Customer } from '../types';

interface ViewCustomerProps {
    customer: Customer;
    onEdit: () => void;
    onClose: () => void;
    getVehicleMakeLabel: (make: string) => string;
    getStatusIcon: (status: string) => React.ReactNode;
}

export default function ViewCustomer({
    customer,
    onEdit,
    onClose,
    getVehicleMakeLabel,
    getStatusIcon
}: ViewCustomerProps) {
    const vehicles = customer.vehicles || [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Info Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Full Name</label>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Phone</label>
                            <p className="font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {customer.mobileNumber}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Info Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Car className="w-5 h-5" />
                                Vehicle Information
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {vehicles.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <List className="w-4 h-4" />
                                {vehicles.filter(v => v.isPrimary).length} primary
                            </div>
                        )}
                    </div>

                    {vehicles.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {vehicles.map((vehicle, index) => (
                                <div key={vehicle.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Car className="w-4 h-4 text-gray-400" />
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
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-medium">Year: </span>
                                                    {vehicle.yearOfDesign}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 ml-2">
                                            Vehicle {index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No vehicles registered</p>
                    )}
                </div>

                {/* Owner Info Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Owner Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Owner Name</label>
                            <p className="font-medium">{customer.ownerName}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Owner Email</label>
                            <p className="font-medium">{customer.ownerEmail}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Owner Phone</label>
                            <p className="font-medium">{customer.ownerPhone}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Preferences Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Preferences
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Preferred Contact Method</label>
                            <p className="font-medium">{customer.contactMethod.charAt(0).toUpperCase() + customer.contactMethod.slice(1)}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Language</label>
                            <p className="font-medium">{customer.preferredLanguage === 'en' ? 'English' : 'Other'}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Receive Updates</label>
                            <p className="font-medium">{customer.receiveUpdates ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>

                {/* Location Info Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Address</label>
                            <p className="font-medium">{customer.address}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">City</label>
                            <p className="font-medium">{customer.city}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Postal Code</label>
                            <p className="font-medium">{customer.postCode}</p>
                        </div>
                    </div>
                </div>

                {/* Status & Dates Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Details
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Status</label>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(customer.status)}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${customer.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : customer.status === 'inactive'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Customer ID</label>
                            <p className="font-medium font-mono">{customer.id}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Created On</label>
                            <p className="font-medium">{customer.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Last Updated</label>
                            <p className="font-medium">{customer.updatedAt.toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons for View Mode */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    onClick={onEdit}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    Edit Customer
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}