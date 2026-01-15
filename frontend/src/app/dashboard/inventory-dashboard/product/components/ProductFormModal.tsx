"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LayoutGrid,
  Info,
  BadgeDollarSign,
  Truck,
  Share2,
  ChevronRight,
  ChevronLeft,
  Save,
  Package,
} from "lucide-react";

// Schema & Helpers
import { productSchema } from "./ProductSchema";
import { FormModal } from "@/app/common-form/FormModal";
import { DropdownService } from "@/helper/dropdown.service";
import { createItem, updateItem } from "@/helper/apiHelper";

// Sub-Components
import { StepIndicator } from "./StepIndicator";
import { PricingFields } from "./PricingFields";
import { ProductTypeStep } from "./ProductTypeStep";
import { BasicInfoStep } from "./BasicInfoStep";
import { VariantStep } from "./VariantStep";
import { LogisticsStep } from "./LogisticsStep";
import { DistributionStep } from "./DistributionStep";

const STEPS = [
  { id: 1, title: "Product Type", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 2, title: "Identity", icon: <Info className="w-4 h-4" /> }, // Includes Brand/Category
  { id: 3, title: "Pricing & Stock", icon: <BadgeDollarSign className="w-4 h-4" /> },
  { id: 4, title: "Logistics", icon: <Truck className="w-4 h-4" /> }, // Includes Taxes/Weight
  { id: 5, title: "Distribution", icon: <Share2 className="w-4 h-4" /> },
];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingProduct,
}: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownData, setDropdownData] = useState<any>({
    categories: [],
    vendors: [],
    colors: [],
    sizes: [],
    taxes: [],
    currencies: [],
    fetchWherehouesStatus: [],
    fetchWherehoues: [],
    status: [],
    units: []
  });

  const methods = useForm({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      productType: "simple",
      hasVariants: false,
      costPrice: 0,
      basePrice: 0,
      salePrice: 0,
      stock: 0,
      variants: [],
      status: "active",
    },
  });

  const { handleSubmit, watch, setValue, trigger, reset, formState: { errors, isDirty }, } = methods;
  const watchProductType = watch("productType");

  // Load Dropdowns and Edit Data
  useEffect(() => {
    const loadData = async () => {
      const data = await DropdownService.fetchAll();
      setDropdownData(data);
      if (editingProduct) {
        reset(editingProduct);
      }
    };
    if (isOpen) loadData();
  }, [isOpen, editingProduct, reset]);

  // Handle Form Submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingProduct?._id) {
        await updateItem("/product-base", editingProduct._id, data);
      } else {
        await createItem("/product-base", data);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const fieldsByStep: any = {
      1: ["productType"],
      2: ["productName", "SKU", "categoryId"],
      3:
        watchProductType === "simple"
          ? ["salePrice", "costPrice", "stock"]
          : ["variants"],
      4: ["taxId"],
    };

    const isStepValid = await trigger(fieldsByStep[currentStep]);
    if (isStepValid) setCurrentStep((prev) => prev + 1);
  };

  console.log("orderStatus", dropdownData.size)
  console.log("errors", errors)

  if (!isOpen) return null;

  return (
    <FormModal
      title={editingProduct ? "Edit Product" : "Create New Product"}
      onClose={onClose}
      width="max-w-7xl"
      themeColor="#F97316"
      icon={<Package className="w-5 h-5" />}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-[85vh]"
        >
          {/* 1. Step Indicator */}
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          {/* 2. Dynamic Step Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">
            {currentStep === 1 && <ProductTypeStep />}
            {currentStep === 2 && <BasicInfoStep dropdownData={dropdownData} />}
            {currentStep === 3 && (
              <div className="max-w-5xl mx-auto space-y-6">
                {watchProductType === "simple" ? (
                  <PricingFields />
                ) : (
                  <VariantStep dropdownData={dropdownData} />
                )}
              </div>
            )}
            {currentStep === 4 && <LogisticsStep dropdownData={dropdownData} />}
            {currentStep === 5 && (
              <DistributionStep dropdownData={dropdownData} />
            )}
          </div>

          {/* 3. Footer Navigation */}
          <div className="p-4 border-t flex justify-between bg-white items-center px-8">
            <button
              type="button"
              onClick={() =>
                currentStep === 1 ? onClose() : setCurrentStep((s) => s - 1)
              }
              className="flex items-center gap-2 px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition"
            >
              <ChevronLeft size={18} />{" "}
              {currentStep === 1 ? "Cancel" : "Previous"}
            </button>

            <div className="flex gap-3">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-200 font-bold"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-10 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 font-bold disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Complete & Save"}{" "}
                  <Save size={18} />
                </button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}
