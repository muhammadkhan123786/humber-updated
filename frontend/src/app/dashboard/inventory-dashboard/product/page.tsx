// src/app/products/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useForm,
  Controller,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import * as z from "zod";
import {
  Package,
  Tag,
  DollarSign,
  ShoppingBag,
  Percent,
  Hash,
  Ruler,
  Palette,
  Box,
  Globe,
  Upload,
  Layers,
  Package2,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  Save,
  X,
  Barcode,
  Weight,
  Shield,
  Truck,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Warehouse,
  Users,
  Settings,
  CreditCard,
} from "lucide-react";

// ==================== ZOD VALIDATION SCHEMA ====================
const productSchema = z.object({
  // 1. BASIC IDENTIFICATION
  productCode: z
    .string()
    .min(3, "Product code must be at least 3 characters")
    .max(50, "Product code cannot exceed 50 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(
      /^[A-Z0-9-]+$/,
      "SKU can only contain uppercase letters, numbers, and hyphens"
    ),
  upcEan: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{12,13}$/.test(val),
      "Invalid UPC/EAN format"
    ),
  mpn: z.string().optional(),

  // 2. DESCRIPTIVE INFORMATION
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name cannot exceed 200 characters"),
  shortDescription: z
    .string()
    .max(500, "Short description cannot exceed 500 characters")
    .optional(),
  longDescription: z
    .string()
    .min(50, "Long description must be at least 50 characters")
    .optional(),
  metaTitle: z
    .string()
    .max(60, "Meta title cannot exceed 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional(),

  // 3. DEPARTMENT & CATEGORY
  department: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    costCenter: z.string().optional(),
    profitCenter: z.string().optional(),
  }),
  category: z.object({
    level1: z.string(),
    level2: z.string(),
    level3: z.string(),
    level4: z.string().optional(),
    googleCategory: z.string().optional(),
    amazonCategory: z.string().optional(),
  }),

  // 4. PRICING
  pricing: z.object({
    costPrice: z
      .number()
      .min(0, "Cost price cannot be negative")
      .max(1000000, "Cost price is too high"),
    landedCost: z.number().min(0).optional(),
    handlingCost: z.number().min(0).optional(),
    basePrice: z
      .number()
      .min(0.01, "Base price must be at least £0.01")
      .max(1000000, "Price is too high"),
    salePrice: z.number().min(0).optional(),
    compareAtPrice: z.number().min(0).optional(),
    vat: z.object({
      rate: z.enum(["0.20", "0.05", "0.00"]),
      scheme: z.enum(["standard", "flat", "cash", "annual"]),
      inclusive: z.boolean(),
      amount: z.number().min(0),
    }),
    currency: z.enum(["GBP", "EUR", "USD"]),
    discount: z
      .object({
        type: z.enum(["percentage", "fixed", "bogo"]).optional(),
        value: z.number().min(0).max(100).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        promotionCode: z.string().optional(),
      })
      .optional(),
  }),

  // 5. INVENTORY
  inventory: z.object({
    totalStock: z
      .number()
      .min(0, "Stock cannot be negative")
      .max(999999, "Stock quantity is too high"),
    availableStock: z.number().min(0),
    reservedStock: z.number().min(0).optional(),
    storage: z.object({
      warehouseLocation: z.string(),
      binLocation: z.string().optional(),
      temperatureZone: z.enum(["ambient", "chilled", "frozen"]),
      hazardous: z.boolean(),
      serialTracking: z.boolean(),
      batchTracking: z.boolean(),
      expiryDate: z.string().optional(),
    }),
    reorderPoint: z.number().min(0).optional(),
    reorderQuantity: z.number().min(0).optional(),
    leadTime: z.number().min(0).optional(),
    safetyStock: z.number().min(0).optional(),
  }),

  // 6. DIMENSIONS & WEIGHT
  dimensions: z.object({
    length: z.number().min(0, "Length must be positive").max(1000),
    width: z.number().min(0, "Width must be positive").max(1000),
    height: z.number().min(0, "Height must be positive").max(1000),
    weight: z.number().min(0, "Weight must be positive").max(1000),
    netWeight: z.number().min(0).optional(),
    grossWeight: z.number().min(0).optional(),
    packageType: z.string().optional(),
    packageQuantity: z.number().min(1).optional(),
  }),

  // 7. COMPLIANCE (UK/EU)
  compliance: z.object({
    ceMarking: z.boolean(),
    ukcaMarking: z.boolean(),
    rohsCompliant: z.boolean(),
    reachCompliant: z.boolean(),
    weeeCompliant: z.boolean(),
    warranty: z.object({
      duration: z.number().min(0).max(120),
      type: z.enum(["manufacturer", "seller"]),
      terms: z.string().optional(),
    }),
    returns: z.object({
      period: z.number().min(0).max(365),
      restockingFee: z.number().min(0).max(100).optional(),
    }),
    countryOfOrigin: z.string().length(2),
    harmonizedCode: z.string().optional(),
    importDutyRate: z.number().min(0).max(100).optional(),
    ethicalSourcing: z.boolean(),
    recyclable: z.boolean(),
    certifications: z.array(z.string()).optional(),
  }),

  // 8. SUPPLIER INFORMATION
  supplier: z.object({
    id: z.string(),
    name: z.string().min(1, "Supplier name is required"),
    companyNumber: z.string().optional(),
    vatNumber: z.string().optional(),
    contact: z.object({
      person: z.string(),
      email: z.string().email("Invalid email address"),
      phone: z.string().optional(),
    }),
    paymentTerms: z.string().optional(),
    minimumOrderQuantity: z.number().min(0).optional(),
    leadTime: z.number().min(0).optional(),
  }),

  // 9. VARIANTS
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string().min(1, "Variant SKU is required"),
        attributes: z.object({
          size: z.string().optional(),
          color: z.string().optional(),
          material: z.string().optional(),
          style: z.string().optional(),
        }),
        priceAdjustment: z.number(),
        stock: z.number().min(0),
        barcode: z.string().optional(),
      })
    )
    .optional(),

  // 10. CHANNELS
  channels: z.object({
    web: z.object({
      visible: z.boolean(),
      featured: z.boolean(),
      newArrival: z.boolean(),
      bestSeller: z.boolean(),
      seoPriority: z.number().min(0).max(10).optional(),
    }),
    amazon: z
      .object({
        asin: z.string().optional(),
        fulfillment: z.enum(["FBA", "FBM"]).optional(),
        categoryNode: z.string().optional(),
      })
      .optional(),
    ebay: z
      .object({
        itemId: z.string().optional(),
        condition: z.enum(["New", "Refurbished", "Used"]).optional(),
      })
      .optional(),
    retail: z
      .object({
        storeLocations: z.array(z.string()).optional(),
        planogramCode: z.string().optional(),
      })
      .optional(),
  }),

  // 11. DIGITAL ASSETS
  assets: z
    .object({
      primaryImage: z.string().url("Invalid URL format").optional(),
      galleryImages: z.array(z.string().url()).optional(),
      videoUrl: z.string().url().optional(),
      manualPdf: z.string().url().optional(),
      specificationSheet: z.string().url().optional(),
    })
    .optional(),

  // 12. STATUS & SYSTEM
  status: z.enum(["draft", "active", "inactive", "archived", "discontinued"]),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

