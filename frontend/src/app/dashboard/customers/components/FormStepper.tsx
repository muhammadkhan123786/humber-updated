// app/dashboard/customers/components/FormStepper.tsx
"use client";

interface Step {
    id: number;
    title: string;
}

interface FormStepperProps {
    steps: Step[];
    currentStep: number;
}

export default function FormStepper({ steps, currentStep }: FormStepperProps) {
    return (
        <div className="w-full">
            {/* Desktop View - Horizontal Stepper with Title Below */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Connector Line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

                    <div className="grid grid-cols-3 gap-0">
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center">
                                {/* Step Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${step.id === currentStep
                                            ? 'bg-[#FE6B1D] border-[#FE6B1D] text-white'
                                            : step.id < currentStep
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'bg-white border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {step.id < currentStep ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-sm font-medium">{step.id}</span>
                                    )}
                                </div>

                                {/* Step Title Below Circle */}
                                <div className="text-center mt-2">
                                    <span
                                        className={`text-sm font-medium ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile View - Vertical Stepper */}
            <div className="md:hidden">
                <div className="space-y-4">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-3">
                            {/* Step Circle */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${step.id === currentStep
                                        ? 'bg-[#FE6B1D] border-[#FE6B1D] text-white'
                                        : step.id < currentStep
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                            >
                                {step.id < currentStep ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-medium">{step.id}</span>
                                )}
                            </div>

                            {/* Step Info */}
                            <div>
                                <span
                                    className={`font-medium ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}