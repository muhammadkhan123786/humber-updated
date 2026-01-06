"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import MultiSelectDrop from "@/components/form/MultiSelectDrop";
import { DropdownService } from "@/helper/dropdown.service";
import { createItem } from "@/helper/apiHelper";
import * as z from "zod";

import {
  Package,
  Tag,
  DollarSign,
  ShoppingBag,
  Shield,
  Truck,
  Users,
  Globe,
  Save,
  X,
  AlertCircle,
} from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}
export interface DropdownData {
  categories: DropdownOption[];
  //   brands: DropdownOption[];
  taxes: DropdownOption[];
  currencies: DropdownOption[];
  vendors: DropdownOption[];
  channels: DropdownOption[];
}
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

  // brandId: z.string().min(1, "Brand is required"),
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

// Update FormSection, FormGroup, FormInput components from your original code...
// (Keep your existing UI components)

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownData, setDropdownData] = useState<DropdownData>({
    categories: [],
    // brands: [],
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
      // brandId: "",
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

    fetchData();
  }, [setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare final data with user ID
      const finalData = {
        ...data,
        userId: userId || data.userId,
        createdBy: userId || data.createdBy,
        updatedBy: userId || data.updatedBy,
      };

      console.log("Submitting product data:", finalData);

      // Call API to create product
      const response = await createItem("/product-base", finalData);

      alert("Product created successfully!");
      console.log("Product created:", response);
      resetForm();
      // Reset form or redirect
      // reset();
    } catch (error: unknown) {
      let errorMessage = "Failed to create product. Please try again.";

      // 1. Check if it's a standard Error object
      if (error instanceof Error) {
        console.error("Error creating product:", error.message);
        errorMessage = error.message;
      }

      const serverError = error as { errors?: Record<string, string[]> };

      if (serverError.errors) {
        const errorList = Object.entries(serverError.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        errorMessage = `Validation errors:\n${errorList}`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      productName: "",
      SKU: "",
      productDes: "",
      // brandId: "",
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

    // Also reset any other local state if needed
    console.log("Form has been reset to default values");
  };

  console.log("error", errors);
  const onDiscard = () => {
    if (
      isDirty &&
      !window.confirm("Are you sure? All unsaved changes will be lost.")
    ) {
      return;
    }
    resetForm();
    // Reset form logic
    console.log("Form discarded");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading form data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header (keep your existing header) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Product
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Add a new product with complete details
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Discard
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Core product details and identification
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                      ${
                        errors.productName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    placeholder="Enter product name"
                    {...register("productName")}
                  />
                  {errors.productName && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                      ${
                        errors.SKU
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    placeholder="Enter SKU"
                    {...register("SKU")}
                  />
                  {errors.SKU && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.SKU.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Description *
                </label>
                <textarea
                  rows={4}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                    ${
                      errors.productDes
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  placeholder="Enter product description"
                  {...register("productDes")}
                />
                {errors.productDes && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.productDes.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* <Controller
                  name="brandId"
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown
                      label="Brand *"
                      value={field.value}
                      onChange={field.onChange}
                      options={dropdownData.brands}
                      placeholder="Select brand"
                      error={errors.brandId?.message}
                    />
                  )}
                /> */}
              </div>
            </div>
          </div>

          {/* Pricing & Tax Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pricing & Tax
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Financial details and tax information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Vendor & Inventory Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Vendor & Inventory
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Supplier and stock information
                </p>
              </div>
            </div>

            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lead Time (days)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                      rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter lead time"
                    {...register("leadTime", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                      ${
                        errors.stock
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    placeholder="Enter stock quantity"
                    {...register("stock", { valueAsNumber: true })}
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Additional Information
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Warranty, returns, and identification
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    MPN (Manufacturer Part Number)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                      rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter MPN"
                    {...register("MPN")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    UPC/EAN
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                      ${
                        errors.upcEan
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    placeholder="12 or 13 digits"
                    {...register("upcEan")}
                  />
                  {errors.upcEan && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.upcEan.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Warranty Duration (months)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                      ${
                        errors.warrantyDuration
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    placeholder="Enter warranty duration"
                    {...register("warrantyDuration", { valueAsNumber: true })}
                  />
                  {errors.warrantyDuration && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.warrantyDuration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Return Period (days)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                      ${
                        errors.returnPeriods
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    placeholder="Enter return period"
                    {...register("returnPeriods", { valueAsNumber: true })}
                  />
                  {errors.returnPeriods && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
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
        </form>
      </div>
    </div>
  );
}
