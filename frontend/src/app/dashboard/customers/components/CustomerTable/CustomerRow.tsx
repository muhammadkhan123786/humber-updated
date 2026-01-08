"use client";

import { User, Mail, Phone, MapPin, Eye, Edit, MoreVertical, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerRowProps {
    customer: Customer;
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
    actionMenu: { isOpen: boolean; customerId: string | null };
    onActionMenuClick: (event: React.MouseEvent, customerId: string) => void;
}

export default function CustomerRow({
    customer,
    onView,
    onEdit,
    onDelete,
    actionMenu,
    onActionMenuClick
}: CustomerRowProps) {
    
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active': 
                return { icon: <CheckCircle className="w-3.5 h-3.5" />, classes: 'bg-green-50 text-green-700 border-green-200' };
            case 'inactive': 
                return { icon: <XCircle className="w-3.5 h-3.5" />, classes: 'bg-red-50 text-red-700 border-red-200' };
            case 'pending': 
                return { icon: <Clock className="w-3.5 h-3.5" />, classes: 'bg-amber-50 text-amber-700 border-amber-200' };
            default: 
                return { icon: null, classes: 'bg-gray-50 text-gray-700 border-gray-200' };
        }
    };

    const statusStyle = getStatusStyles(customer.status);
    const isMenuOpen = actionMenu.isOpen && actionMenu.customerId === customer.id;

    return (
        <tr 
            className="hover:bg-blue-50/30 group cursor-pointer transition-all duration-200"
            onClick={() => onView(customer)}
        >
            {/* Customer Info */}
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0 bg-linear-to-br from-[#FE6B1D] to-[#ff8c4d] rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-[#FE6B1D] transition-colors">
                            {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                        </div>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className="px-6 py-4">
                <div className="text-sm text-gray-700 flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-md">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    {customer.mobileNumber || 'N/A'}
                </div>
            </td>

            {/* Location */}
            <td className="px-6 py-4">
                <div className="text-sm text-gray-700 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {customer.address || 'Not set'}
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusStyle.classes}`}>
                    {statusStyle.icon}
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => onView(customer)}
                        className="p-2 hover:bg-white hover:shadow-md rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                        title="Quick View"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={(e) => onActionMenuClick(e, customer.id)}
                            className={`p-2 rounded-lg transition-all ${isMenuOpen ? 'bg-[#FE6B1D] text-white shadow-lg' : 'hover:bg-white hover:shadow-md text-gray-400 hover:text-gray-900'}`}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-110 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => onEdit(customer)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FE6B1D] transition-colors"
                                >
                                    <Edit className="w-4 h-4" /> Edit Profile
                                </button>
                                <div className="h-px bg-gray-100 mx-2 my-1" />
                                <button
                                    onClick={() => onDelete(customer.id)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
}