"use client";
import React, { useState } from "react";
import Header from "./Header";
import RegistrationProgress from "./RegistrationProgress";
import FormFooter from "./FormFooter";
import PersonalInfoForm from "./PersonalInfoForm";
import DriverSection from "./DriverSection";
import DocumentsSection from "./DocumentsSection";
import BankDetails from "./BankDetails";
import EmploymentDetails from "./EmploymentDetails";

const AddRider = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 space-y-6">
      <Header />

      <RegistrationProgress currentStep={currentStep} />

      <div className="min-h-[400px]">
        {currentStep === 1 && <PersonalInfoForm />}

        {currentStep === 2 && <DriverSection />}
        {currentStep === 3 && <DocumentsSection />}
        {currentStep === 4 && <BankDetails />}
        {currentStep === 5 && <EmploymentDetails />}
      </div>

      <FormFooter
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === totalSteps}
      />
    </div>
  );
};

export default AddRider;
