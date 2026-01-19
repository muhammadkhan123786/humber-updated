"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTicketForm } from "../../../../../hooks/useTicketForm";
import { getById } from "../../../../../helper/apiHelper";
import StepSourceCustomer from "./StepSourceCustomer";
import StepProduct from "./StepProduct";
import StepIssueDetails from "./StepIssueDetails";
import StepLocationPriority from "./StepLocationPriority";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface CreateTicketProps {
  editMode?: boolean;
  existingData?: any;
}

const CreateTicket = ({
  editMode: initialEditMode = false,
  existingData: initialData,
}: CreateTicketProps) => {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id"); // This gets the ID from the URL

  const [currentStep, setCurrentStep] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

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
    statuses,
    setError,
    setSuccess,
    editingId,
    setEditData,
  } = useTicketForm();

  const isUpdating = initialEditMode || !!editingId || !!urlId;

  useEffect(() => {
    if (urlId) {
      console.log("Found Ticket ID in URL:", urlId);
    }
  }, [urlId]);

  useEffect(() => {
    const loadTicket = async () => {
      if (urlId && !editingId) {
        setIsFetching(true);
        try {
          const response = await getById("/customer-tickets", urlId);
          if (response?.success && response.data) {
            console.log("Fetched Ticket Data:", response.data);
            setEditData(response.data);
          } else {
            setError("Failed to load ticket details.");
          }
        } catch (err: any) {
          setError(err.message || "Error fetching ticket.");
        } finally {
          setIsFetching(false);
        }
      }
    };

    loadTicket();
  }, [urlId, editingId, setEditData, setError]);

  useEffect(() => {
    if (initialEditMode && initialData && !editingId) {
      setEditData(initialData);
    }
  }, [initialEditMode, initialData, editingId, setEditData]);

  const handleFinalSubmit = async () => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        setError("Please check the form for errors.");
        return;
      }
      const formData = form.getValues();
      await handleSubmit(formData);

      if (!isUpdating) {
        setTimeout(() => {
          form.reset();
          setCurrentStep(1);
          setSuccess(null);
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleNextStep = () => {
    const values = form.getValues();
    let canMove = false;

    if (currentStep === 1)
      canMove = !!(values.customerId && values.ticketSource);
    else if (currentStep === 2) canMove = !!values.vehicleId;
    else if (currentStep === 3)
      canMove = !!(values.issue_Details && values.issue_Details.length >= 5);
    else if (currentStep === 4)
      canMove = !!(values.location && values.priorityId);

    if (currentStep === 4) {
      handleFinalSubmit();
    } else if (canMove) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
    } else {
      setError("Required fields missing in this step.");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  return (
    <div className="min-h-screen px-4 md:px-8 pb-12 bg-[#F8F9FD] bg-fixed">
      <div className="max-w-5xl mx-auto pt-10">
        <h1 className="text-3xl font-black text-[#4F39F6] text-center mb-1">
          {isUpdating ? "Update Service Ticket" : "Create Service Ticket"}
        </h1>
        <p className="text-center text-gray-400 font-bold mb-12 text-sm uppercase tracking-widest">
          Step {currentStep} of 4
        </p>

        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <p className="text-green-600 font-semibold text-sm">{success}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[40px] shadow-xl border border-white/60 overflow-hidden relative">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
              <Loader2 className="text-[#4F39F6] animate-spin" size={40} />
            </div>
          )}

          {currentStep === 1 && (
            <StepSourceCustomer
              form={form}
              customers={customers}
              onNext={handleNextStep}
            />
          )}
          {currentStep === 2 && (
            <StepProduct
              form={form}
              vehicles={vehicles}
              isLoadingVehicles={isLoading}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}
          {currentStep === 3 && (
            <StepIssueDetails
              form={form}
              isLoading={isLoading}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}
          {currentStep === 4 && (
            <StepLocationPriority
              form={form}
              priorities={priorities}
              technicians={technicians}
              customers={customers}
              statuses={statuses}
              vehicles={vehicles}
              isUpdating={isUpdating}
              isLoading={isLoading}
              onBack={handlePreviousStep}
              onCreate={handleFinalSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
