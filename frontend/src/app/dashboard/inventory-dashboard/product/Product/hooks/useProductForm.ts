// hooks/useProductForm.ts - Complete with Attribute and Category Updates

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

  // Dropdown Data States
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [productStatuses, setProductStatuses] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [warehouseStatuses, setWarehouseStatuses] = useState<any[]>([]);

  // --------------------------
  // Fetch Suppliers
  // --------------------------
  const fetchSuppliers = useCallback(async () => {
    try {
      console.log("🔍 Fetching suppliers...");
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers?limit=1000`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log("📦 Suppliers data:", data);
      console.log("📦 Suppliers array:", data.data);
      
      setSuppliers(data.data || []);
    } catch (error) {
      console.error("❌ Error fetching suppliers:", error);
      setSuppliers([]);
    }
  }, []);

  // --------------------------
  // Load Dropdown Data
  // --------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch suppliers
        await fetchSuppliers();
        
        // Fetch warehouse data
        const warehouseData = await DropdownService.fetchOnlyWarehouse();
        setWarehouses(warehouseData.warehouses || []);
        setWarehouseStatuses(warehouseData.warehouseStatus || []);
        setProductStatuses(warehouseData.productStatus || []);
        setConditions(warehouseData.conditions || []);
        
        console.log("✅ All data loaded");
      } catch (err) {
        console.error("❌ Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product) {
      load();
    }
  }, [product, fetchSuppliers]);

  // --------------------------
  // Initialize Form
  // --------------------------
  useEffect(() => {
    if (!product) return;

    console.log("📝 Initializing form with product:", product);
    console.log("📝 Suppliers available:", suppliers.length);
    
    // Find supplier name if supplierId exists
    let supplierName = "";
    const supplierId = product.supplierId || product.attributes?.[0]?.stock?.supplierId || "";
    
    console.log("🔍 Supplier ID from product:", supplierId);
    
    if (supplierId && suppliers.length > 0) {
      const supplier = suppliers.find(s => s._id === supplierId);
      console.log("🔍 Found supplier:", supplier);
      
      if (supplier) {
        supplierName = 
          supplier?.contactInformation?.primaryContactName ||
          supplier?.supplierIdentification?.legalBusinessName ||
          supplier?.legalBusinessName ||
          supplier?.name ||
          "";
        console.log("✅ Found supplier name:", supplierName);
      }
    }

    setFormData({
      ...product,
      productName: product.productName || product.name || "",
      supplierId: supplierId,
      supplierName: supplierName,
      attributes:
        product.attributes?.length > 0
          ? product.attributes
          : [
              {
                sku: product.sku,
                attributes: {},
                pricing: [],
                stock: {},
                warranty: {},
              },
            ],
    });
  }, [product, suppliers]);

  // --------------------------
  // Generic Input Change
  // --------------------------
  const handleInputChange = useCallback((path: string, value: any) => {
    setFormData((prev: any) => {
      if (!prev) return prev;

      const newState = structuredClone(prev);
      const keys = path.split(".");

      let obj = newState;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes("[")) {
          const [k, index] = key.replace("]", "").split("[");
          obj = obj[k][Number(index)];
        } else if (i === keys.length - 1) {
          obj[key] = value;
        } else {
          obj = obj[key];
        }
      }

      return newState;
    });
  }, []);

  // --------------------------
  // ✅ NEW: Handle Attribute Update (for variants)
  // --------------------------
  const handleAttributeUpdate = useCallback((index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      if (!prev) return prev;

      const newState = { ...prev };
      
      // Make sure attributes array exists
      if (!newState.attributes) {
        newState.attributes = [];
      }
      
      // Make sure the specific attribute exists
      if (!newState.attributes[index]) {
        newState.attributes[index] = {
          sku: "",
          attributes: {},
          pricing: [],
          stock: {},
          warranty: {}
        };
      }

      // Handle nested fields with dot notation
      if (field.includes('.')) {
        const parts = field.split('.');
        
        if (parts.length === 2) {
          const [parent, child] = parts;
          
          if (parent === 'attributes') {
            // Handle dynamic attributes like "attributes.color"
            if (!newState.attributes[index].attributes) {
              newState.attributes[index].attributes = {};
            }
            newState.attributes[index].attributes[child] = value;
          } else {
            // Handle other nested fields
            if (!newState.attributes[index][parent]) {
              newState.attributes[index][parent] = {};
            }
            newState.attributes[index][parent][child] = value;
          }
        }
      } else {
        // Handle top-level fields (like "sku")
        newState.attributes[index][field] = value;
      }

      return newState;
    });
  }, []);

  // --------------------------
  // ✅ NEW: Handle Category Update
  // --------------------------
  const handleCategoryUpdate = useCallback((categoryId: string, categoryPath: string[]) => {
    setFormData((prev: any) => {
      if (!prev) return prev;
      
      return {
        ...prev,
        categoryId,
        categoryPath
      };
    });
  }, []);

  // --------------------------
  // Supplier Change
  // --------------------------
  const handleSupplierChange = useCallback((supplierId: string) => {
    const selectedSupplier = suppliers.find(s => s._id === supplierId);
    
    setFormData((prev: any) => {
      if (!prev) return prev;

      const updated = { ...prev };
      updated.supplierId = supplierId;
      updated.supplierName = selectedSupplier?.supplierIdentification?.legalBusinessName || 
                             selectedSupplier?.legalBusinessName || 
                             selectedSupplier?.name || "";

      updated.attributes = updated.attributes.map((attr: any) => ({
        ...attr,
        supplierId,
        stock: {
          ...attr.stock,
          supplierId,
        },
      }));

      return updated;
    });

    // if (selectedSupplier) {
    //   toast.success(`Supplier "${updated.supplierName}" selected`);
    // }
  }, [suppliers]);

  // --------------------------
  // SAVE
  // --------------------------
  const handleSave = async () => {
    if (!formData) return;

    if (!formData.productName) {
      toast.error("Product name required");
      return;
    }

    try {
      setIsSaving(true);

      // Clean categoryPath
      const cleanCategoryPath = (formData.categoryPath || []).map((c: any) => {
        if (typeof c === "string") return c;
        return c?.id || c?._id || "";
      }).filter(Boolean);

      // Clean categoryId
      let cleanCategoryId = "";
      if (typeof formData.categoryId === "string") {
        cleanCategoryId = formData.categoryId;
      } else if (formData.categoryId?.id) {
        cleanCategoryId = formData.categoryId.id;
      } else if (formData.categoryId?._id) {
        cleanCategoryId = formData.categoryId._id;
      }

      if (!cleanCategoryId && cleanCategoryPath.length > 0) {
        cleanCategoryId = cleanCategoryPath[cleanCategoryPath.length - 1];
      }

      if (!cleanCategoryId) {
        toast.error("Please select a category");
        setIsSaving(false);
        return;
      }

      // Clean attributes - simplified version
      const cleanAttributes = (formData.attributes || []).map((attr: any, i: number) => ({
        ...attr,
        sku: i === 0 ? formData.sku : attr.sku,
        supplierId: formData.supplierId || attr.supplierId || null,
        attributes: attr.attributes || {},
        // Keep other fields as they are
        pricing: attr.pricing || [],
        stock: attr.stock || {},
        warranty: attr.warranty || {},
      }));

      const payload = {
        id: formData.id,
        productName: formData.productName,
        sku: formData.sku,
        description: formData.description || "",
        shortDescription: formData.shortDescription || "",
        brand: formData.brand || "",
        manufacturer: formData.manufacturer || "",
        modelNumber: formData.modelNumber || "",
        barcode: formData.barcode || "",
        status: formData.isActive ? "active" : "inactive",
        featured: formData.featured || false,
        images: formData.images || [],
        tags: formData.tags || [],
        keywords: formData.keywords || [],
        categoryId: cleanCategoryId,
        categoryPath: cleanCategoryPath,
        supplierId: formData.supplierId || null,
        attributes: cleanAttributes,
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

    // Dropdown Data
    suppliers,
    warehouses,
    productStatuses,
    conditions,
    warehouseStatuses,

    // Handlers
    handleInputChange,
    handleSupplierChange,
    handleAttributeUpdate,  // ✅ Now available!
    handleCategoryUpdate,   // ✅ Now available!
    handleSave,
    
  };
};