// ==================== CONSTANTS & DATA ====================
const DEPARTMENTS = [
  {
    id: "DEPT-ELEC",
    name: "Electronics",
    code: "ELEC",
    costCenter: "CC-001",
    profitCenter: "PC-001",
  },
  {
    id: "DEPT-FASH",
    name: "Fashion",
    code: "FASH",
    costCenter: "CC-002",
    profitCenter: "PC-002",
  },
  {
    id: "DEPT-HOME",
    name: "Home & Garden",
    code: "HOME",
    costCenter: "CC-003",
    profitCenter: "PC-003",
  },
  {
    id: "DEPT-AUTO",
    name: "Automotive",
    code: "AUTO",
    costCenter: "CC-004",
    profitCenter: "PC-004",
  },
  {
    id: "DEPT-HEALTH",
    name: "Health & Beauty",
    code: "HLTH",
    costCenter: "CC-005",
    profitCenter: "PC-005",
  },
];

const CATEGORIES = {
  Electronics: ["Mobile Phones", "Laptops", "TVs", "Audio", "Cameras"],
  Fashion: ["Clothing", "Shoes", "Accessories", "Jewelry", "Watches"],
  "Home & Garden": ["Furniture", "Kitchen", "Garden", "Lighting", "Decor"],
  Automotive: ["Car Parts", "Accessories", "Tools", "Tyres", "Oils"],
  "Health & Beauty": [
    "Skincare",
    "Makeup",
    "Supplements",
    "Fitness",
    "Haircare",
  ],
};

