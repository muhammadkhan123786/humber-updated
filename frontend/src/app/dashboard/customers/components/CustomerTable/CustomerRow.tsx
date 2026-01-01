"use client";

import { User, Mail, Phone, MapPin, Car, Calendar, Eye, Edit, MoreVertical, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerRowProps {
    customer: Customer;
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void; // Delete prop add ki
    actionMenu: { isOpen: boolean; customerId: string | null }; // State prop add ki
    onActionMenuClick: (event: React.MouseEvent, customerId: string) => void;
    getVehicleMakeLabel: (make: string) => string;
}

export default function CustomerRow({
    customer,
    onView,
    onEdit,
    onDelete,
    actionMenu,
    onActionMenuClick,
    getVehicleMakeLabel
}: CustomerRowProps) {
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            default: return null;
        }
    };

    const firstVehicle = customer.vehicles?.[0];
    const vehicleMake = firstVehicle?.vehicleMake || '';
    const vehicleModel = firstVehicle?.vehicleModel || '';

    // Check if menu is open for THIS specific row
    const isMenuOpen = actionMenu.isOpen && actionMenu.customerId === customer.id;

    return (
        <tr 
            className="hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onView(customer)}
        >
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-[#FE6B1D]/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#FE6B1D]" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                    <Car className="w-4 h-4 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900">{vehicleModel || 'No Vehicle'}</div>
                </div>
                <div className="text-xs text-gray-600">
                    {getVehicleMakeLabel(vehicleMake)}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {customer.ownerPhone || customer.mobileNumber}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {customer.city}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {getStatusIcon(customer.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                        customer.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onView(customer); }}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    {/* 3 DOTS AND DROPDOWN SECTION */}
                    <div className="relative">
                        <button
                            onClick={(e) => onActionMenuClick(e, customer.id)}
                            className={`p-2 rounded-lg transition-colors ${isMenuOpen ? 'bg-gray-200' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-100 py-1 animate-in fade-in zoom-in duration-75"
                                onClick={(e) => e.stopPropagation()} // Menu par click karne se row click na ho
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(customer); }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Edit className="w-4 h-4" /> Edit Customer
                                </button>
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(customer.id); }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
}