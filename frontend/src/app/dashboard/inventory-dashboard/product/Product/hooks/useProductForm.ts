import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DropdownService } from "@/helper/dropdown.service";

export const useProductForm = (
  product: any,
  onSave: (data: any) => Promise<void>,
  onOpenChange: (open: boolean) => void
) => {
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [productStatuses, setProductStatuses] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [warehouseStatuses, setWarehouseStatuses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<any[]>([]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers?limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setSuppliers(data.data || []);
    } catch (e) {
      setSuppliers([]);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories?limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setCategories(data.data || data.categories || data || []);
    } catch (e) {
      setCategories([]);
    }
  }, []);

  const fetchAttributeOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/attributes?limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAttributeOptions(data.data || data.attributes || data || []);
    } catch (e) {
      setAttributeOptions([]);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSuppliers(),
          fetchCategories(),
          fetchAttributeOptions(),
        ]);
        const warehouseData = await DropdownService.fetchOnlyWarehouse();
        setWarehouses(warehouseData.warehouses || []);
        setWarehouseStatuses(warehouseData.warehouseStatus || []);
        setProductStatuses(warehouseData.productStatus || []);
        setConditions(warehouseData.conditions || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      } finally {
        setLoading(false);
      }
    };
    if (product) load();
  }, [product, fetchSuppliers, fetchCategories, fetchAttributeOptions]);

  // STEP 1: Flatten MongoDB nested structure into formData
  useEffect(() => {
    if (!product) return;
    const pricing = product.attributes?.[0]?.pricing?.[0] || {};
    const stock = product.attributes?.[0]?.stock || {};
    const warranty = product.attributes?.[0]?.warranty || {};
    const categoryId =
      product.categoryId ||
      product.primaryCategory?.id ||
      product.categories?.[product.categories.length - 1]?.id ||
      "";
    setFormData({
      id: product._id || product.id,
      isActive: product.isActive ?? true,
      productName: product.productName || product.name || "",
      sku: product.sku || "",
      barcode: product.barcode || "",
      brand: product.brand || "",
      manufacturer: product.manufacturer || "",
      modelNumber: product.modelNumber || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      keywords: product.keywords || [],
      tags: product.tags || [],
      images: product.images || [],
      categoryId,
      categoryPath: product.categoryPath || [],
      featured: product.featured ?? product.attributes?.[0]?.featured ?? false,
      // Pricing
      costPrice: pricing.costPrice ?? 0,
      price: pricing.sellingPrice ?? 0,
      retailPrice: pricing.retailPrice ?? 0,
      discountPercentage: pricing.discountPercentage ?? 0,
      taxRate: pricing.taxRate ?? 0,
      vatExempt: pricing.vatExempt ?? false,
      taxId: pricing.taxId || "",
      marketplaceId: pricing.marketplaceId || "",
      marketplaceName: pricing.marketplaceName || "woocommerce",
      pricingId: pricing._id || "",
      // Stock
      stockQuantity: stock.stockQuantity ?? 0,
      minStockLevel: stock.minStockLevel ?? 0,
      maxStockLevel: stock.maxStockLevel ?? 0,
      reorderLevel: stock.reorderPoint ?? 0,
      safetyStock: stock.safetyStock ?? 0,
      leadTimeDays: stock.leadTimeDays ?? 0,
      stockLocation: stock.stockLocation || "",
      binLocation: stock.binLocation || "",
      warehouseId: stock.warehouseId || "",
      productStatusId: stock.productStatusId || "",
      conditionId: stock.conditionId || "",
      supplierId: stock.supplierId || product.supplierId || "",
      stockStatus: stock.stockStatus || "in-stock",
      // Warranty
      warrantyType: warranty.warrantyType || "",
      warrantyPeriod: warranty.warrantyPeriod || "",
      attributes: product.attributes || [],
      supplierName: "",
    });
  }, [product]);

  // STEP 2: Only update supplierName when suppliers load
  useEffect(() => {
    if (!suppliers.length || !formData?.supplierId) return;
    const supplier = suppliers.find((s) => s._id === formData.supplierId);
    if (!supplier) return;
    const supplierName =
      supplier?.contactInformation?.primaryContactName ||
      supplier?.supplierIdentification?.legalBusinessName ||
      supplier?.legalBusinessName || "";
    setFormData((prev: any) => (prev ? { ...prev, supplierName } : prev));
  }, [suppliers]);

  const updateField = useCallback((path: string, value: any) => {
    setFormData((prev: any) => {
      if (!prev) return prev;
      const newState = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes("[")) {
          const [arrayName, indexStr] = key.split("[");
          const index = parseInt(indexStr.replace("]", ""));
          if (!current[arrayName]) current[arrayName] = [];
          if (!current[arrayName][index]) current[arrayName][index] = {};
          current = current[arrayName][index];
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      }
      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;
      return newState;
    });
  }, []);

  const handleSupplierChange = useCallback(
    (supplierId: string) => {
      const selectedSupplier = suppliers.find((s) => s._id === supplierId);
      const supplierName =
        selectedSupplier?.contactInformation?.primaryContactName ||
        selectedSupplier?.supplierIdentification?.legalBusinessName || "";
      updateField("supplierId", supplierId);
      updateField("supplierName", supplierName);
      toast.success("Supplier selected");
    },
    [suppliers, updateField]
  );

  const handleSave = async () => {
    if (!formData) return;
    if (!formData.productName) {
      toast.error("Product name required");
      return;
    }
    try {
      setIsSaving(true);
      const cleanCategoryPath = (formData.categoryPath || [])
        .map((c: any) => (typeof c === "string" ? c : c?.id || c?._id || ""))
        .filter(Boolean);
      let cleanCategoryId = "";
      if (typeof formData.categoryId === "string") cleanCategoryId = formData.categoryId;
      else if (formData.categoryId?.id) cleanCategoryId = formData.categoryId.id;
      else if (formData.categoryId?._id) cleanCategoryId = formData.categoryId._id;
      if (!cleanCategoryId && cleanCategoryPath.length > 0)
        cleanCategoryId = cleanCategoryPath[cleanCategoryPath.length - 1];
      if (!cleanCategoryId) {
        toast.error("Please select a category");
        setIsSaving(false);
        return;
      }
      const updatedAttributes = (formData.attributes || []).map((attr: any, index: number) => {
        if (index === 0) {
          return {
            ...attr,
            featured: formData.featured,
            pricing: [{
              ...(attr.pricing?.[0] || {}),
              _id: formData.pricingId || attr.pricing?.[0]?._id,
              marketplaceName: formData.marketplaceName || "woocommerce",
              marketplaceId: formData.marketplaceId || attr.pricing?.[0]?.marketplaceId,
              costPrice: formData.costPrice ?? 0,
              sellingPrice: formData.price ?? 0,
              retailPrice: formData.retailPrice ?? 0,
              discountPercentage: formData.discountPercentage ?? 0,
              taxId: formData.taxId || attr.pricing?.[0]?.taxId,
              taxRate: formData.taxRate ?? 0,
              vatExempt: formData.vatExempt ?? false,
            }],
            stock: {
              ...(attr.stock || {}),
              stockQuantity: formData.stockQuantity ?? 0,
              minStockLevel: formData.minStockLevel ?? 0,
              maxStockLevel: formData.maxStockLevel ?? 0,
              reorderPoint: formData.reorderLevel ?? 0,
              safetyStock: formData.safetyStock ?? 0,
              leadTimeDays: formData.leadTimeDays ?? 0,
              stockLocation: formData.stockLocation || "",
              binLocation: formData.binLocation || "",
              warehouseId: formData.warehouseId || attr.stock?.warehouseId,
              productStatusId: formData.productStatusId || attr.stock?.productStatusId,
              conditionId: formData.conditionId || attr.stock?.conditionId,
              supplierId: formData.supplierId || attr.stock?.supplierId,
              stockStatus: formData.stockStatus || "in-stock",
            },
            warranty: {
              warrantyType: formData.warrantyType || "",
              warrantyPeriod: formData.warrantyPeriod || "",
            },
          };
        }
        return attr;
      });
      const payload = {
        id: formData.id,
        isActive: formData.isActive,
        productName: formData.productName,
        sku: formData.sku || "",
        barcode: formData.barcode || "",
        brand: formData.brand || "",
        manufacturer: formData.manufacturer || "",
        modelNumber: formData.modelNumber || "",
        description: formData.description || "",
        shortDescription: formData.shortDescription || "",
        keywords: Array.isArray(formData.keywords) ? formData.keywords : formData.keywords ? [formData.keywords] : [],
        tags: formData.tags || [],
        images: formData.images || [],
        categoryId: cleanCategoryId,
        categoryPath: cleanCategoryPath,
        featured: formData.featured || false,
        attributes: updatedAttributes,
      };
      console.log("📤 FINAL PAYLOAD:", JSON.stringify(payload, null, 2));
      await onSave(payload);
      toast.success("Product updated successfully 🎉");
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Save error:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isSaving,
    loading,
    suppliers,
    warehouses,
    productStatuses,
    conditions,
    warehouseStatuses,
    categories,        // ✅ now exported
    attributeOptions,  // ✅ now exported
    updateField,
    handleSupplierChange,
    handleSave,
  };
};