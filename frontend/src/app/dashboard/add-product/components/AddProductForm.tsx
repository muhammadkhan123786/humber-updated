'use client'
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Data
import { STEPS } from '../data/productData';

// Hooks
import { useProductForm } from '@/hooks/useProductForm';

// Components
import { AnimatedBackground } from './AnimatedBackground';
import { FormHeader } from './FormHeader';
import { StepIndicator } from './StepIndicator';
import { StepCard } from './StepCard';
import { NavigationButtons } from './NavigationButtons';
import { CategoryStep } from './steps/CategoryStep';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PricingStep } from './steps/PricingStep';
import { InventoryStep } from './steps/InventoryStep';
import { SpecificationsStep } from './steps/SpecificationsStep';


// Import category tree
import { categoryTree } from '../data/categoryTree';

export default function AddProductForm() {
  const {
    currentStep,
    formData,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    dynamicFields,
    tags,
    images,
    newTag,
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
    setSelectedLevel1,
    setSelectedLevel2,
    setSelectedLevel3,
    setNewTag
  } = useProductForm({
    initialData: {
      productName: '',
      sku: '',
      barcode: '',
      brand: '',
      manufacturer: '',
      modelNumber: '',
      description: '',
      shortDescription: '',
      costPrice: '',
      sellingPrice: '',
      retailPrice: '',
      discountPercentage: '',
      taxRate: '20',
      vatExempt: false,
      stockQuantity: '',
      minStockLevel: '',
      maxStockLevel: '',
      reorderPoint: '',
      stockLocation: '',
      warehouse: '',
      binLocation: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      color: '',
      material: '',
      warranty: '',
      warrantyPeriod: '',
      condition: 'new',
      status: 'active',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    },
    onSubmit: (data) => {
      console.log('Product data submitted:', data);
      toast.success('Product created successfully!');
    }
    
  });
  const filteredLevel2 =
  categoryTree.find(c => c.id === selectedLevel1)?.children ?? [];

const filteredLevel3 =
  filteredLevel2.find(c => c.id === selectedLevel2)?.children ?? [];


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
  selectedLevel1={selectedLevel1}
  selectedLevel2={selectedLevel2}
  selectedLevel3={selectedLevel3}
  categoriesLevel1={categoryTree}
  filteredLevel2={filteredLevel2}
  filteredLevel3={filteredLevel3}
  getSelectedCategory={getSelectedCategory}
  onLevel1Change={setSelectedLevel1}
  onLevel2Change={setSelectedLevel2}
  onLevel3Change={setSelectedLevel3}
/>


          </StepCard>
        );

      case 2:
        return (
          <StepCard
            title={currentStepData.title}
            subtitle="Product name, SKU, descriptions, and images"
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
          <StepCard
            title={currentStepData.title}
            subtitle="Cost, selling price, discounts, and tax settings"
            icon={currentStepData.icon}
            gradient={currentStepData.gradient}
            bgGradient={currentStepData.bgGradient}
            borderGradient={currentStepData.borderGradient}
          >
            <PricingStep
              formData={formData}
              onInputChange={handleInputChange}
            />
          </StepCard>
        );

      case 4:
        return (
          <StepCard
            title={currentStepData.title}
            subtitle="Stock levels, locations, and reorder points"
            icon={currentStepData.icon}
            gradient={currentStepData.gradient}
            bgGradient={currentStepData.bgGradient}
            borderGradient={currentStepData.borderGradient}
          >
            <InventoryStep
              formData={formData}
              onInputChange={handleInputChange}
            />
          </StepCard>
        );

      case 5:
        return (
          <StepCard
            title={currentStepData.title}
            subtitle={selectedLevel1 || selectedLevel2 || selectedLevel3
              ? 'Category-specific attributes and specifications'
              : 'Category-specific and common product specifications'}
            icon={currentStepData.icon}
            gradient={currentStepData.gradient}
            bgGradient={currentStepData.bgGradient}
            borderGradient={currentStepData.borderGradient}
          >
            <SpecificationsStep
              selectedLevel1={selectedLevel1}
              selectedLevel2={selectedLevel2}
              selectedLevel3={selectedLevel3}
              dynamicFields={dynamicFields}
              formData={formData}
              getAllFields={getAllFields}
              getSelectedCategory={getSelectedCategory}
              onDynamicFieldChange={handleDynamicFieldChange}
              onInputChange={handleInputChange}
            />
          </StepCard>
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
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}