"use client";

import { User, Mail, Phone, Car, MapPin, Calendar, Edit, List, Building2, Globe, FileText, BadgeCheck, Settings } from 'lucide-react';
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
                
                {/* Personal & Corporate Info Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {customer.customerType === 'corporate' ? 'Business Information' : 'Personal Information'}
                    </h3>
                    
                    <div className="space-y-3">
                        {/* 1. Customer Type Badge */}
                        <div className="mb-4">
                            <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-md ${
                                customer.customerType === 'corporate' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {customer.customerType} Customer
                            </span>
                        </div>

                        {/* Corporate Specific Fields */}
                        {customer.customerType === 'corporate' && (
                            <div className="pb-3 mb-3 border-b border-gray-200 space-y-3">
                                <div>
                                    <label className="text-sm text-gray-500 flex items-center gap-1">
                                        <Building2 className="w-4 h-4" /> Company Name
                                    </label>
                                    <p className="font-bold text-blue-900">{customer.companyName || 'N/A'}</p>
                                </div>
                                
                                {/* 2. Website Field */}
                                <div>
                                    <label className="text-sm text-gray-500 flex items-center gap-1">
                                        <Globe className="w-4 h-4" /> Website
                                    </label>
                                    <p className="font-medium text-blue-600 truncate">
                                        {customer.website ? (
                                            <a href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {customer.website}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Reg No</label>
                                        <p className="text-sm font-medium">{customer.registrationNo || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">VAT No</label>
                                        <p className="text-sm font-medium">{customer.vatNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-500">{customer.customerType === 'corporate' ? 'Contact Person' : 'Full Name'}</label>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {customer.email}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Phone</label>
                            <p className="font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
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
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {vehicles.map((vehicle, index) => (
                                <div key={vehicle.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Car className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{vehicle.vehicleModel}</span>
                                                {vehicle.isPrimary && (
                                                    <span className="px-2 py-0.5 text-[10px] bg-green-100 text-green-800 rounded-full font-bold">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600">
                                                <div><span className="font-medium">Make:</span> {getVehicleMakeLabel(vehicle.vehicleMake)}</div>
                                                <div><span className="font-medium">Year:</span> {vehicle.yearOfDesign}</div>
                                                
                                                {/* 3. Manufacturing Info */}
                                                <div className="col-span-2 border-t pt-2 mt-1">
                                                    <span className="font-medium">Manufacturing:</span> {vehicle.manufacturing || 'N/A'}
                                                </div>

                                                {vehicle.serialNumber && (
                                                    <div className="col-span-2 text-gray-500 italic">SN: {vehicle.serialNumber}</div>
                                                )}
                                            </div>
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
                            <p className="font-medium">{customer.ownerName || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Owner Email</label>
                            <p className="font-medium">{customer.ownerEmail || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Owner Phone</label>
                            <p className="font-medium">{customer.ownerPhone || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Preferences Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Preferences</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Preferred Method</label>
                            <p className="font-medium capitalize">{customer.contactMethod || 'N/A'}</p>
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
                        <MapPin className="w-5 h-5" /> Location
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Address</label>
                            <p className="font-medium">{customer.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-gray-500">City</label>
                                <p className="font-medium">{customer.city}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Postcode</label>
                                <p className="font-medium">{customer.postCode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-500">Status</label>
                            <div className="flex items-center gap-2 mt-1">
                                {getStatusIcon(customer.status)}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    customer.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Customer ID</label>
                            <p className="font-medium font-mono text-xs">{customer.id}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Created On</label>
                            <p className="font-medium">{customer.createdAt.toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    onClick={onEdit}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-sm"
                >
                    <Edit className="w-4 h-4" /> Edit Customer
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    );
}