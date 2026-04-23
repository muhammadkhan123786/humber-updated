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
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const AddRider = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const {
    saveRider,
    fetchRiderById,
    selectedRider,
    loading,
    error,
    clearError,
  } = useRider();

  const router = useRouter();
  const searchParams = useSearchParams();
  const riderId = searchParams.get("id");

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

  const { handleSubmit, trigger, reset, setError: setFormError } = methods;


  useEffect(() => {
    if (riderId) {
      fetchRiderById(riderId);
    }
  }, [riderId, fetchRiderById]);

  useEffect(() => {
    if (selectedRider && riderId) {
      reset({
        firstName: selectedRider.personId?.firstName || "",
        lastName: selectedRider.personId?.lastName || "",
        email: selectedRider.contactId?.emailId || "",
        mobileNumber: selectedRider.contactId?.mobileNumber || "",
        DOB: selectedRider.DOB
          ? new Date(selectedRider.DOB).toISOString().split("T")[0]
          : "",
        nationalIssuranceNumber: selectedRider.nationalIssuranceNumber || "",
        addressLine1: selectedRider.addressId?.address || "",
        postalCode: selectedRider.addressId?.zipCode || "",
        city: selectedRider.addressId?.city || "",
        licenseNumber: selectedRider.licenseNumber || "",
        licenseExpiryDate: selectedRider.licenseExpiryDate
          ? new Date(selectedRider.licenseExpiryDate)
              .toISOString()
              .split("T")[0]
          : "",
        yearsOfExperience: selectedRider.yearsOfExperience || 0,
        vehicleTypeId:
          selectedRider.vehicleTypeId?._id || selectedRider.vehicleTypeId || "",
        modelId: selectedRider.modelId || "",
        vehicleYear: selectedRider.vehicleYear?.toString() || "",
        licensePlate: selectedRider.licensePlate || "",
        insuranceCompany: selectedRider.insuranceCompany || "",
        policyNumber: selectedRider.policyNumber || "",
        insuranceExpiryDate: selectedRider.insuranceExpiryDate
          ? new Date(selectedRider.insuranceExpiryDate)
              .toISOString()
              .split("T")[0]
          : "",
        emergencyContactNumber: selectedRider.emergencyContactNumber || "",
        phoneNumber: selectedRider.phoneNumber || "",
        relationShip: selectedRider.relationShip || "",
        motCertificateNumber: selectedRider.motCertificateNumber || "",
        motExpiryDate: selectedRider.motExpiryDate
          ? new Date(selectedRider.motExpiryDate).toISOString().split("T")[0]
          : "",
        bankName: selectedRider.bankName || "",
        accountHolderName: selectedRider.accountHolderName || "",
        accountNumber: selectedRider.accountNumber || "",
        sortCode: selectedRider.sortCode || "",
        employeementTypeId:
          selectedRider.employeementTypeId?._id ||
          selectedRider.employeementTypeId ||
          "",
        availbilitiesIds:
          selectedRider.availbilitiesIds?.map((a: any) => a._id || a) || [],
        zones: selectedRider.zones || [],
        profilePic: selectedRider.profilePic || "",
        licenseFrontPic: selectedRider.licenseFrontPic || "",
        licenseBackPic: selectedRider.licenseBackPic || "",
        insuranceDocumentPic: selectedRider.insuranceDocumentPic || "",
        motCertificatePic: selectedRider.motCertificatePic || "",
        utilityBillPic: selectedRider.utilityBillPic || "",
      });
    }
  }, [selectedRider, reset, riderId]);

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
        if (riderId) return true;
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
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
    else handleSubmit(onSubmit)();
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RiderFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await saveRider(data, riderId || undefined);
      toast.success(
        riderId ? "Rider updated successfully!" : "Rider added successfully!",
      );
      setTimeout(() => router.push("/dashboard/riders"), 800);
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || "Failed to save rider");
      setFormError("root", { message: err.message || "Failed to save rider" });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (loading && riderId && !selectedRider) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Loading Rider Data...</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
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
