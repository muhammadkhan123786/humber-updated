"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { CategoryNode, UseProductFormProps, Attribute, DropdownOption, FourDropdownData } from "../types/product";
import {
  getCategoriesAtLevel,
  getSelectedCategoryPath,
} from "../utils/categoryHelpers";
import { fetchCategories } from "@/hooks/useCategory";
import { DropdownService } from "@/helper/dropdown.service";
import { fetchAttributes } from "@/hooks/useAttributes";
import { createProduct } from "@/helper/products";
import {  toast } from 'sonner';
// ─── Shared variant types (import these in AttributesAndPricingStep too) ────
export interface MarketplacePricing {
  id: string;
  marketplaceId: string;
  marketplaceName: string;
  costPrice: number;
  sellingPrice: number;
  retailPrice: number;
  discountPercentage: number;
  taxId: string;
  taxRate: number;
  vatExempt: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, any>;
  marketplacePricing: MarketplacePricing[];
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  stockLocation: string;
  warehouseId: string;
  binLocation: string;
  productStatusId: string;
  conditionId: string;
  warehouseStatusId: string;
  featured: boolean;
  safetyStock?: number;
  leadTimeDays?: number;
  warranty: string;
  warrantyPeriod: string;
}
// ─────────────────────────────────────────────────────────────────────────────

