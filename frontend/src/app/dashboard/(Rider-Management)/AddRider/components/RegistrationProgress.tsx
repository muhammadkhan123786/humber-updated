import React from "react";

interface RegistrationProgressProps {
  currentStep: number;
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({
  currentStep,
}) => {
  const steps = [
    { name: "Personal" },
    { name: "Driver Details" },
    { name: "Documents" },
    { name: "Banking" },
    { name: "Employment" },
  ];

  return (
    <div className="w-full py-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Registration Progress
          </h2>
          <span className="text-sm font-medium text-gray-500">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <div className="flex gap-3 items-start">
          {steps.map((step, index) => {
            const isStepActive = index + 1 <= currentStep;

            return (
              <div key={index} className="flex-1 space-y-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isStepActive
                      ? "bg-linear-to-r from-[#0061FF] to-[#0061FF]"
                      : "bg-gray-100"
                  }`}
                />

                <p
                  className={`text-center text-[11px] font-bold transition-colors ${
                    isStepActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RegistrationProgress;
