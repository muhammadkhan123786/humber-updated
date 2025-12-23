// app/dashboard/customers/components/ContactDetailsStep.tsx
"use client";

import { User, Mail, Phone, Car, Tag, Palette, Calendar } from 'lucide-react';

export type ContactDetailsFields =
    | 'ownerName'
    | 'ownerEmail'
    | 'ownerPhone'
    | 'vehicleNumber'
    | 'vehicleType'
    | 'vehicleModel'
    | 'vehicleColor'
    | 'registrationDate';

interface ContactDetailsStepProps {
    formData: {
        ownerName: string;
        ownerEmail: string;
        ownerPhone: string;
        vehicleNumber: string;
        vehicleType: string;
        vehicleModel: string;
        vehicleColor: string;
        registrationDate: string;
    };
    onInputChange: (field: ContactDetailsFields, value: string) => void;
}

export default function ContactDetailsStep({ formData, onInputChange }: ContactDetailsStepProps) {
    const vehicleTypes = [
        { value: 'car', label: 'Car' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'truck', label: 'Truck' },
        { value: 'suv', label: 'SUV' },
        { value: 'van', label: 'Van' },
        { value: 'bus', label: 'Bus' },
    ];

    const vehicleColors = [
        { value: 'white', label: 'White' },
        { value: 'black', label: 'Black' },
        { value: 'silver', label: 'Silver' },
        { value: 'gray', label: 'Gray' },
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'brown', label: 'Brown' },
        { value: 'other', label: 'Other' },
    ];

    const vehicleModels = [
        { value: 'toyota_camry', label: 'Toyota Camry' },
        { value: 'honda_civic', label: 'Honda Civic' },
        { value: 'ford_f150', label: 'Ford F-150' },
        { value: 'bmw_3series', label: 'BMW 3 Series' },
        { value: 'mercedes_cclass', label: 'Mercedes C-Class' },
        { value: 'audi_a4', label: 'Audi A4' },
        { value: 'tesla_model3', label: 'Tesla Model 3' },
        { value: 'hyundai_elantra', label: 'Hyundai Elantra' },
        { value: 'kia_sportage', label: 'Kia Sportage' },
        { value: 'other', label: 'Other Model' },
    ];

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
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#FE6B1D]" />
                        Vehicle Information
                    </h4>

                    <div className="space-y-4">
                        {/* Vehicle Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#FE6B1D]" />
                                    Vehicle Number/Plate <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                type="text"
                                value={formData.vehicleNumber}
                                onChange={(e) => onInputChange('vehicleNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                placeholder="e.g., ABC-1234 or DL-01-AB-1234"
                                required
                            />
                        </div>

                        {/* Vehicle Type & Model */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-[#FE6B1D]" />
                                        Vehicle Type <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <select
                                    value={formData.vehicleType}
                                    onChange={(e) => onInputChange('vehicleType', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                    required
                                >
                                    <option value="">Select vehicle type</option>
                                    {vehicleTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-[#FE6B1D]" />
                                        Vehicle Model <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <select
                                    value={formData.vehicleModel}
                                    onChange={(e) => onInputChange('vehicleModel', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                    required
                                >
                                    <option value="">Select vehicle model</option>
                                    {vehicleModels.map((model) => (
                                        <option key={model.value} value={model.value}>
                                            {model.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Vehicle Color & Registration Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-[#FE6B1D]" />
                                        Vehicle Color <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <select
                                    value={formData.vehicleColor}
                                    onChange={(e) => onInputChange('vehicleColor', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                                    required
                                >
                                    <option value="">Select vehicle color</option>
                                    {vehicleColors.map((color) => (
                                        <option key={color.value} value={color.value}>
                                            {color.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#FE6B1D]" />
                                        Registration Date <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <input
                                    type="date"
                                    value={formData.registrationDate}
                                    onChange={(e) => onInputChange('registrationDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Optional: Insurance File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#FE6B1D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Insurance Document (Optional)
                                </div>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#FE6B1D] hover:text-[#e55a17] focus-within:outline-none">
                                            <span>Upload insurance file</span>
                                            <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            </div>
                        </div>
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