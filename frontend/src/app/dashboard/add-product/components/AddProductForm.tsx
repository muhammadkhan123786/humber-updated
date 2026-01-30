// "use client";
// import { AnimatePresence } from "framer-motion";
// import { useState } from "react";


// // Data - Update STEPS to only 3
// import { STEPS } from "../data/productData";

// // Hooks
// import { useProductForm } from "../hooks/useProductForm";

// // Components
// import { AnimatedBackground } from "./AnimatedBackground";
// import { FormHeader } from "./FormHeader";
// import { StepIndicator } from "./StepIndicator";
// import { StepCard } from "./StepCard";
// import { NavigationButtons } from "./NavigationButtons";
// import { CategoryStep } from "./steps/CategoryStep";
// import { BasicInfoStep } from "./steps/BasicInfoStep";
// import { AttributesAndPricingStep } from "./steps/AttributesAndPricingStep";
// import { createProduct } from "@/helper/products";


// const MARKETPLACE_OPTIONS = [
//   { value: 'amazon', label: 'Amazon', icon: '🏪' },
//   { value: 'ebay', label: 'eBay', icon: '🛒' },
//   { value: 'shopify', label: 'Shopify', icon: '🏬' },
//   { value: 'etsy', label: 'Etsy', icon: '🎨' },
//   { value: 'walmart', label: 'Walmart', icon: '🏪' },
//   { value: 'own-website', label: 'Own Website', icon: '🌐' },
// ];
// interface MarketplacePricing {
//   id: string;
//   marketplaceId: string;
//   marketplaceName: string;
//   costPrice: string;
//   sellingPrice: string;
//   retailPrice: string;
//   discountPercentage: string;
//   taxId: string;
//   taxRate: string;
//   vatExempt: boolean;
// }

  
// export default function AddProductForm() {

//    const [currentMarketplacePricing, setCurrentMarketplacePricing] = useState<Partial<MarketplacePricing>>({
//     marketplaceId: '',
//     marketplaceName: '',
//     costPrice: '',
//     sellingPrice: '',
//     retailPrice: '',
//     discountPercentage: '',
//     taxId: '',
//     taxRate: '',
//     vatExempt: false,
//   });
//   const {
//     currentStep,
//     formData,
//     selectedPath,
//     fetchedCategories,
//     selectedCategories,
//     getCategoriesAtLevel,
//     handleCategorySelect,
//     dynamicFields,
//     tags,
//     images,
//     newTag,
//     dropdowns,
//     getSelectedCategory,
//     getAllFields,
//     handleInputChange,
//     handleDynamicFieldChange,
//     handleSubmit,
//     addTag,
//     removeTag,
//     handleImageUpload,
//     removeImage,
//     nextStep,
//     prevStep,
//     setNewTag,
//     attributes,  
//     variants,
//     setVariants, 
//     getWarrantyOptions,
//   } = useProductForm({
//     initialData: {
//       productName: "",
//       sku: "",
//       barcode: "",
//       brand: "",
//       manufacturer: "",
//       modelNumber: "",
//       description: "",
//       shortDescription: "",
//       keywords: "",
//       images: [],
//       currentMarketplacePricing:{
//         currentMarketplacePricing,
//       }
      
//     },
//     onSubmit: async(data) => {
//       try {
//         // const res = await createProduct(data);
//         console.log("Product created successfully:", data);
//       } catch (error) {
//         console.error("Error submitting product data:", error);
//       }
//       console.log("Product data submitted:", data);
//     },
//     categories: [],
//   });

//   const renderStepContent = () => {
//     const currentStepData = STEPS[currentStep - 1];

//     switch (currentStep) {
//       case 1:
//         return (
//           <StepCard
//             title={currentStepData.title}
//             subtitle="Select category hierarchy using dropdowns"
//             icon={currentStepData.icon}
//             gradient={currentStepData.gradient}
//             bgGradient={currentStepData.bgGradient}
//             borderGradient={currentStepData.borderGradient}
//           >
//             <CategoryStep
//               selectedPath={selectedPath || []}
//               categories={fetchedCategories || []}
//               selectedCategories={selectedCategories || []}
//               getCategoriesAtLevel={getCategoriesAtLevel}
//               handleCategorySelect={handleCategorySelect}
//             />
//           </StepCard>
//         );

