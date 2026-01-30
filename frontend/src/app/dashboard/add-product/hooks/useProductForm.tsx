"use client";
import { useState, useCallback, useEffect, useMemo } from "react"; // Added useMemo
import { toast } from "sonner";
import { CategoryNode, UseProductFormProps, Attribute, DropdownOption, FourDropdownData } from "../types/product";
import {
  getCategoriesAtLevel,
  getSelectedCategoryPath,
} from "../utils/categoryHelpers";
import { fetchCategories } from "@/hooks/useCategory";
import { DropdownService } from "@/helper/dropdown.service";
import { fetchAttributes } from "@/hooks/useAttributes";
import { useVariants } from './useVariants';



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
  // const [variants, setVariants] = useState<any[]>([]);

  const [dropdowns, setDropdowns] = useState<FourDropdownData>({});
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const getWarrantyOptions = () => [
    { value: "manufacturer", label: "Manufacturer Warranty" },
    { value: "seller", label: "Seller Warranty" },
    { value: "no_warranty", label: "No Warranty" },
    { value: "extended", label: "Extended Warranty" },
    { value: "lifetime", label: "Lifetime Warranty" },
  ];

  const {
    variants,
    generatedCombinations,
    addVariant,
    bulkGenerateVariants,
    updateVariantPricing,
    updateVariantStock,
    getVariantByAttributes,
    getTotalStock,
    setVariants
  } = useVariants();

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

        // 🔥 FINAL RULE
        const filteredAttributes = allAttributes.filter((attr) => {
          // 1️⃣ Attributes directly for selected category
          if (attr.categoryId === selectedCategoryId) return true;

          // 2️⃣ Parent attributes allowed ONLY if isForSubcategories = true
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
        console.log("Fetched categories:", data);
        setFetchedCategories(data.data || []); // Added fallback
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesData();
  }, []);

  /*  Handle category select (N-level safe) */
  const handleCategorySelect = useCallback((level: number, value: string) => {
    setSelectedPath((prev) => {
      const next = prev.slice(0, level);
      if (value) next[level] = value;
      return next;
    });
  }, []);

  /*  Selected category path - using useMemo to memoize */
  const selectedCategories = useMemo(() => {
    return getSelectedCategoryPath(fetchedCategories || [], selectedPath);
  }, [fetchedCategories, selectedPath]);

  /*  Get categories at specific level */
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

  /* ✅ Get selected category node */
  const getSelectedCategory = useCallback(
    (level?: number) => {
      if (selectedCategories.length === 0) return null;

      if (level !== undefined) {
        // Return category at specific level (for old usage)
        return selectedCategories[level] || null;
      }

      // Return the last selected category (for new usage)
      return selectedCategories[selectedCategories.length - 1];
    },
    [selectedCategories],
  );

  /* ✅ Dynamic fields from all selected levels */
  const getAllFields = useCallback(() => {
    const fields: any[] = [];
    // selectedCategories.forEach(cat => {
    //   if (cat.fields) fields.push(...cat.fields);
    // });
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

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    // Convert files to base64 or URLs (simulating upload)
    const newImages = fileArray.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // const handleSubmit = useCallback(
  //   (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     const keywordsArray = (formData.keywords as string)
  //       .split(",")
  //       .map((keyword: string) => keyword.trim())
  //       .filter((keyword: string) => keyword.length > 0);

  //     // Combine all data
  //     const finalData = {
  //       ...formData,
  //       dynamicFields,
  //       categoryPath: selectedPath,
  //       finalCategoryId: selectedPath.at(-1),
  //       tags,
  //       images,
  //       keywords: keywordsArray,
  //       variants: variants.map(v => ({
  //       sku: v.sku, // Link identifier
  //       attributes: v.attributes, // DYNAMIC ATTRIBUTES MODAL
        
  //       pricing: v.marketplacePricing.map((p: any) => ({ // PRICING MODAL
  //         marketplaceId: p.marketplaceId,
  //         price: p.sellingPrice,
  //         taxId: p.taxId,
  //         currency: p.currency
  //       })),
  //       inventory: { // STOCK MODAL
  //         quantity: v.stockQuantity,
  //         warehouseId: v.warehouseId,
  //         statusId: v.productStatusId,
  //         conditionId: v.conditionId
  //       }
  //     }))

  //     };

  //     console.log("Product data submitted:", finalData); // This will show all data in console
  //     onSubmit(finalData);

  //     toast.success("Product created successfully!");
  //   },
  //   [formData, dynamicFields, selectedPath, tags, images, onSubmit],
  // );

 
  // Enhanced handleSubmit for variants
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const keywordsArray = (formData.keywords as string)
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0);

      // Transform variants to match your modeling structure
      const transformedVariants = variants.map(variant => ({
        // Attributes modal data
        attributes: variant.attributes,
        sku: variant.sku,
        
        // Pricing modal data (linked to attributes)
        pricing: variant.pricing.map(p => ({
          marketplaceId: p.marketplaceId,
          price: p.price,
          taxId: p.taxId,
          currency: p.currency,
          compareAtPrice: p.compareAtPrice,
          isActive: p.isActive
        })),
        
        // Stock modal data (linked to attributes)
        stock: variant.stock.map(s => ({
          warehouseId: s.warehouseId,
          quantity: s.quantity,
          statusId: s.statusId,
          conditionId: s.conditionId,
          location: s.location,
          reorderPoint: s.reorderPoint
        })),
        
        // Additional variant info
        isActive: variant.isActive,
        images: variant.images,
        barcode: variant.barcode,
        weight: variant.weight,
        dimensions: variant.dimensions
      }));

      // Combine all data
      const finalData = {
        // Product Info
        ...formData,
        dynamicFields,
        categoryPath: selectedPath,
        finalCategoryId: selectedPath.at(-1),
        tags,
        images,
        keywords: keywordsArray,
        
        // Variants structure
        variants: transformedVariants,
        
        // Summary stats
        variantCount: variants.length,
        totalStock: variants.reduce((total, v) => 
          total + v.stock.reduce((sum, s) => sum + s.quantity, 0), 0
        ),
        activeVariants: variants.filter(v => v.isActive).length,
        
        // Pricing summary
        pricingSummary: variants.reduce((acc, variant) => {
          variant.pricing.forEach(p => {
            if (!acc[p.marketplaceId]) {
              acc[p.marketplaceId] = {
                minPrice: p.price,
                maxPrice: p.price,
                averagePrice: p.price
              };
            } else {
              acc[p.marketplaceId].minPrice = Math.min(acc[p.marketplaceId].minPrice, p.price);
              acc[p.marketplaceId].maxPrice = Math.max(acc[p.marketplaceId].maxPrice, p.price);
            }
          });
          return acc;
        }, {} as Record<string, any>)
      };

      console.log("Product data with variants:", finalData);
      onSubmit(finalData);
      toast.success("Product created successfully!");
    },
    [formData, dynamicFields, selectedPath, tags, images, variants, onSubmit]
  );
 
  return {
    currentStep,
    formData,
    selectedPath,
    fetchedCategories: fetchedCategories || [], // Ensure it's always an array
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
    generatedCombinations,
    addVariant,
    bulkGenerateVariants,
    updateVariantPricing,
    updateVariantStock,
    getVariantByAttributes,
    getTotalStock,
    setVariants
  };
}
