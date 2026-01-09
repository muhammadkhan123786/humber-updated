import { z } from "zod"

const variantSchema = z.object({
  colorId: z.string().optional(),
  colorName: z.string().optional(),
  sizeId: z.string().optional(),
  sizeName: z.string().optional(),
  costPrice: z.number().min(0).default(0),
  basePrice: z.number().min(0).default(0),
  salePrice: z.number().min(0).default(0),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().min(0, "Stock must be non-negative"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(), 
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  userId: z.string().optional(),
  productName: z.string().min(3, "Product name must be at least 3 characters").max(200),
  SKU: z.string().min(1, "SKU is required").regex(/^[A-Z0-9-]+$/, "SKU can only contain uppercase letters, numbers, and hyphens"),
  productDes: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  collectionId: z.string().optional(),
  taxId: z.string().min(1, "Tax is required"),
  currencyId: z.string().min(1, "Currency is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  unitId: z.string().optional(),
  MPN: z.string().optional(),
  upcEan: z.string().optional().refine((val) => !val || /^[0-9]{12,13}$/.test(val), "Invalid UPC/EAN format"),
  barcode: z.string().optional(),
  warrantyDuration: z.number().min(0).max(120),
  leadTime: z.number().min(0),
  hsCode: z.string().optional(),
  // countryOfOrigin: z.string().optional(),
  // reorderLevel: z.number().min(0).optional(),
  // reorderQuantity: z.number().min(0).optional(),
  // shelfLife: z.number().min(0).optional(),
  // storageInstructions: z.string().optional(),
  productType: z.enum(["simple", "variable"]),
  hasVariants: z.boolean().default(false),
  costPrice: z.number().min(0).default(0),
  basePrice: z.number().min(0).default(0),
  salePrice: z.number().min(0).default(0),
  compareAtPrice: z.number().min(0).optional(),
  profitMargin: z.number().optional(),
  stock: z.number().optional(),
  variants: z.array(variantSchema).optional(),
 images: z.array(z.instanceof(File)).optional(),

  
  channelIds: z.array(z.string()).min(1, "Select at least one channel").optional(),
  isActive: z.boolean().default(true).optional(),
  isFeatured: z.boolean().default(false).optional(),
 
  tags: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  status: z.string(),
}).refine((data) => {
  if (data.productType === "simple") return data.basePrice !== undefined && data.basePrice >= 0;
  return true;
}, { message: "Price is required for simple products", path: ["price"] })
.refine((data) => {
  if (data.productType === "variable") return data.variants && data.variants.length > 0;
  return true;
}, { message: "At least one variant is required", path: ["variants"] });