"use client";

import { Building2, FileText, Globe, Percent } from 'lucide-react';

interface CorporateFieldsProps {
    formData: {
        companyName?: string;
        registrationNo?: string;
        vatNo?: string;
        website?: string;
    };
    onInputChange: (field: string, value: string) => void;
}

export default function CorporateFields({ formData, onInputChange }: CorporateFieldsProps) {
    return (
        <div className="space-y-6 pt-4 border-t border-gray-100 animate-in fade-in duration-500">
            <h4 className="text-lg font-medium text-gray-800">Corporate Details</h4>
            
            {/* Company Name (Required) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#FE6B1D]" />
                        Company Name <span className="text-red-500">*</span>
                    </div>
                </label>
                <input
                    type="text"
                    value={formData.companyName || ''}
                    onChange={(e) => onInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                    placeholder="Enter company name"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Registration No (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#FE6B1D]" />
                            Registration No (Optional)
                        </div>
                    </label>
                    <input
                        type="text"
                        value={formData.registrationNo || ''}
                        onChange={(e) => onInputChange('registrationNo', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                        placeholder="REG-12345"
                    />
                </div>

                {/* VAT No (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4 text-[#FE6B1D]" />
                            VAT No (Optional)
                        </div>
                    </label>
                    <input
                        type="text"
                        value={formData.vatNo || ''}
                        onChange={(e) => onInputChange('vatNo', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                        placeholder="VAT-6789"
                    />
                </div>
            </div>

            {/* Website (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#FE6B1D]" />
                        Website (Optional)
                    </div>
                </label>
                <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => onInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                    placeholder="https://www.company.com"
                />
            </div>
        </div>
    );
}