"use client";
import { useState, useCallback, useEffect, useMemo } from "react"; // Added useMemo
import { toast } from "sonner";
import { CategoryNode } from "../types/product";
import {
  getCategoriesAtLevel,
  getSelectedCategoryPath,
} from "../utils/categoryHelpers";
import { fetchCategories } from "@/hooks/useCategory";
import { DropdownService } from "@/helper/dropdown.service";
import { fetchAttributes } from "@/hooks/useAttributes"; 

interface UseProductFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
  categories: CategoryNode[]; // 👈 backend tree
}

interface DropdownOption {
  value: string;
  label: string;
}

interface FourDropdownData {
  taxes: DropdownOption[];
  currencies: DropdownOption[];
  warehouses: DropdownOption[];
  warehouseStatus: DropdownOption[];
  productStatus: DropdownOption[];
  conditions: DropdownOption[];
}

interface Attribute {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "checkbox" | "radio";
  options?: DropdownOption[];
  required?: boolean;
  parentCategoryId: string;
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
  const [images, setImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [fetchedCategories, setFetchedCategories] =
    useState<CategoryNode[]>(categories);
  const [formData, setFormData] = useState(initialData);
  const [basicDropdowns, setBasicDropdowns] = useState<FourDropdownData | null>(
    null,
  );
  const [dropdowns, setDropdowns] = useState<FourDropdownData>({});
  const [dropdownLoading, setDropdownLoading] = useState(false);
   const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    const loadDropdowns = async () => {
      if (dropdownLoading) return;

      try {
        setDropdownLoading(true);

        if (currentStep === 3) {
          const data = await DropdownService.fetchOnlyTaxAndCurrency();
          console.log("Fetched tax and currency:", data);
          setDropdowns((prev) => ({
            ...prev,
            taxes: data.taxes,
            currencies: data.currencies,
          }));
        }

        if (currentStep === 4) {
          const data = await DropdownService.fetchOnlyWarehouse();
          console.log("Fetched warehouse and status:", data);
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
    if (currentStep !== 1) return; // attributes step
    if (!selectedPath.length) return;

    const categoryIds = selectedPath; // 👈 inheritance

    const loadAttributes = async () => {
      try {
        console.log("Fetching attributes for categories", categoryIds);
        const data = await fetchAttributes(1, 100, "", categoryIds);
        console.log("Fetched attributes for categories", categoryIds, data);
        setAttributes(data.data);
      } catch (err) {
        console.error("Attribute fetch failed", err);
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

  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

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

  console.log("dynamicFields", dynamicFields);
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

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const keywordsArray = (formData.keywords as string)
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0);

      // Combine all data
      const finalData = {
        ...formData,
        dynamicFields,
        categoryPath: selectedPath,
        finalCategoryId: selectedPath.at(-1),
        tags,
        images,
        keywords: keywordsArray,
      };

      console.log("Product data submitted:", finalData); // This will show all data in console
      onSubmit(finalData);

      toast.success("Product created successfully!");
    },
    [formData, dynamicFields, selectedPath, tags, images, onSubmit],
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
  };
}
