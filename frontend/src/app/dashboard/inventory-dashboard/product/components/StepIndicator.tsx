import React from 'react';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

export function StepIndicator({ steps, currentStep, onStepClick }: { 
  steps: Step[], 
  currentStep: number,
  onStepClick?: (id: number) => void 
}) {
  return (
    <div className="flex items-center gap-8 px-6 border-b border-gray-200 bg-white">
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        
        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(step.id)}
            className={`flex items-center gap-2 py-4 px-1 transition-all duration-200 outline-none ${
              isActive 
                ? " text-blue-600" 
                : " text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>
              {step.icon}
            </span>
            <span className="text-sm font-medium">
              {step.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}