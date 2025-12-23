// app/dashboard/customers/components/PreferencesStep.tsx
"use client";

import { Mail, Phone, MessageSquare, Globe } from 'lucide-react';

export type PreferencesFields =
    | 'contactMethod'
    | 'preferredLanguage'
    | 'receiveUpdates'
    | 'termsAccepted';

interface PreferencesStepProps {
    formData: {
        contactMethod: string;
        preferredLanguage: string;
        receiveUpdates: boolean;
        termsAccepted: boolean;
    };
    onInputChange: (field: PreferencesFields, value: boolean | string) => void;
}

export default function PreferencesStep({ formData, onInputChange }: PreferencesStepProps) {
    const contactMethods = [
        { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
        { value: 'phone', label: 'Phone Call', icon: <Phone className="w-4 h-4" /> },
        { value: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
        { value: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'ar', label: 'Arabic' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Step 3: Preferences & Terms</h3>
                <p className="text-gray-600 mt-1">
                    Set your communication preferences and accept the terms.
                </p>
            </div>

            <div className="space-y-6">
                {/* Contact Method */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">
                        Preferred Contact Method <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {contactMethods.map((method) => (
                            <button
                                key={method.value}
                                type="button"
                                onClick={() => onInputChange('contactMethod', method.value)}
                                className={`p-4 rounded-lg border-2 transition-all ${formData.contactMethod === method.value
                                    ? 'border-[#FE6B1D] bg-[#FE6B1D]/5'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`p-2 rounded-full ${formData.contactMethod === method.value ? 'bg-[#FE6B1D]/10' : 'bg-gray-100'}`}>
                                        {method.icon}
                                    </div>
                                    <span className="text-sm font-medium">{method.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    {!formData.contactMethod && (
                        <p className="text-red-500 text-sm mt-2">Please select a contact method</p>
                    )}
                </div>

                {/* Preferred Language */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#FE6B1D]" />
                            Preferred Language <span className="text-red-500">*</span>
                        </div>
                    </label>
                    <select
                        value={formData.preferredLanguage}
                        onChange={(e) => onInputChange('preferredLanguage', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition bg-white"
                        required
                    >
                        <option value="">Select preferred language</option>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    {!formData.preferredLanguage && (
                        <p className="text-red-500 text-sm mt-2">Please select a language</p>
                    )}
                </div>

                {/* Receive Updates */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">Receive Updates & Promotions</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                Get notified about new services, promotions, and updates.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onInputChange('receiveUpdates', !formData.receiveUpdates)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.receiveUpdates ? 'bg-[#FE6B1D]' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.receiveUpdates ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={formData.termsAccepted}
                            onChange={(e) => onInputChange('termsAccepted', e.target.checked)}
                            className="mt-1 h-4 w-4 text-[#FE6B1D] border-gray-300 rounded focus:ring-[#FE6B1D]"
                            required
                        />
                        <div>
                            <label htmlFor="terms" className="text-sm font-medium text-gray-900">
                                I agree to the Terms and Conditions <span className="text-red-500">*</span>
                            </label>
                            <p className="text-gray-600 text-sm mt-1">
                                By checking this box, you agree to our Terms of Service and Privacy Policy.
                            </p>
                            {!formData.termsAccepted && (
                                <p className="text-red-500 text-sm mt-2">You must agree to the terms and conditions</p>
                            )}
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