const VAT_RATES = [
  {
    value: "0.20",
    label: "Standard Rate (20%)",
    description: "Most goods and services",
  },
  {
    value: "0.05",
    label: "Reduced Rate (5%)",
    description: "Home energy, children's car seats",
  },
  {
    value: "0.00",
    label: "Zero Rate (0%)",
    description: "Most food, children's clothes, books",
  },
];

const TEMPERATURE_ZONES = [
  { value: "ambient", label: "Ambient (15-25°C)" },
  { value: "chilled", label: "Chilled (2-8°C)" },
  { value: "frozen", label: "Frozen (-18°C or below)" },
];

const COUNTRIES = [
  { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "DE", label: "Germany", flag: "🇩🇪" },
  { value: "FR", label: "France", flag: "🇫🇷" },
  { value: "CN", label: "China", flag: "🇨🇳" },
  { value: "JP", label: "Japan", flag: "🇯🇵" },
];

const WAREHOUSE_LOCATIONS = [
  "UK-WH1 (London)",
  "UK-WH2 (Manchester)",
  "EU-WH1 (Rotterdam)",
  "US-WH1 (New Jersey)",
];

// ==================== REUSABLE COMPONENTS ====================
interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  children,
  description,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

interface FormGroupProps {
  title?: string;
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({
  title,
  columns = 2,
  children,
}) => (
  <div>
    {title && (
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        {title}
      </h4>
    )}
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {children}
    </div>
  </div>
);

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  error,
  helperText,
  prefix,
  suffix,
  className = "",
  ...props
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      {prefix && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {prefix}
        </div>
      )}
      <input
        className={`
          w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
          transition-colors
          ${icon ? "pl-10" : ""}
          ${prefix ? "pl-10" : ""}
          ${suffix ? "pr-10" : ""}
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700"
          }
          ${className}
        `}
        {...props}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {suffix}
        </div>
      )}
    </div>
    {helperText && !error && (
      <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
    )}
    {error && (
      <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string; description?: string }>;
  error?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  error,
  ...props
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      className={`
        w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-lg
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
        transition-colors appearance-none
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-700"
        }
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
  </div>
);

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  description,
}) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${
          checked
            ? "bg-blue-600 dark:bg-blue-500"
            : "bg-gray-200 dark:bg-gray-700"
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  </div>
);

// ==================== MAIN COMPONENT ====================
export default function CreateProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      productCode: "",
      sku: "",
      productName: "",

      department: DEPARTMENTS[0],

      category: {
        level1: "Electronics",
        level2: "",
        level3: "",
        level4: "",
      },

      pricing: {
        costPrice: 0,
        basePrice: 0,
        vat: {
          rate: "0.20",
          scheme: "standard",
          inclusive: true,
          amount: 0,
        },
        currency: "GBP",
      },

      inventory: {
        totalStock: 0,
        availableStock: 0,
        storage: {
          warehouseLocation: WAREHOUSE_LOCATIONS[0],
          temperatureZone: "ambient",
          hazardous: false,
          serialTracking: false,
          batchTracking: false,
        },
      },

      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
      },

      compliance: {
        ceMarking: false,
        ukcaMarking: false,
        rohsCompliant: false,
        reachCompliant: false,
        weeeCompliant: false,
        ethicalSourcing: false,
        recyclable: false,
        countryOfOrigin: "GB",
        warranty: {
          duration: 12,
          type: "manufacturer",
        },
        returns: {
          period: 30,
        },
      },

      supplier: {
        id: "",
        name: "",
        contact: {
          person: "",
          email: "",
        },
      },

      channels: {
        web: {
          visible: true,
          featured: false,
          newArrival: false,
          bestSeller: false,
        },
      },

      status: "draft",
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Watch values for calculations
  const watchCostPrice = watch("pricing.costPrice", 0);
  const watchBasePrice = watch("pricing.basePrice", 0);
  const watchVatRate = watch("pricing.vat.rate", "0.20");

  // Calculate VAT amount
  useEffect(() => {
    const vatRate = parseFloat(watchVatRate);
    const vatAmount = watchBasePrice * vatRate;
    setValue("pricing.vat.amount", parseFloat(vatAmount.toFixed(2)));
  }, [watchBasePrice, watchVatRate, setValue]);

  // Calculate gross margin
  const grossMargin =
    watchBasePrice > 0
      ? ((watchBasePrice - watchCostPrice) / watchBasePrice) * 100
      : 0;

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Product Data:", {
        ...data,
        calculatedValues: {
          grossMargin,
          netPrice: data.pricing.basePrice,
          vatAmount: data.pricing.vat.amount,
          totalPrice: data.pricing.basePrice + data.pricing.vat.amount,
        },
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Product created successfully!");
      reset();
      setStep(1);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDiscard = () => {
    if (
      isDirty &&
      !window.confirm("Are you sure? All unsaved changes will be lost.")
    ) {
      return;
    }
    reset();
    setStep(1);
    console.log("Form discarded");
  };

  const addVariant = () => {
    append({
      sku: "",
      attributes: {
        size: "",
        color: "",
        material: "",
        style: "",
      },
      priceAdjustment: 0,
      stock: 0,
      barcode: "",
    });
  };
console.log("errors", errors)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Product
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Add a new product to your inventory with complete professional
                details
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
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

          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {[
                "Basic Info",
                "Pricing",
                "Inventory",
                "Compliance",
                "Channels",
              ].map((label, index) => (
                <div key={label} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setStep(index + 1)}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                      ${
                        step > index + 1
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                          : step === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }
                    `}
                  >
                    {step > index + 1 ? "✓" : index + 1}
                  </button>
                  <span
                    className={`
                    ml-2 text-sm font-medium
                    ${
                      step === index + 1
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                  >
                    {label}
                  </span>
                  {index < totalSteps - 1 && (
                    <div
                      className={`
                      w-16 h-0.5 mx-4
                      ${
                        step > index + 1
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }
                    `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* STEP 1: BASIC INFORMATION */}
          {step === 1 && (
            <div className="space-y-8">
              <FormSection
                title="Basic Information"
                icon={<Package className="w-5 h-5" />}
                description="Core product details and identification"
              >
                <FormGroup columns={2}>
                  <FormInput
                    label="Product Code *"
                    icon={<Hash className="w-4 h-4" />}
                    placeholder="PRD-001"
                    error={errors.productCode?.message}
                    {...register("productCode")}
                  />
                  <FormInput
                    label="SKU *"
                    icon={<Hash className="w-4 h-4" />}
                    placeholder="SKU-001"
                    error={errors.sku?.message}
                    {...register("sku")}
                  />
                </FormGroup>

                <FormGroup>
                  <FormInput
                    label="Product Name *"
                    icon={<Package className="w-4 h-4" />}
                    placeholder="Enter product name"
                    error={errors.productName?.message}
                    {...register("productName")}
                  />
                </FormGroup>

                <FormGroup columns={2}>
                  <FormInput
                    label="UPC/EAN"
                    icon={<Barcode className="w-4 h-4" />}
                    placeholder="123456789012"
                    error={errors.upcEan?.message}
                    {...register("upcEan")}
                  />
                  <FormInput
                    label="MPN (Manufacturer Part Number)"
                    icon={<Hash className="w-4 h-4" />}
                    placeholder="Manufacturer part number"
                    {...register("mpn")}
                  />
                </FormGroup>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                      rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    rows={3}
                    placeholder="Brief product description (max 500 characters)"
                    {...register("shortDescription")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Long Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                      rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={6}
                    placeholder="Detailed product description with features and specifications"
                    {...register("longDescription")}
                  />
                </div>

                <FormGroup columns={2}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department *
                    </label>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <SearchableDropdown
                          value={field.value.id}
                          placeholder="Select Department"
                          options={DEPARTMENTS.map((dep) => ({
                            label: `${dep.name} (${dep.code})`,
                            value: dep.id,
                          }))}
                          onChange={(e) => {
                            const dept = DEPARTMENTS.find(
                              (d) => d.id === e.target.value
                            );
                            if (dept) field.onChange(dept);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Level 1 *
                    </label>
                    <Controller
                      name="category.level1"
                      control={control}
                      render={({ field }) => (
                        <SearchableDropdown
                          value={field.value}
                          placeholder="Select Category"
                          options={Object.keys(CATEGORIES).map((cat) => ({
                            label: cat,
                            value: cat,
                          }))}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                </FormGroup>
              </FormSection>
            </div>
          )}

          {/* STEP 2: PRICING & FINANCE */}
          {step === 2 && (
            <div className="space-y-8">
              <FormSection
                title="Pricing & Finance"
                icon={<DollarSign className="w-5 h-5" />}
                description="Pricing details and financial calculations"
              >
                <FormGroup title="Cost & Pricing" columns={2}>
                  <FormInput
                    label="Cost Price (£) *"
                    icon={<ShoppingBag className="w-4 h-4" />}
                    type="number"
                    step="0.01"
                    prefix="£"
                    error={errors.pricing?.costPrice?.message}
                    {...register("pricing.costPrice", { valueAsNumber: true })}
                  />
                  <FormInput
                    label="Base Price (£) *"
                    icon={<DollarSign className="w-4 h-4" />}
                    type="number"
                    step="0.01"
                    prefix="£"
                    error={errors.pricing?.basePrice?.message}
                    {...register("pricing.basePrice", { valueAsNumber: true })}
                  />
                </FormGroup>

                <FormGroup columns={2}>
                  <FormInput
                    label="Compare At Price (£)"
                    type="number"
                    step="0.01"
                    prefix="£"
                    helperText="Original price for discount display"
                    {...register("pricing.compareAtPrice", {
                      valueAsNumber: true,
                    })}
                  />
                  <FormInput
                    label="Sale Price (£)"
                    type="number"
                    step="0.01"
                    prefix="£"
                    helperText="Current selling price"
                    {...register("pricing.salePrice", { valueAsNumber: true })}
                  />
                </FormGroup>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Financial Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Gross Margin
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          grossMargin >= 30
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {grossMargin.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        VAT Amount
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        £{watch("pricing.vat.amount", 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Price
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        £
                        {(
                          watch("pricing.basePrice", 0) +
                          watch("pricing.vat.amount", 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Currency
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {watch("pricing.currency", "GBP")}
                      </p>
                    </div>
                  </div>
                </div>

                <FormGroup title="VAT Settings">
                  <Controller
                    name="pricing.vat.rate"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        label="VAT Rate *"
                        options={VAT_RATES}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.pricing?.vat?.rate?.message}
                      />
                    )}
                  />
                  <Controller
                    name="pricing.vat.inclusive"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="VAT Inclusive"
                        checked={field.value}
                        onChange={field.onChange}
                        description="Price includes VAT"
                      />
                    )}
                  />
                </FormGroup>
              </FormSection>
            </div>
          )}

          {/* STEP 3: INVENTORY & DIMENSIONS */}
          {step === 3 && (
            <div className="space-y-8">
              <FormSection
                title="Inventory & Storage"
                icon={<Warehouse className="w-5 h-5" />}
                description="Stock management and storage details"
              >
                <FormGroup title="Stock Levels" columns={2}>
                  <FormInput
                    label="Total Stock *"
                    icon={<Box className="w-4 h-4" />}
                    type="number"
                    error={errors.inventory?.totalStock?.message}
                    {...register("inventory.totalStock", {
                      valueAsNumber: true,
                    })}
                  />
                  <FormInput
                    label="Available Stock"
                    type="number"
                    {...register("inventory.availableStock", {
                      valueAsNumber: true,
                    })}
                  />
                </FormGroup>

                <FormGroup title="Storage Information">
                  <Controller
                    name="inventory.storage.warehouseLocation"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        label="Warehouse Location *"
                        options={WAREHOUSE_LOCATIONS.map((loc) => ({
                          value: loc,
                          label: loc,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  
                  <Controller
                    name="inventory.storage.temperatureZone"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        label="Temperature Zone"
                        options={TEMPERATURE_ZONES}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup title="Safety & Tracking" columns={2}>
                  <Controller
                    name="inventory.storage.hazardous"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="Hazardous Material"
                        checked={field.value}
                        onChange={field.onChange}
                        description="Requires special handling"
                      />
                    )}
                  />
                  <Controller
                    name="inventory.storage.serialTracking"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="Serial Number Tracking"
                        checked={field.value}
                        onChange={field.onChange}
                        description="Track individual units"
                      />
                    )}
                  />
                </FormGroup>
              </FormSection>

              <FormSection
                title="Dimensions & Weight"
                icon={<Ruler className="w-5 h-5" />}
                description="Product size and weight specifications"
              >
                <FormGroup title="Dimensions (cm)" columns={3}>
                  <FormInput
                    label="Length"
                    type="number"
                    step="0.1"
                    suffix="cm"
                    error={errors.dimensions?.length?.message}
                    {...register("dimensions.length", { valueAsNumber: true })}
                  />
                  <FormInput
                    label="Width"
                    type="number"
                    step="0.1"
                    suffix="cm"
                    error={errors.dimensions?.width?.message}
                    {...register("dimensions.width", { valueAsNumber: true })}
                  />
                  <FormInput
                    label="Height"
                    type="number"
                    step="0.1"
                    suffix="cm"
                    error={errors.dimensions?.height?.message}
                    {...register("dimensions.height", { valueAsNumber: true })}
                  />
                </FormGroup>

                <FormGroup title="Weight (kg)" columns={2}>
                  <FormInput
                    label="Weight *"
                    icon={<Weight className="w-4 h-4" />}
                    type="number"
                    step="0.1"
                    suffix="kg"
                    error={errors.dimensions?.weight?.message}
                    {...register("dimensions.weight", { valueAsNumber: true })}
                  />
                  <FormInput
                    label="Gross Weight"
                    type="number"
                    step="0.1"
                    suffix="kg"
                    {...register("dimensions.grossWeight", {
                      valueAsNumber: true,
                    })}
                  />
                </FormGroup>
              </FormSection>
            </div>
          )}

          {/* STEP 4: COMPLIANCE & SUPPLIER */}
          {step === 4 && (
            <div className="space-y-8">
              <FormSection
                title="Compliance & Regulations"
                icon={<Shield className="w-5 h-5" />}
                description="UK/EU regulatory compliance and certifications"
              >
                <FormGroup title="UK/EU Compliance" columns={2}>
                  <Controller
                    name="compliance.ceMarking"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="CE Marking"
                        checked={field.value}
                        onChange={field.onChange}
                        description="EU Conformity Assessment"
                      />
                    )}
                  />
                  <Controller
                    name="compliance.ukcaMarking"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="UKCA Marking"
                        checked={field.value}
                        onChange={field.onChange}
                        description="UK Conformity Assessed"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup title="Warranty & Returns">
                  <FormInput
                    label="Warranty Duration"
                    type="number"
                    suffix="months"
                    {...register("compliance.warranty.duration", {
                      valueAsNumber: true,
                    })}
                  />
                  <FormInput
                    label="Returns Period"
                    type="number"
                    suffix="days"
                    {...register("compliance.returns.period", {
                      valueAsNumber: true,
                    })}
                  />
                </FormGroup>

                <FormGroup>
                  <Controller
                    name="compliance.countryOfOrigin"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        label="Country of Origin *"
                        options={COUNTRIES}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormGroup>
              </FormSection>

              <FormSection
                title="Supplier Information"
                icon={<Users className="w-5 h-5" />}
                description="Supplier details and procurement terms"
              >
                <FormGroup columns={2}>
                  <FormInput
                    label="Supplier Name *"
                    error={errors.supplier?.name?.message}
                    {...register("supplier.name")}
                  />
                  <FormInput
                    label="Company Number"
                    placeholder="UK Companies House number"
                    {...register("supplier.companyNumber")}
                  />
                </FormGroup>

                <FormGroup columns={2}>
                  <FormInput
                    label="Contact Person *"
                    {...register("supplier.contact.person")}
                  />
                  <FormInput
                    label="Email *"
                    type="email"
                    error={errors.supplier?.contact?.email?.message}
                    {...register("supplier.contact.email")}
                  />
                </FormGroup>

                <FormGroup columns={2}>
                  <FormInput
                    label="VAT Number"
                    placeholder="GB123456789"
                    {...register("supplier.vatNumber")}
                  />
                  <FormInput
                    label="Lead Time"
                    type="number"
                    suffix="days"
                    {...register("supplier.leadTime", { valueAsNumber: true })}
                  />
                </FormGroup>
              </FormSection>
            </div>
          )}

          {/* STEP 5: VARIANTS & CHANNELS */}
          {step === 5 && (
            <div className="space-y-8">
              <FormSection
                title="Product Variants"
                icon={<Layers className="w-5 h-5" />}
                description="Manage different product variations"
              >
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Variant {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <FormGroup columns={2}>
                      <FormInput
                        label="Variant SKU *"
                        {...register(`variants.${index}.sku` as const)}
                      />
                      <FormInput
                        label="Price Adjustment (£)"
                        type="number"
                        step="0.01"
                        prefix="£"
                        {...register(
                          `variants.${index}.priceAdjustment` as const,
                          { valueAsNumber: true }
                        )}
                      />
                    </FormGroup>
                    <FormGroup columns={4}>
                      <FormInput
                        label="Size"
                        {...register(
                          `variants.${index}.attributes.size` as const
                        )}
                      />
                      <FormInput
                        label="Color"
                        {...register(
                          `variants.${index}.attributes.color` as const
                        )}
                      />
                      <FormInput
                        label="Material"
                        {...register(
                          `variants.${index}.attributes.material` as const
                        )}
                      />
                      <FormInput
                        label="Stock"
                        type="number"
                        {...register(`variants.${index}.stock` as const, {
                          valueAsNumber: true,
                        })}
                      />
                    </FormGroup>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 
                    rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 
                    hover:border-gray-400 dark:hover:border-gray-500 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </FormSection>

              <FormSection
                title="Sales Channels"
                icon={<BarChart3 className="w-5 h-5" />}
                description="Configure where this product will be sold"
              >
                <div className="space-y-4">
                  <Controller
                    name="channels.web.visible"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="Web Store"
                        checked={field.value}
                        onChange={field.onChange}
                        description="Visible on main website"
                      />
                    )}
                  />
                  <Controller
                    name="channels.web.featured"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="Featured Product"
                        checked={field.value}
                        onChange={field.onChange}
                        description="Show on homepage and featured sections"
                      />
                    )}
                  />
                  <Controller
                    name="channels.web.newArrival"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        label="New Arrival"
                        checked={field.value}
                        onChange={field.onChange}
                        description="Mark as new product"
                      />
                    )}
                  />
                </div>
              </FormSection>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {step} of {totalSteps}
            </div>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Product..." : "Create Product"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
