"use client";

import React, { useState } from "react";
import StepSourceCustomer from "./StepSourceCustomer";
import StepProduct from "./StepProduct";
import StepIssueDetails from "./StepIssueDetails";
import StepLocationPriority from "./StepLocationPriority";

const CreateTicket = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, label: "Source & Customer", color: "#00D3F2" },
    { id: 2, label: "Product", color: "#AD46FF" },
    { id: 3, label: "Issue Details", color: "#FF6900" },
    { id: 4, label: "Location & Priority", color: "#00C950" },
  ];

  return (
    <div
      className="min-h-screen px-8 pb-12 bg-[#F8F9FD] bg-fixed"
      style={{
        backgroundImage: `radial-gradient(at 100% 0%, rgba(251, 100, 182, 0.12) 0%, transparent 50%),
                          radial-gradient(at 0% 0%, rgba(0, 211, 242, 0.1) 0%, transparent 40%)`,
      }}
    >
      <div className="max-w-5xl mx-auto pt-10">
        <h1 className="text-3xl font-black text-[#4F39F6] text-center mb-1">
          Create Service Ticket
        </h1>
        <p className="text-center text-gray-400 font-bold mb-12 text-sm uppercase tracking-widest">
          Step {currentStep} of 4
        </p>

        <div className="flex items-center justify-between mb-20 max-w-4xl mx-auto relative px-10">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 shadow-md ${
                    currentStep >= step.id
                      ? "text-white scale-110"
                      : "bg-white text-gray-300 border border-gray-100"
                  }`}
                  style={{
                    backgroundColor: currentStep >= step.id ? step.color : "",
                  }}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <span
                  className={`absolute -bottom-8 text-[10px] font-black uppercase tracking-tighter w-28 text-center ${
                    currentStep >= step.id ? "text-[#1E293B]" : "text-gray-300"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx !== steps.length - 1 && (
                <div className="flex-1 h-[3px] bg-gray-100 mx-4 rounded-full relative overflow-hidden">
                  <div
                    className="absolute inset-0 transition-all duration-700 ease-in-out"
                    style={{
                      width: currentStep > step.id ? "100%" : "0%",
                      backgroundColor: steps[idx].color,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden">
          {currentStep === 1 && (
            <StepSourceCustomer onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <StepProduct
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <StepIssueDetails
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <StepLocationPriority
              onBack={() => setCurrentStep(3)}
              onCreate={() => alert("Ticket Created Successfully!")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