//       case 2:
//         return (
         
//            <BasicInfoStep
//               formData={formData}
//               tags={tags}
//               images={images}
//               newTag={newTag}
//               onInputChange={handleInputChange}
//               onAddTag={addTag}
//               onRemoveTag={removeTag}
//               onNewTagChange={setNewTag}
//               onImageUpload={handleImageUpload}
//               onRemoveImage={removeImage}

           
//             />
         
//         );

//       case 3:
//         return (
         
//             <AttributesAndPricingStep
//               formData={formData}
//               attributes={attributes}
//               dynamicFields={dynamicFields}
//               selectedLevel1={selectedPath[0] || ""}
//               selectedLevel2={selectedPath[1] || ""}
//               selectedLevel3={selectedPath[2] || ""}
//               getSelectedCategory={getSelectedCategory}
//               getAllFields={getAllFields}
//               onInputChange={handleInputChange}
//               onDynamicFieldChange={handleDynamicFieldChange}            
//               currencies={dropdowns.currencies}
//               taxes={dropdowns.taxes}
//               warehouses={dropdowns.warehouses}
//               warehouseStatus={dropdowns.warehouseStatus}
//               productStatus={dropdowns.productStatus}
//               conditions={dropdowns.conditions}
//               warrantyOptions={getWarrantyOptions()}
//               marketplaces={MARKETPLACE_OPTIONS}
//               variants={variants}
//               setVariants={setVariants}
//               setCurrentMarketplacePricing={setCurrentMarketplacePricing}
//               currentMarketplacePricing={currentMarketplacePricing}
//             />
         
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6 relative pb-20">
//       <AnimatedBackground />

//       <FormHeader
//         currentStep={currentStep}
//         totalSteps={STEPS.length}
//         stepTitle={STEPS[currentStep - 1].title}
//       />

//       <StepIndicator steps={STEPS} currentStep={currentStep} />

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

//         <NavigationButtons
//           currentStep={currentStep}
//           totalSteps={STEPS.length}
//           onPrev={prevStep}
//           onNext={nextStep}
//           isLastStep={currentStep === STEPS.length}
//         />
//       </form>
//     </div>
//   );
// }


"use client";
import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

// Data
import { STEPS } from "../data/productData";

// Hooks
import { useProductForm } from "../hooks/useProductForm";

// Components
import { AnimatedBackground } from "./AnimatedBackground";
import { FormHeader } from "./FormHeader";
import { StepIndicator } from "./StepIndicator";
import { StepCard } from "./StepCard";
import { NavigationButtons } from "./NavigationButtons";
import { CategoryStep } from "./steps/CategoryStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { AttributesAndPricingStep } from "./steps/AttributesAndPricingStep";

// Types


const MARKETPLACE_OPTIONS = [
  { value: 'amazon', label: 'Amazon', icon: '🏪' },
  { value: 'ebay', label: 'eBay', icon: '🛒' },
  { value: 'shopify', label: 'Shopify', icon: '🏬' },
  { value: 'etsy', label: 'Etsy', icon: '🎨' },
  { value: 'walmart', label: 'Walmart', icon: '🏪' },
  { value: 'own-website', label: 'Own Website', icon: '🌐' },
];

