"use client";

import { useState } from "react";
import { useTicketForm } from "../../../../../hooks/useTicketForm";
import StepSourceCustomer from "./StepSourceCustomer";
import StepProduct from "./StepProduct";
import StepIssueDetails from "./StepIssueDetails";
import StepLocationPriority from "./StepLocationPriority";
import { AlertCircle, CheckCircle } from "lucide-react";

const CreateTicket = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    form,
    handleSubmit,
    isLoading,
    error,
    success,
    customers,
    vehicles,
    priorities,
    technicians,
    setError,
    setSuccess,
  } = useTicketForm();

  const handleFinalSubmit = async () => {
    try {
      console.log("Submitting form...");

      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        console.log("Form validation errors:", errors);

        // Find first error
        const errorMessages = Object.values(errors)
          .map((err: any) => err?.message)
          .filter(Boolean);

        if (errorMessages.length > 0 && errorMessages[0]) {
          setError(errorMessages[0]);
        } else {
          setError("Please fill all required fields correctly");
        }
        return;
      }

      const formData = form.getValues();
      console.log("Form data to submit:", formData);

      const result = await (handleSubmit(formData) as Promise<any>);

      if (result && result.data) {
        setSuccess(
          `Ticket created successfully! Ticket Code: ${
            result.data.ticketCode || "Generated"
          }`
        );

        setTimeout(() => {
          form.reset();
          setCurrentStep(1);
          setSuccess(null);
        }, 3000);
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Failed to create ticket. Please try again.");
    }
  };

  const steps = [
    { id: 1, label: "Source & Customer", color: "#00B8DB" },
    { id: 2, label: "Product", color: "#F6339A" },
    { id: 3, label: "Issue Details", color: "#FB2C36" },
    { id: 4, label: "Location & Priority", color: "#00C950" },
  ];

  // Check if current step is valid before allowing next
  const isStepValid = (step: number) => {
    const values = form.getValues();

    switch (step) {
      case 1:
        return values.customerId && values.ticketSource;
      case 2:
        return values.vehicleId;
      case 3:
        return values.issue_Details && values.issue_Details.length >= 5;
      case 4:
        return values.location && values.priorityId;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      handleFinalSubmit();
    } else if (isStepValid(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      switch (currentStep) {
        case 1:
          setError("Please select a customer and ticket source");
          break;
        case 2:
          setError("Please select a vehicle");
          break;
        case 3:
          setError("Please describe the issue (minimum 5 characters)");
          break;
        case 4:
          setError("Please select location and priority");
          break;
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  return (
    <div
      className="min-h-screen px-4 md:px-8 pb-12 bg-[#F8F9FD] bg-fixed"
      style={{
        backgroundImage: `radial-gradient(at 100% 0%, rgba(251, 100, 182, 0.12) 0%, transparent 50%), radial-gradient(at 0% 0%, rgba(0, 211, 242, 0.1) 0%, transparent 40%)`,
      }}
    >
      <div className="max-w-5xl mx-auto pt-10">
        <h1 className="text-3xl font-black text-[#4F39F6] text-center mb-1">
          Create Service Ticket
        </h1>
        <p className="text-center text-gray-400 font-bold mb-12 text-sm uppercase tracking-widest">
          Step {currentStep} of 4
        </p>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 font-medium text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle className="text-green-500" size={20} />
            <p className="text-green-600 font-medium text-sm">{success}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-16 relative max-w-4xl mx-auto px-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                    currentStep >= step.id
                      ? "text-white scale-110 ring-4 ring-white"
                      : "bg-white border-2 border-gray-100 text-gray-300"
                  }`}
                  style={{
                    background:
                      currentStep >= step.id
                        ? `linear-gradient(135deg, ${step.color}, ${step.color}CC)`
                        : "",
                  }}
                >
                  {currentStep > step.id ? (
                    <CheckCircle size={22} strokeWidth={3} />
                  ) : (
                    <span className="font-black text-sm">{step.id}</span>
                  )}
                </div>

                <span
                  className={`absolute -bottom-8 text-[11px] font-black uppercase whitespace-nowrap tracking-tight transition-colors duration-300 ${
                    currentStep >= step.id ? "text-[#1E293B]" : "text-gray-300"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 ease-in-out"
                    style={{
                      width: currentStep > step.id ? "100%" : "0%",
                      backgroundColor: steps[index].color,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden">
          {currentStep === 1 && (
            <StepSourceCustomer
              form={form}
              customers={customers}
              onNext={() => {
                setError(null);
                handleNextStep();
              }}
            />
          )}
          {currentStep === 2 && (
            <StepProduct
              form={form}
              vehicles={vehicles}
              isLoadingVehicles={isLoading}
              onNext={() => {
                setError(null);
                handleNextStep();
              }}
              onBack={handlePreviousStep}
            />
          )}
          {currentStep === 3 && (
            <StepIssueDetails
              form={form}
              isLoading={isLoading}
              onNext={() => {
                setError(null);
                handleNextStep();
              }}
              onBack={handlePreviousStep}
            />
          )}
          {currentStep === 4 && (
            <StepLocationPriority
              form={form}
              priorities={priorities}
              technicians={technicians}
              customers={customers}
              vehicles={vehicles}
              isLoading={isLoading}
              onBack={handlePreviousStep}
              onCreate={() => {
                setError(null);
                handleFinalSubmit();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
