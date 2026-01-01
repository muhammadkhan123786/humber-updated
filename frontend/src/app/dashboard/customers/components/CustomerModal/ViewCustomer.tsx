"use client";

import { User, Mail, Phone, MapPin, Edit, Building2, Globe, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';
import type { Customer } from '../types';

interface ViewCustomerProps {
    customer: Customer;
    onEdit: () => void;
    onClose: () => void;
}

export default function ViewCustomer({
    customer,
    onEdit,
    onClose,
}: ViewCustomerProps) {

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active': return { icon: <CheckCircle className="w-4 h-4" />, classes: 'bg-green-100 text-green-800 border-green-200' };
            case 'inactive': return { icon: <XCircle className="w-4 h-4" />, classes: 'bg-red-100 text-red-800 border-red-200' };
            default: return { icon: <Clock className="w-4 h-4" />, classes: 'bg-amber-100 text-amber-800 border-amber-200' };
        }
    };

    const statusStyle = getStatusStyles(customer.status);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top Header Summary */}
            <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#FE6B1D]/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-[#FE6B1D]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase mt-1 ${statusStyle.classes}`}>
                            {statusStyle.icon} {customer.status}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Customer Type</p>
                    <p className={`text-sm font-bold ${customer.customerType === 'corporate' ? 'text-purple-600' : 'text-blue-600'}`}>
                        {customer.customerType?.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Contact & Identity Information - Full Width since vehicles are removed */}
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Identity & Contact Details
                </h3>
                
                <div className="space-y-4">
                    {customer.customerType === 'corporate' && (
                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                <Building2 className="w-3 h-3" /> Company Name
                            </label>
                            <p className="font-bold text-gray-900">{customer.companyName || 'N/A'}</p>
                            {customer.website && (
                                <div className="mt-2 pt-2 border-t border-gray-50">
                                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FE6B1D] hover:underline flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> {customer.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Mail className="w-4 h-4 text-gray-400" /> {customer.email}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Phone className="w-4 h-4 text-gray-400" /> {customer.mobileNumber}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" /> Address Details
                        </label>
                        <p className="text-sm text-gray-700 leading-relaxed italic">
                            {customer.address}, {customer.city}, {customer.postCode}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
                <div className="text-[11px] text-gray-400 font-mono bg-gray-50 px-3 py-1 rounded-full">
                    UID: {customer.id} | CREATED: {customer.createdAt.toLocaleDateString()}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Close
                    </button>
                    <button
                        onClick={onEdit}
                        className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-[#FE6B1D] rounded-lg hover:bg-[#FE6B1D]/90 shadow-lg shadow-[#FE6B1D]/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}