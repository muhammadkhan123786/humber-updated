// app/dashboard/customers/components/CustomerTable/CustomerRow.tsx
"use client";

import { User, Mail, Phone, MapPin, Car, Calendar, Eye, Edit, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerRowProps {
    customer: Customer;
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onActionMenuClick: (event: React.MouseEvent, customerId: string) => void;
    getVehicleMakeLabel: (make: string) => string;
}

export default function CustomerRow({
    customer,
    onView,
    onEdit,
    onActionMenuClick,
    getVehicleMakeLabel
}: CustomerRowProps) {
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'inactive':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            default:
                return null;
        }
    };

    // Get first vehicle data
    const firstVehicle = customer.vehicles?.[0];
    const vehicleMake = firstVehicle?.vehicleMake || '';
    const vehicleModel = firstVehicle?.vehicleModel || '';

    return (
        <tr 
            className="hover:bg-gray-50 cursor-pointer"
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
                        <div className="text-xs text-gray-400 mt-1">
                            ID: {customer.id}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                    <Car className="w-4 h-4 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900">
                        {vehicleModel || 'No Vehicle'}
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    {getVehicleMakeLabel(vehicleMake)} {vehicleModel ? `• ${vehicleModel}` : ''}
                </div>
                {firstVehicle?.yearOfDesign && (
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Year: {firstVehicle.yearOfDesign}
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {customer.ownerPhone}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                    {customer.contactMethod.charAt(0).toUpperCase() + customer.contactMethod.slice(1)}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {customer.city}
                </div>
                <div className="text-sm text-gray-600 truncate max-w-[150px]">
                    {customer.address}
                </div>
            </td>
            <td className="px-6 py-4">
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
                <div className="text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {customer.createdAt.toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(customer);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(customer);
                        }}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                        title="Edit Customer"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => onActionMenuClick(e, customer.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 relative"
                        title="More Options"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}