export function useProductForm({
  initialData,
  onSubmit,
  categories,
}: UseProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [fetchedCategories, setFetchedCategories] =
    useState<CategoryNode[]>(categories);
  const [formData, setFormData] = useState(initialData);

  // ✅ Lifted up from AttributesAndPricingStep
  const [variants, setVariants] = useState<ProductVariant[]>([]);

const [dropdowns, setDropdowns] = useState<Partial<FourDropdownData>>({});
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const getWarrantyOptions = () => [
    { value: "manufacturer", label: "Manufacturer Warranty" },
    { value: "seller", label: "Seller Warranty" },
    { value: "no_warranty", label: "No Warranty" },
    { value: "extended", label: "Extended Warranty" },
    { value: "lifetime", label: "Lifetime Warranty" },
  ];

  useEffect(() => {
    const loadDropdowns = async () => {
      if (dropdownLoading) return;

      try {
        setDropdownLoading(true);

        if (currentStep === 3) {
          const data = await DropdownService.fetchOnlyTaxAndCurrency();

          setDropdowns((prev) => ({
            ...prev,
            taxes: data.taxes,
            currencies: data.currencies,
          }));
        }

        if (currentStep === 3) {
          const data = await DropdownService.fetchOnlyWarehouse();
          setDropdowns((prev) => ({
            ...prev,
            warehouses: data.warehouses,
            warehouseStatus: data.warehouseStatus,
            productStatus: data.productStatus,
            conditions: data.conditions,
          }));
        }
      } catch (error) {
        console.error("Dropdown loading failed", error);
      } finally {
        setDropdownLoading(false);
      }
    };

    loadDropdowns();
  }, [currentStep]);

  useEffect(() => {
    if (!selectedPath.length) {
      setAttributes([]);
      return;
    }

    
    const loadAttributes = async () => {
      try {
        const res = await fetchAttributes(1, 100, "", selectedPath.join(","));

        const allAttributes: Attribute[] = res.data || [];
        console.log("Fetched attributes:", allAttributes);
        const selectedCategoryId = selectedPath.at(-1);

        const filteredAttributes = allAttributes.filter((attr) => {
          if (attr.categoryId === selectedCategoryId) return true;

          if (
            attr.isForSubcategories &&
            selectedPath.includes(attr.categoryId)
          ) {
            return true;
          }

          return false;
        });

        setAttributes(filteredAttributes);
      } catch (err) {
        console.error("Attribute fetch failed", err);
        setAttributes([]);
      }
    };

    loadAttributes();
  }, [currentStep, selectedPath]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchCategories();
        setFetchedCategories(data.data as any || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleCategorySelect = useCallback((level: number, value: string) => {
    setSelectedPath((prev) => {
      const next = prev.slice(0, level);
      if (value) next[level] = value;
      return next;
    });
  }, []);

  const selectedCategories = useMemo(() => {
    return getSelectedCategoryPath(fetchedCategories || [], selectedPath);
  }, [fetchedCategories, selectedPath]);

  const getCategoriesAtLevelFromHook = useCallback(
    (level: number) => {
      if (!fetchedCategories || !Array.isArray(fetchedCategories)) {
        return [];
      }

      const result = getCategoriesAtLevel(
        fetchedCategories,
        selectedPath,
        level,
      );

      return result;
    },
    [fetchedCategories, selectedPath],
  );

  const getSelectedCategory = useCallback(
    (level?: number) => {
      if (selectedCategories.length === 0) return null;

      if (level !== undefined) {
        return selectedCategories[level] || null;
      }

      return selectedCategories[selectedCategories.length - 1];
    },
    [selectedCategories],
  );

  const getAllFields = useCallback(() => {
    const fields: any[] = [];
    return fields;
  }, [selectedCategories]);

  const nextStep = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentStep],
  );

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleDynamicFieldChange = useCallback(
    (fieldName: string, value: any) => {
      setDynamicFields((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    [],
  );

  const addTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  }, [newTag, tags]);

  // Add this function to your Parent Component
const onBulkAddTags = (newTagsArray: string[]) => {
  setTags((prevTags) => {
    // Combine old tags and new tags, and remove duplicates
    const combined = [...prevTags, ...newTagsArray];
    return Array.from(new Set(combined));
  });
};
  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ✅ handleSubmit now includes variants with your structured schema
 const handleSubmit = useCallback(
 async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keywordsArray = (formData.keywords as string)
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    const finalData = {
      // ── Product Info ─────────────────────────
      productName: formData.productName,
      sku: formData.sku,
      barcode: formData.barcode,
      brand: formData.brand,
      manufacturer: formData.manufacturer,
      modelNumber: formData.modelNumber,
      description: formData.description,
      shortDescription: formData.shortDescription,
      keywords: keywordsArray,
      tags,
      images,

      categoryId: selectedPath.at(-1),
      categoryPath: selectedPath,

      // ── Variants → attributes (BACKEND NAME) ──
      attributes: variants.map(v => ({
        sku: v.sku,
        attributes: v.attributes,

        pricing: v.marketplacePricing.map(p => ({
          marketplaceId: p.marketplaceId,
          marketplaceName: p.marketplaceName,
          costPrice: p.costPrice,
          sellingPrice: p.sellingPrice,
          retailPrice: p.retailPrice,
          discountPercentage: p.discountPercentage,
          taxId: p.taxId || null, 
          taxRate: p.taxRate,
          vatExempt: p.vatExempt,
        })),

        stock: {
          stockQuantity: v.stockQuantity,
          minStockLevel: v.minStockLevel,
          maxStockLevel: v.maxStockLevel,
          reorderPoint: v.reorderPoint,
          safetyStock: v.safetyStock,
          leadTimeDays: v.leadTimeDays,
          stockLocation: v.stockLocation,
          warehouseId: v.warehouseId,
          binLocation: v.binLocation,
          productStatusId: v.productStatusId,
          conditionId: v.conditionId,
          // warehouseStatusId: v.warehouseStatusId,
          featured: v.featured,
        },

        warranty: {
          warrantyType: v.warranty,
          warrantyPeriod: v.warrantyPeriod,
        },
      })),
    };

     const res = await createProduct(finalData as any);
    onSubmit(finalData);
    toast.success("Product created successfully!");
  },
  [formData, selectedPath, tags, images, variants, onSubmit],
);


  return {
    currentStep,
    formData,
    selectedPath,
    fetchedCategories: fetchedCategories || [],
    selectedCategories,
    getCategoriesAtLevel: getCategoriesAtLevelFromHook,
    handleCategorySelect,
    getAllFields,
    getSelectedCategory,
    dynamicFields,
    dropdowns,
    dropdownLoading,
    tags,
    images,
    newTag,
    onBulkAddTags,
    handleInputChange,
    handleDynamicFieldChange,
    addTag,
    removeTag,
    handleImageUpload,
    removeImage,
    handleSubmit,
    nextStep,
    prevStep,
    setNewTag,
    setDynamicFields,
    attributes,
    getWarrantyOptions,
    // ✅ Exposed for AttributesAndPricingStep
    variants,
    setVariants,
  };
}