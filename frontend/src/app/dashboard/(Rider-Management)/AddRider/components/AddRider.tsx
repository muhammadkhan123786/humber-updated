"use client";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "./Header";
import RegistrationProgress from "./RegistrationProgress";
import FormFooter from "./FormFooter";
import PersonalInfoForm from "./PersonalInfoForm";
import DriverSection from "./DriverSection";
import DocumentsSection from "./DocumentsSection";
import BankDetails from "./BankDetails";
import EmploymentDetails from "./EmploymentDetails";
import { useRider } from "@/hooks/useRider";
import { riderSchema, RiderFormData } from "@/schema/rider.schema";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AddRider = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const { saveRider, loading, error, clearError } = useRider();
  const router = useRouter();

  const methods = useForm<RiderFormData>({
    resolver: zodResolver(riderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      DOB: "",
      nationalIssuranceNumber: "",
      addressLine1: "",
      postalCode: "",
      licenseNumber: "",
      licenseExpiryDate: "",
      yearsOfExperience: 0,
      vehicleTypeId: "",
      modelId: "",
      vehicleYear: "",
      licensePlate: "",
      insuranceCompany: "",
      policyNumber: "",
      insuranceExpiryDate: "",
      emergencyContactNumber: "",
      phoneNumber: "",
      relationShip: "",
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      sortCode: "",
      employeementTypeId: "",
      availbilitiesIds: [],
      zones: [],
    },
    mode: "onTouched",
  });

  const { handleSubmit, trigger, setError: setFormError } = methods;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof RiderFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "email",
          "mobileNumber",
          "DOB",
          "nationalIssuranceNumber",
          "addressLine1",
          "postalCode",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "licenseNumber",
          "licenseExpiryDate",
          "yearsOfExperience",
          "vehicleTypeId",
          "modelId",
          "vehicleYear",
          "licensePlate",
          "insuranceCompany",
          "policyNumber",
          "insuranceExpiryDate",
          "emergencyContactNumber",
          "phoneNumber",
          "relationShip",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "licenseFrontPic",
          "licenseBackPic",
          "insuranceDocumentPic",
        ];
        break;
      case 4:
        fieldsToValidate = [
          "bankName",
          "accountHolderName",
          "accountNumber",
          "sortCode",
        ];
        break;
      case 5:
        fieldsToValidate = ["employeementTypeId", "availbilitiesIds", "zones"];
        break;
      default:
        return true;
    }

    return await trigger(fieldsToValidate);
  };

  const handleNext = async () => {
    const isStepValid = await validateStep(currentStep);

    if (!isStepValid) {
      toast.error("Please fill all required fields");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Last step - submit form
      handleSubmit(onSubmit)();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: RiderFormData) => {
    if (isSubmitting) return;

    console.log("Submitting data:", data);
    setIsSubmitting(true);

    try {
      const response = await saveRider(data);
      console.log("Save response:", response);

      toast.success("Rider added successfully!", {
        duration: 4000,
        position: "top-right",
        icon: "🎉",
        style: {
          background: "#22c55e",
          color: "white",
          fontWeight: "bold",
        },
        iconTheme: {
          primary: "white",
          secondary: "#16a34a",
        },
      });
      setTimeout(() => {
        router.push("/dashboard/riders");
      }, 1000);
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.message || "Failed to save rider");
      setFormError("root", {
        message: err.message || "Failed to save rider",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="min-h-screen bg-gray-50/30 space-y-6"
      >
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
          isLoading={loading || isSubmitting}
        />
      </form>
    </FormProvider>
  );
};

export default AddRider;
