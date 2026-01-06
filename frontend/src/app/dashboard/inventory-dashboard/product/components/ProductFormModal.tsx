// src/components/products/ProductFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import MultiSelectDrop from "@/components/form/MultiSelectDrop";
import { DropdownService } from "@/helper/dropdown.service";
import { createItem, updateItem } from "@/helper/apiHelper";
import * as z from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { Package, DollarSign, Truck, Shield, Save, X } from "lucide-react";
import { Product, DropdownOption, DropdownData } from "./Interface";

const productSchema = z.object({
  userId: z.string().optional(),
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name cannot exceed 200 characters"),
  SKU: z
    .string()
    .min(1, "SKU is required")
    .regex(
      /^[A-Z0-9-]+$/,
      "SKU can only contain uppercase letters, numbers, and hyphens"
    ),
  productDes: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  taxId: z.string().min(1, "Tax is required"),
  currencyId: z.string().min(1, "Currency is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  MPN: z.string().optional(),
  upcEan: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{12,13}$/.test(val),
      "Invalid UPC/EAN format"
    ),
  warrantyDuration: z
    .number()
    .min(0, "Warranty duration cannot be negative")
    .max(120, "Warranty duration cannot exceed 120 months"),
  returnPeriods: z
    .number()
    .min(0, "Return period cannot be negative")
    .max(365, "Return period cannot exceed 365 days"),
  leadTime: z.number().min(0, "Lead time cannot be negative"),
  stock: z.number().min(0, "Stock cannot be negative"),
  channelIds: z
    .array(z.string())
    .min(1, "Select at least one channel")
    .optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingProduct?: Product | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingProduct,
}: ProductFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownData, setDropdownData] = useState<DropdownData>({
    categories: [],
    taxes: [],
    currencies: [],
    vendors: [],
    channels: [],
  });
  const [userId, setUserId] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      productName: "",
      SKU: "",
      productDes: "",
      categoryId: "",
      taxId: "",
      currencyId: "",
      vendorId: "",
      MPN: "",
      upcEan: "",
      warrantyDuration: 12,
      returnPeriods: 30,
      leadTime: 7,
      stock: 0,
      channelIds: [],
    },
  });

  // Fetch dropdown data and user ID from token
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get user ID from token
        const token = localStorage.getItem("user");
        const userObj = JSON.parse(token ?? "{}");

        if (token) {
          try {
            setUserId(userObj?.id || "");
            setValue("userId", userObj?.id);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }

        // Fetch all dropdown data
        const data = await DropdownService.fetchAll();
        setDropdownData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load dropdown data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, setValue]);

  useEffect(() => {
    if (editingProduct && isOpen) {
      reset({
        productName: editingProduct.productName,
        SKU: editingProduct.SKU,
        productDes: editingProduct.productDes,
        categoryId: editingProduct.categoryId,
        taxId: editingProduct.taxId,
        currencyId: editingProduct.currencyId,
        vendorId: editingProduct.vendorId,
        MPN: editingProduct.MPN ?? "",
        upcEan: editingProduct.upcEan ?? "",
        warrantyDuration: editingProduct.warrantyDuration,
        returnPeriods: editingProduct.returnPeriods,
        leadTime: editingProduct.leadTime,
        stock: editingProduct.stock,
        channelIds: editingProduct.channelIds,
      });
    } else {
      resetForm();
    }
  }, [editingProduct, isOpen, reset]);

  //   const onSubmit = async (data: ProductFormData) => {
  //     setIsSubmitting(true);
  //     try {
  //       const finalData = {
  //         ...data,
  //         userId: userId || data.userId,
  //         createdBy: userId || data.createdBy,
  //         updatedBy: userId || data.updatedBy,
  //       };
  // if(editingProduct){

  //     await updateItem("/product-base", editingProduct._id, finalData);
  //     alert("Product updated successfully!");
  // }
  // else{
  //     console.log("Submitting product data:", finalData);
  //     const response = await createItem("/product-base", finalData);
  //     alert("Product created successfully!");
  //     console.log("Product created:", response);

  // }

  //       resetForm();
  //       onSuccess?.();
  //       onClose();
  //     } catch (error: unknown) {
  //       let errorMessage = "Failed to create product. Please try again.";

  //       if (error instanceof Error) {
  //         console.error("Error creating product:", error.message);
  //         errorMessage = error.message;
  //       }

  //       const serverError = error as { errors?: Record<string, string[]> };
  //       if (serverError.errors) {
  //         const errorList = Object.entries(serverError.errors)
  //           .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
  //           .join("\n");
  //         errorMessage = `Validation errors:\n${errorList}`;
  //       }

  //       alert(errorMessage);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const finalData = {
        ...data,
        userId,
        createdBy: userId,
        updatedBy: userId,
      };

      if (editingProduct?._id) {
        await updateItem("/product-base", editingProduct._id, finalData);
        alert("Product updated successfully!");
      } else {
        await createItem("/product-base", finalData);
        alert("Product created successfully!");
      }

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      productName: "",
      SKU: "",
      productDes: "",
      categoryId: "",
      taxId: "",
      currencyId: "",
      vendorId: "",
      MPN: "",
      upcEan: "",
      warrantyDuration: 12,
      returnPeriods: 30,
      leadTime: 7,
      stock: 0,
      channelIds: [],
    });
  };

  const onDiscard = () => {
    if (
      isDirty &&
      !window.confirm("Are you sure? All unsaved changes will be lost.")
    ) {
      return;
    }
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <FormModal
        title={editingProduct ? "Edit Product" : "Create New Product"}
        icon={<Package className="w-5 h-5" />}
        onClose={onClose}
        themeColor="#F97316" // Orange color
        width="max-w-3xl"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form data...</p>
          </div>
        </div>
      </FormModal>
    );
  }

  return (
    <FormModal
      title={editingProduct ? "Edit Product" : "Create New Product"}
      icon={<Package className="w-5 h-5" />}
      onClose={onClose}
      themeColor="#F97316"
      width="max-w-6xl"
      className="h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
        {/* Scrollable form content */}
        <div className="space-y-6  overflow-y-auto p-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                    ${
                      errors.productName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter product name"
                  {...register("productName")}
                />
                {errors.productName && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                    ${errors.SKU ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter SKU"
                  {...register("SKU")}
                />
                {errors.SKU && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.SKU.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                rows={3}
                className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                  ${errors.productDes ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter product description"
                {...register("productDes")}
              />
              {errors.productDes && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.productDes.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    label="Category *"
                    value={field.value}
                    onChange={field.onChange}
                    options={dropdownData.categories}
                    placeholder="Select category"
                    error={errors.categoryId?.message}
                  />
                )}
              />

              <Controller
                name="vendorId"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    label="Vendor *"
                    value={field.value}
                    onChange={field.onChange}
                    options={dropdownData.vendors}
                    placeholder="Select vendor"
                    error={errors.vendorId?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Pricing & Tax */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pricing & Tax
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="currencyId"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    label="Currency *"
                    value={field.value}
                    onChange={field.onChange}
                    options={dropdownData.currencies}
                    placeholder="Select currency"
                    error={errors.currencyId?.message}
                  />
                )}
              />

              <Controller
                name="taxId"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    label="Tax *"
                    value={field.value}
                    onChange={field.onChange}
                    options={dropdownData.taxes}
                    placeholder="Select tax"
                    error={errors.taxId?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Time (days)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter lead time"
                  {...register("leadTime", { valueAsNumber: true })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                    ${errors.stock ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter stock quantity"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MPN (Manufacturer Part Number)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter MPN"
                  {...register("MPN")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPC/EAN
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                    ${errors.upcEan ? "border-red-500" : "border-gray-300"}`}
                  placeholder="12 or 13 digits"
                  {...register("upcEan")}
                />
                {errors.upcEan && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.upcEan.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Duration (months)
                </label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                    ${
                      errors.warrantyDuration
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  placeholder="Enter warranty duration"
                  {...register("warrantyDuration", { valueAsNumber: true })}
                />
                {errors.warrantyDuration && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.warrantyDuration.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Period (days)
                </label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none
                    ${
                      errors.returnPeriods
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  placeholder="Enter return period"
                  {...register("returnPeriods", { valueAsNumber: true })}
                />
                {errors.returnPeriods && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.returnPeriods.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Controller
                name="channelIds"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelectDrop
                    label="Sales Channels *"
                    options={dropdownData.channels}
                    value={field.value || []}
                    onChange={field.onChange}
                    multiple={true}
                    error={errors.channelIds?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg 
              text-gray-700 hover:bg-gray-50 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {editingProduct ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {editingProduct ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
