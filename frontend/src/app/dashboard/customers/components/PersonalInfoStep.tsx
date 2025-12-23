// app/dashboard/customers/components/PersonalInfoStep.tsx
"use client";

import { User, Mail, Phone, Home, Building, Hash } from 'lucide-react';

// Define the exact fields that PersonalInfoStep uses
export type PersonalInfoFields =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'mobileNumber'
    | 'address'
    | 'city'
    | 'postCode';

interface PersonalInfoStepProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        mobileNumber: string;
        address: string;
        city: string;
        postCode: string;
    };
    onInputChange: (field: PersonalInfoFields, value: string) => void;
}

export default function PersonalInfoStep({ formData, onInputChange }: PersonalInfoStepProps) {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-3xl font-semibold text-gray-900"> Personal Information</h3>
                <p className="text-gray-600 mt-1">
                    Tell us about yourself. All fields marked <span className="text-red-500">*</span> are required.
                </p>
            </div>

            <div className="space-y-6">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#FE6B1D]" />
                                First Name <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => onInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#FE6B1D]" />
                                Last Name <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => onInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                </div>

                {/* Row 2: Email & Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#FE6B1D]" />
                                Email Address <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#FE6B1D]" />
                                Mobile Number <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={(e) => onInputChange('mobileNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                            placeholder="Enter your mobile number"
                            required
                        />
                    </div>
                </div>

                {/* Row 3: Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-[#FE6B1D]" />
                            Address <span className="text-red-500">*</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => onInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                        placeholder="Enter your address"
                        required
                    />
                </div>

                {/* Row 4: City & Post Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-[#FE6B1D]" />
                                City <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <select
                            value={formData.city}
                            onChange={(e) => onInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                            required
                        >
                            <option value="">Select your City</option>
                            <option value="New York">New York</option>
                            <option value="London">London</option>
                            <option value="Tokyo">Tokyo</option>
                            <option value="Sydney">Sydney</option>
                            <option value="Dubai">Dubai</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-[#FE6B1D]" />
                                Post Code <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.postCode}
                            onChange={(e) => onInputChange('postCode', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                            placeholder="00000000"
                            required
                        />
                    </div>
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