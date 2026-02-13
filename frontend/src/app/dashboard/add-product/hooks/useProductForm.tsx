// hooks/useProductForm.ts - UPDATED VERSION

"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { CategoryNode, UseProductFormProps, Attribute, FourDropdownData } from "../types/product";
import {
  getCategoriesAtLevel,
  getSelectedCategoryPath,
} from "../utils/categoryHelpers";
import { fetchCategories } from "@/hooks/useCategory";
import { DropdownService } from "@/helper/dropdown.service";
import { fetchAttributes } from "@/hooks/useAttributes";
import { createProduct } from "@/helper/products";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

// ─── Shared variant types ────
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

export function useProductForm({
  initialData,
  onSubmit,
  categories,
}: UseProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});
  const [tags, setTags] = useState<string[]>([]);
  
  // ✅ Image state with preview and base64
  const [images, setImages] = useState<{
    file: File;
    preview: string;
    name: string;
    base64?: string; // ✅ Add base64 field
  }[]>([]);
  
  const [newTag, setNewTag] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState<CategoryNode[]>(categories);
  const [formData, setFormData] = useState(initialData);
  const router = useRouter();
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
        const selectedCategoryId = selectedPath.at(-1);

        const filteredAttributes = allAttributes.filter((attr) => {
          if (attr.categoryId === selectedCategoryId) return true;
          if (attr.isForSubcategories && selectedPath.includes(attr.categoryId)) {
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
      const result = getCategoriesAtLevel(fetchedCategories, selectedPath, level);
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

  const onBulkAddTags = (newTagsArray: string[]) => {
    setTags((prevTags) => {
      const combined = [...prevTags, ...newTagsArray];
      return Array.from(new Set(combined));
    });
  };

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  // ✅ UPDATED: Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ UPDATED: Handle image upload with Base64 conversion
  const handleImageUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);

      // Filter valid image files
      const validFiles = fileArray.filter((file) => file instanceof File);

      // Convert each file to Base64
      const formattedImagesPromises = validFiles.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          base64, // ✅ Store Base64 string
        };
      });

      const formattedImages = await Promise.all(formattedImagesPromises);

      setImages((prev) => [...prev, ...formattedImages]);
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      // Revoke object URL to prevent memory leaks
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  console.log("Images in hook:", images);

  // ✅ UPDATED: handleSubmit now sends Base64 images to database
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // ✅ Extract Base64 strings instead of file names
      const base64Images = images.map((img) => img.base64 || '');

      const keywordsArray = (formData.keywords as string)
        .split(",")
        .map((k) => k.trim())
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
        images: base64Images, // ✅ Send Base64 strings to backend
        categoryId: selectedPath.at(-1),
        categoryPath: selectedPath,

        // ── Variants → attributes (BACKEND NAME) ──
        attributes: variants.map((v) => ({
          sku: v.sku,
          attributes: v.attributes,

          pricing: v.marketplacePricing.map((p) => ({
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
            featured: v.featured,
          },

          warranty: {
            warrantyType: v.warranty,
            warrantyPeriod: v.warrantyPeriod,
          },
        })),
      };

      console.log("📤 Final data being sent to API:", finalData);
      console.log("📷 Images (Base64):", base64Images);

      try {
        const res = await createProduct(finalData as any);
        onSubmit(finalData);
        toast.success("Product created successfully!");
        router.push("/dashboard/inventory-dashboard/product");
      } catch (error) {
        console.error("❌ Error creating product:", error);
        toast.error("Failed to create product");
      }
    },
    [formData, selectedPath, tags, images, variants, onSubmit, router]
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
    variants,
    setVariants,
    setImages,
  };
}