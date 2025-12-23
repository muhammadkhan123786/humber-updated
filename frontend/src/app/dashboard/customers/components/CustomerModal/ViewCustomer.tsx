// app/dashboard/customers/components/CustomerModal/ViewCustomer.tsx
"use client";

import { User, Mail, Phone, Car, MapPin, Calendar, Edit } from 'lucide-react';
import type { Customer } from '../types';

interface ViewCustomerProps {
    customer: Customer;
    onEdit: () => void;
    onClose: () => void;
    getVehicleTypeLabel: (type: string) => string;
    getVehicleModelLabel: (model: string) => string;
    getVehicleColorLabel: (color: string) => string;
    getStatusIcon: (status: string) => React.ReactNode;
}

export default function ViewCustomer({
    customer,
    onEdit,
    onClose,
    getVehicleTypeLabel,
    getVehicleModelLabel,
    getVehicleColorLabel,
    getStatusIcon
}: ViewCustomerProps) {
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Vehicle Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Vehicle Number</label>
                            <p className="font-medium">{customer.vehicleNumber}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Type & Model</label>
                            <p className="font-medium">{getVehicleTypeLabel(customer.vehicleType)} - {getVehicleModelLabel(customer.vehicleModel)}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Color</label>
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: customer.vehicleColor === 'other' ? '#6b7280' : customer.vehicleColor }} />
                                <span className="font-medium">{getVehicleColorLabel(customer.vehicleColor)}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Registration Date</label>
                            <p className="font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(customer.registrationDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
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