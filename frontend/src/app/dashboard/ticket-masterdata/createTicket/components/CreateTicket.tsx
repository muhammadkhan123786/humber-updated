"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTicketForm } from "../../../../../hooks/useTicketForm";
import { getById } from "../../../../../helper/apiHelper";
import StepSourceCustomer from "./StepSourceCustomer";
import StepProduct from "./StepProduct";
import StepIssueDetails from "./StepIssueDetails";
import StepLocationPriority from "./StepLocationPriority";
import SuccessPopup from "./SuccessPopup"; // ADDED IMPORT
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface CreateTicketProps {
  editMode?: boolean;
  existingData?: any;
}

const steps = [
  { id: 1, label: "Source & Customer", color: "from-[#2B7FFF] to-[#00B8DB]" },
  { id: 2, label: "Product", color: "from-[#AD46FF] to-[#F6339A]" },
  { id: 3, label: "Issue Details", color: "from-[#FF6900] to-[#FB2C36]" },
  { id: 4, label: "Location & Priority", color: "from-[#00C950] to-[#00BC7D]" },
];

const CreateTicket = ({
  editMode: initialEditMode = false,
  existingData: initialData,
}: CreateTicketProps) => {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ADDED STATE
  const [submittedFormData, setSubmittedFormData] = useState<any>(null); // ADDED STATE
  const [ticketResponse, setTicketResponse] = useState<any>(null); // ADDED STATE

  const router = useRouter();
  const {
    form,
    handleSubmit,
    isLoading,
    customers,
    vehicles,
    priorities,
    technicians,
    statuses,
    brands,
    handleAddVehicle,
    models,
    colors,
    setError,
    setSuccess,
    editingId,
    setEditData,
  } = useTicketForm();

  const isUpdating = initialEditMode || !!editingId || !!urlId;

  useEffect(() => {
    const loadTicket = async () => {
      if (urlId && !editingId) {
        setIsFetching(true);
        try {
          const response = await getById("/customer-tickets", urlId);
          if (response?.success && response.data) {
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
    console.log("handleFinalSubmit called");
    console.log("Current step:", currentStep);
    console.log("Form values:", form.getValues());

    try {
      const isValid = await form.trigger(undefined, { shouldFocus: true });
      console.log("Form validation result:", isValid);

      if (!isValid) {
        const errors = form.formState.errors;
        console.log("Form errors:", errors);
        setError("Please check the form for errors.");
        return;
      }

      const formData = form.getValues();
      console.log("🎯 FORM VALUES FOR SUBMIT:", formData);

      // Save form data for success popup
      setSubmittedFormData(formData);

      const result = await handleSubmit(formData);
      console.log("API Response:", result);

      if (result && result.success) {
        // Save the API response data
        setTicketResponse(result.data);
        setShowSuccessPopup(true);

        if (!isUpdating) {
          setTimeout(() => {
            form.reset();
            setCurrentStep(1);
            setSuccess(null);
          }, 3000);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const isStepValid = () => {
    const values = form.watch();

    if (currentStep === 1) return !!(values.customerId && values.ticketSource);
    if (currentStep === 2) {
      if (!values.customerId) {
        console.log("Step 2 invalid: No customer selected");
        return false;
      }

      // If vehicle is selected from dropdown, that's sufficient
      if (values.vehicleId) {
        console.log("Step 2 valid: Vehicle selected from dropdown");
        return true;
      }

      // If no vehicle selected, check if we're in manual mode
      // Check if any manual field is being filled (partial entry)
      const isManualMode =
        values.manualProductName || values.manualMake || values.manualModel;

      if (isManualMode) {
        // For manual entry, require all necessary fields
        return Boolean(
          values.vehicleType &&
          values.manualProductName &&
          values.manualMake &&
          values.manualModel &&
          values.manualYear &&
          values.manualColor &&
          values.productSerialNumber &&
          values.purchaseDate,
        );
      }

      // If neither dropdown selected nor manual mode started, it's invalid
      return false;
    }

    if (currentStep === 3) {
      return !!(
        values.issue_Details && values.issue_Details.trim().length >= 5
      );
    }

    if (currentStep === 4) return !!(values.location && values.priorityId);

    return false;
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      handleFinalSubmit();
    } else if (isStepValid()) {
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
    <div className="min-h-screen px-4 md:px-8 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-5xl mx-auto pl-6 md:px-0">
          <div className="flex flex-col items-start">
            <div className="flex items-center px-9 gap-4 mb-1">
              <button
                onClick={() =>
                  router.push("/dashboard/ticket-masterdata/allTickets")
                }
                className="text-[#4F39F6] hover:bg-blue-50 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>

              <h1
                style={{
                  background:
                    "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "30px",
                  fontWeight: 600,
                  lineHeight: "36px",
                }}
              >
                {isUpdating ? "Update Service Ticket" : "Create Service Ticket"}
              </h1>
            </div>

            <p className="ml-10 text-gray-400 font-bold mb-12 px-8 text-sm tracking-widest">
              Step {currentStep} of 4
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-20">
          <div className="flex items-center justify-between pr-12 relative">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10 flex-1"
              >
                <div
                  style={{ width: "52.8px", height: "52.8px" }}
                  className={`rounded-full flex justify-center items-center shrink-0 shadow-md transition-all duration-500 bg-linear-to-br ${
                    currentStep >= step.id
                      ? step.color
                      : "from-gray-200 to-gray-300"
                  } text-white`}
                >
                  {currentStep > step.id ? (
                    <Check size={24} strokeWidth={3} />
                  ) : (
                    <span
                      className={`font-semibold text-lg ${currentStep >= step.id ? "text-white" : "text-gray-400"}`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                <div className="absolute top-[62px] w-32 text-center">
                  <span
                    className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      top: "26.4px",
                      left: "50%",
                      width: "100%",
                      zIndex: -1,
                    }}
                  >
                    <div
                      className={`h-[3px] rounded-full transition-all duration-500 ${
                        currentStep > step.id
                          ? `bg-linear-to-r ${step.color}`
                          : "bg-gray-200"
                      }`}
                      style={{ width: "40%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden relative">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
              <Loader2 className="text-[#4F39F6] animate-spin" size={40} />
            </div>
          )}

          {currentStep === 1 && (
            <StepSourceCustomer form={form} customers={customers} />
          )}
          {currentStep === 2 && (
            <StepProduct
              form={form}
              vehicles={vehicles}
              customers={customers}
              brands={brands}
              models={models}
              colors={colors}
              isLoadingVehicles={isLoading}
              handleAddVehicle={handleAddVehicle}
            />
          )}
          {currentStep === 3 && (
            <StepIssueDetails form={form} isLoading={isLoading} />
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
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 px-2">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="flex items-center gap-2 px-6 py-3 font-bold text-[#1E293B]/60 hover:text-[#4F39F6]"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span className="text-sm">Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={!isStepValid() || isLoading}
            className={`flex items-center justify-center gap-3 px-10 py-3 font-bold text-white transition-all duration-300 rounded-[10px] ${
              isStepValid()
                ? "hover:opacity-90 hover:scale-[1.02] shadow-lg"
                : "grayscale opacity-50 cursor-not-allowed"
            } bg-linear-to-r ${steps[currentStep - 1].color}`}
          >
            <span className="text-sm">
              {currentStep === 4
                ? isUpdating
                  ? "Update Ticket"
                  : "Create Ticket"
                : "Next"}
            </span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        <SuccessPopup
          isOpen={showSuccessPopup}
          message={
            isUpdating
              ? "Ticket Updated Successfully!"
              : "Ticket Created Successfully!"
          }
          ticketData={{
            id: ticketResponse?.id,

            customer:
              ticketResponse?.customer?.companyName ||
              ticketResponse?.customer?.personId?.firstName ||
              customers?.find((c) => c._id === submittedFormData?.customerId)
                ?.personId?.firstName ||
              "Unknown Customer",

            product:
              ticketResponse?.product ||
              submittedFormData?.manualProductName ||
              vehicles?.find((v) => v._id === submittedFormData?.vehicleId)
                ?.productName ||
              "No Product Specified",

            serialNumber:
              ticketResponse?.serialNumber ||
              submittedFormData?.productSerialNumber ||
              vehicles?.find((v) => v._id === submittedFormData?.vehicleId)
                ?.serialNumber ||
              "No Serial Number",

            urgency:
              ticketResponse?.urgency ||
              priorities?.find((p) => p._id === submittedFormData?.priorityId)
                ?.serviceRequestPrioprity ||
              "No Priority Set",
          }}
          onClose={() => {
            setShowSuccessPopup(false);
            router.push("/dashboard/ticket-masterdata/allTickets");
          }}
          onSendForApproval={() => {
            console.log("Sending for approval...");
            router.push("/dashboard/ticket-masterdata/allTickets");
          }}
        />
      </div>
    </div>
  );
};

export default CreateTicket;
