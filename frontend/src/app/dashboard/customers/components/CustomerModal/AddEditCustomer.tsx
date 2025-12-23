// app/dashboard/customers/components/CustomerModal/AddEditCustomer.tsx
"use client";
import { ShieldCheck, ZapIcon, HeadphonesIcon, Award, User, ArrowLeft, Check } from 'lucide-react';
import PersonalInfoStep from '../PersonalInfoStep';
import ContactDetailsStep from '../ContactDetailsStep';
import PreferencesStep from '../PreferencesStep';
import FormStepper from '../FormStepper';
import type { FormData, ModalMode, Step } from '../types';
import type { PersonalInfoFields } from '../PersonalInfoStep';
import type { ContactDetailsFields } from '../ContactDetailsStep';
import type { PreferencesFields } from '../PreferencesStep';

interface AddEditCustomerProps {
    mode: 'add' | 'edit' | 'view';
    currentStep: number;
    formData: FormData;
    steps: Step[];
    onNextStep: () => void;
    onPrevStep: () => void;
    onClose: () => void;
    onSubmit: () => void;
    onPersonalInfoChange: (field: PersonalInfoFields, value: string) => void;
    onContactDetailsChange: (field: ContactDetailsFields, value: string) => void;
    onPreferencesChange: (field: PreferencesFields, value: string | boolean) => void;
}

export default function AddEditCustomer({
    mode,
    currentStep,
    formData,
    steps,
    onNextStep,
    onPrevStep,
    onClose,
    onSubmit,
    onPersonalInfoChange,
    onContactDetailsChange,
    onPreferencesChange
}: AddEditCustomerProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-7">
            {/* Left Section - Customer Hub */}
            <div className="hidden md:block relative lg:w-1/2 bg-[#FE6B1D] text-white p-8 lg:p-12 overflow-hidden">
                {/* Decorative Circle - Top Right */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFFFFF30] rounded-full pointer-events-none" />

                {/* Decorative Circle - Bottom Left */}
                <div className="absolute -bottom-3 -left-11 w-20 h-14 bg-[#FFFFFF20] rounded-full pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-10 mt-16 flex flex-col h-full">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-[#FFFFFF3B] rounded-xl">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-[32px] font-semibold">Customer Hub</h1>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <p className="text-[32px] leading-8 font-semibold mb-8">
                            Join Thousands of Satisfied Customers
                        </p>

                        {/* Features List */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">Secure & encrypted data protection</h3>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                                    <ZapIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">Fast onboarding process</h3>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                                    <HeadphonesIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">24/7 dedicated customer support</h3>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">Exclusive member rewards & offers</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Stepper & Form */}
            <div className="lg:w-3/5">
                {/* Stepper */}
                <div className="mb-6">
                    <FormStepper steps={steps} currentStep={currentStep} />
                </div>

                {/* Form Content */}
                <div className="mb-6">
                    {currentStep === 1 && (
                        <PersonalInfoStep
                            formData={formData}
                            onInputChange={onPersonalInfoChange}
                        />
                    )}

                    {currentStep === 2 && (
                        <ContactDetailsStep
                            formData={formData}
                            onInputChange={onContactDetailsChange}
                        />
                    )}

                    {currentStep === 3 && (
                        <PreferencesStep
                            formData={formData}
                            onInputChange={onPreferencesChange}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div>
                        {currentStep > 1 ? (
                            <button
                                onClick={onPrevStep}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {currentStep < steps.length ? (
                            <button
                                onClick={onNextStep}
                                className="px-6 py-3 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#e55a17] transition flex items-center gap-2"
                            >
                                Next: {steps[currentStep]?.title}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={onSubmit}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                disabled={mode === 'add' && !formData.termsAccepted}
                            >
                                <Check className="w-4 h-4" />
                                {mode === 'add' ? 'Complete Registration' : 'Update Customer'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Progress</span>
                        <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#FE6B1D] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}