export default function AddProductForm() {
 
  const {
    currentStep,
    formData,
    selectedPath,
    fetchedCategories,
    selectedCategories,
    getCategoriesAtLevel,
    handleCategorySelect,
    dynamicFields,
    tags,
    images,
    newTag,
    dropdowns,
    getSelectedCategory,
    getAllFields,
    handleInputChange,
    handleDynamicFieldChange,
    handleSubmit,
    addTag,
    removeTag,
    handleImageUpload,
    removeImage,
    nextStep,
    prevStep,
    setNewTag,
    attributes,
    variants,
    generatedCombinations,
    addVariant,
    bulkGenerateVariants,
    updateVariantPricing,
    updateVariantStock,
    getVariantByAttributes,
    getTotalStock,
    setVariants,
    getWarrantyOptions,
  } = useProductForm({
    initialData: {
      productName: "",
      sku: "",
      barcode: "",
      brand: "",
      manufacturer: "",
      modelNumber: "",
      description: "",
      shortDescription: "",
      keywords: "",
      images: [],
      basePrice: 0,
      baseCost: 0,
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      }
    },
    onSubmit: async(data) => {
      try {
        // Transform data for API
        const apiData = transformDataForAPI(data);
        console.log("API Payload:", apiData);
        
        // const res = await createProduct(apiData);
        console.log("Product created successfully:", data);
      } catch (error) {
        console.error("Error submitting product data:", error);
      }
    },
    categories: [],
  });

  // Transform data to match your database schema
  const transformDataForAPI = (data: any) => {
    return {
      // Product Info
      productInfo: {
        name: data.productName,
        sku: data.sku,
        barcode: data.barcode,
        brand: data.brand,
        manufacturer: data.manufacturer,
        modelNumber: data.modelNumber,
        description: data.description,
        shortDescription: data.shortDescription,
        keywords: data.keywords,
        images: data.images,
        weight: data.weight,
        dimensions: data.dimensions,
        categoryId: data.finalCategoryId,
        categoryPath: data.categoryPath,
        tags: data.tags,
        dynamicFields: data.dynamicFields
      },
     
    };
  };

 

  const renderStepContent = () => {
    const currentStepData = STEPS[currentStep - 1];

    switch (currentStep) {
      case 1:
        return (
          <StepCard
            title={currentStepData.title}
            subtitle="Select category hierarchy using dropdowns"
            icon={currentStepData.icon}
            gradient={currentStepData.gradient}
            bgGradient={currentStepData.bgGradient}
            borderGradient={currentStepData.borderGradient}
          >
            <CategoryStep
              selectedPath={selectedPath || []}
              categories={fetchedCategories || []}
              selectedCategories={selectedCategories || []}
              getCategoriesAtLevel={getCategoriesAtLevel}
              handleCategorySelect={handleCategorySelect}
            />
          </StepCard>
        );

      case 2:
        return (
          <StepCard
            title={currentStepData.title}
            subtitle="Enter basic product information"
            icon={currentStepData.icon}
            gradient={currentStepData.gradient}
            bgGradient={currentStepData.bgGradient}
            borderGradient={currentStepData.borderGradient}
          >
            <BasicInfoStep
              formData={formData}
              tags={tags}
              images={images}
              newTag={newTag}
              onInputChange={handleInputChange}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              onNewTagChange={setNewTag}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
            />
          </StepCard>
        );

      case 3:
        return (
         
            <AttributesAndPricingStep
              formData={formData}
              attributes={attributes}
              dynamicFields={dynamicFields}
              selectedLevel1={selectedPath[0] || ""}
              selectedLevel2={selectedPath[1] || ""}
              selectedLevel3={selectedPath[2] || ""}
              getSelectedCategory={getSelectedCategory}
              getAllFields={getAllFields}
              onInputChange={handleInputChange}
              onDynamicFieldChange={handleDynamicFieldChange}
              currencies={dropdowns.currencies || []}
              taxes={dropdowns.taxes || []}
              warehouses={dropdowns.warehouses || []}
              warehouseStatus={dropdowns.warehouseStatus || []}
              productStatus={dropdowns.productStatus || []}
              conditions={dropdowns.conditions || []}
              warrantyOptions={getWarrantyOptions()}
              marketplaces={MARKETPLACE_OPTIONS}        
              />
          
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
      <AnimatedBackground />
      <FormHeader
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepTitle={STEPS[currentStep - 1].title}
      />

      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrev={prevStep}
          onNext={nextStep} // Use enhanced handler
          isLastStep={currentStep === STEPS.length}        
          nextLabel={currentStep === STEPS.length ? "Create Product" : "Next Step"}
        />
        
      
      </form>
    </div>
  );
}