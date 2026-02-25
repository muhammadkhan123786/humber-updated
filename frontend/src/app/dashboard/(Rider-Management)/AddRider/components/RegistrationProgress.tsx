"use client";
import React from "react";
import { motion } from "framer-motion";

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
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isStepActive ? "100%" : "0%" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="h-full bg-linear-[#0061FF]"
                  />
                </div>

                <motion.p
                  animate={{
                    color: isStepActive ? "#2563eb" : "#9ca3af",
                    scale: isStepActive ? 1.05 : 1,
                  }}
                  className="text-center text-[11px] font-bold transition-colors"
                >
                  {step.name}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RegistrationProgress;
