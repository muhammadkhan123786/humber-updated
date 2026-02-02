

// import { z } from 'zod';

// import  { Schema, SchemaDefinition } from 'mongoose';
// import { commonSchema, commonSchemaValidation } from './shared/common.schema';


// export const ProductSchema: SchemaDefinition = {
//     ...commonSchema,
//   productName: { type: String, required: true, trim: true },
//   sku: { type: String, required: true, unique: true },
//   barcode: { type: String },
  
//   // Relational References
//   finalCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
//   categoryPath: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
//   warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  
//   // Pricing
//   costPrice: { type: Number, required: true },
//   sellingPrice: { type: Number, required: true },
//   retailPrice: { type: Number },
//   vatExempt: { type: Boolean, default: false },

//   // Inventory
//   stockQuantity: { type: Number, default: 0 },
//   minStockLevel: { type: Number, default: 0 },
//   maxStockLevel: { type: Number, default: 1000 },
  
//   // Specifications nested for cleaner DB structure
//   dimensions: {
//     weight: Number,
//     length: Number,
//     width: Number,
//     height: Number
//   },
  
//   // Flexible storage for Dynamic Attributes
//   dynamicFields: { type: Map, of: Schema.Types.Mixed },
  
//   tags: [String],
//   images: [String],
//   status: { 
//     type: String, 
//     enum: ['active', 'inactive', 'discontinued', 'out-of-stock'], 
//     default: 'active' 
//   },
//   featured: { type: Boolean, default: false }
// };
 




// export const productValidationSchema = z.object({
//     ...commonSchemaValidation,
//   productName: z.string().min(3, "Product name is required"),
//   sku: z.string().min(1, "SKU is required"),
//   barcode: z.string().optional(),
  
//   // Ensure we receive IDs
//   finalCategoryId: z.string().min(1, "Category is required"),
//   categoryPath: z.array(z.string()),
//   warehouseId: z.string().optional(),
  
//   // Logic: Transform string inputs from form to numbers
//   costPrice: z.preprocess((val) => Number(val), z.number().nonnegative()),
//   sellingPrice: z.preprocess((val) => Number(val), z.number().nonnegative()),
//   stockQuantity: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
  
//   keywords: z.array(z.string()),
//   tags: z.array(z.string()),
//   images: z.array(z.string().url()).optional(),
  
//   condition: z.enum(['new', 'refurbished', 'used', 'damaged']),
//   status: z.enum(['active', 'inactive', 'discontinued', 'out-of-stock']),
  
// dynamicFields: z.record(z.string(), z.any()),
// // Validates the attribute-based fields
  
//   featured: z.boolean().default(false),
//   vatExempt: z.boolean().default(false),
// });

// // Partial schema for Updates
// export const updateProductSchema = productValidationSchema.partial();




/**
 * product.schema.ts  (Mongoose)
 *
 * Pattern mirrors your GRN schemas exactly:
 *   - Sub-schemas defined first with { _id: true } where we need the ref
 *   - Parent schema spreads ...commonSchema
 *   - Proper ObjectId refs
 *   - timestamps: true on top-level
 */

import { Schema, SchemaDefinition } from "mongoose";
import { commonSchema } from "./shared/common.schema";

// ─── 5. WARRANTY sub-document ────────────────────────────────────────────────

export const AttributeWarrantySchema = new Schema(
  {
    warrantyType: {
      type: String,     
      required: true,
    },
    warrantyPeriod: { type: String, required: true }, // e.g. "12 months"
  },
  { _id: false }, // single warranty per attribute, no separate _id needed
);

// ─── 4. STOCK sub-document ──────────────────────────────────────────────────

export const AttributeStockSchema = new Schema(
  {
    stockQuantity: { type: Number, required: true, min: 0 },
    minStockLevel: { type: Number, default: 0, min: 0 },
    maxStockLevel: { type: Number, default: 0, min: 0 },
    reorderPoint: { type: Number, default: 0, min: 0 },
    safetyStock: { type: Number, default: 0, min: 0 },
    leadTimeDays: { type: Number, default: 0, min: 0 },
    stockLocation: { type: String, default: "" },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    binLocation: { type: String, default: "" },
    productStatusId: { type: Schema.Types.ObjectId, ref: "ProductStatus" },
    conditionId: { type: Schema.Types.ObjectId, ref: "Condition" },
    // warehouseStatusId: { type: Schema.Types.ObjectId, ref: "WarehouseStatus" },
    featured: { type: Boolean, default: false },
  },
  { _id: false }, // one stock record per attribute, no separate _id
);

// ─── 3. PRICING sub-document (one per marketplace) ──────────────────────────

export const AttributePricingSchema = new Schema(
  {
    // marketplaceId: { type: String, required: true },
    marketplaceName: { type: String, required: true },
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    retailPrice: { type: Number, default: 0, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    taxId: { type: Schema.Types.ObjectId, ref: "Tax" },
    taxRate: { type: Number, default: 0 },
    vatExempt: { type: Boolean, default: false },
  },
  { _id: true }, // each pricing entry gets its own _id
);

// ─── 2. PRODUCT ATTRIBUTE (variant) ─────────────────────────────────────────
// Contains: its own attributes map + nested pricing[] + stock + warranty

export const ProductAttributeSchema = new Schema(
  {
    sku: { type: String, required: true },
    attributes: { type: Schema.Types.Mixed, required: true }, // dynamic key-value
    pricing: [AttributePricingSchema], // array of marketplace prices
    stock: AttributeStockSchema, // single stock record
    warranty: AttributeWarrantySchema, // single warranty record
  },
  { _id: true }, // each attribute/variant gets its own _id
);

// ─── 1. PRODUCT (top-level) ─────────────────────────────────────────────────

export const ProductSchema: SchemaDefinition = {
  
    ...commonSchema,
    
    productName: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, default: "" },
    brand: { type: String, default: "" },
    manufacturer: { type: String, default: "" },
    modelNumber: { type: String, default: "" },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    keywords: [{ type: String }],
    tags: [{ type: String }],
    images: [{ type: String }],
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    categoryPath: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    attributes: [ProductAttributeSchema], 
  
  
};





import { z } from "zod";
import { commonSchemaValidation } from "./shared/common.schema";

// ─── 5. WARRANTY ────────────────────────────────────────────────────────────

export const attributeWarrantyValidation = z.object({
  warrantyType: z.string(),
  warrantyPeriod: z.string().min(1, "Warranty period is required"),
});

// ─── 4. STOCK ───────────────────────────────────────────────────────────────

export const attributeStockValidation = z
  .object({
    stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
    minStockLevel: z.coerce.number().min(0).default(0),
    maxStockLevel: z.coerce.number().min(0).default(0),
    reorderPoint: z.coerce.number().min(0).default(0),
    safetyStock: z.coerce.number().min(0).default(0),
    leadTimeDays: z.coerce.number().min(0).default(0),
    stockLocation: z.string().default(""),
    warehouseId: z.string().optional().nullable(),
    binLocation: z.string().default(""),
    productStatusId: z.string().optional().nullable(),
    conditionId: z.string().optional().nullable(),
    // warehouseStatusId: z.string().optional().nullable(),
    featured: z.boolean().default(false),
  })
  // .refine(
  //   (data) => data.maxStockLevel === 0 || data.maxStockLevel >= data.minStockLevel,
  //   { message: "Max stock must be ≥ Min stock", path: ["maxStockLevel"] },
  // )
  // .refine(
  //   (data) => data.reorderPoint >= data.safetyStock,
  //   { message: "Reorder point must be ≥ Safety stock", path: ["reorderPoint"] },
  // );

// ─── 3. PRICING (one per marketplace) ───────────────────────────────────────

export const attributePricingValidation = z
  .object({
    // marketplaceId: z.string().min(1, "Marketplace is required"),
    marketplaceName: z.string().min(1),
    costPrice: z.coerce.number().min(0, "Cost price cannot be negative"),
    sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
    retailPrice: z.coerce.number().min(0).default(0),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),
    taxId: z.string().optional().nullable(),
    taxRate: z.coerce.number().min(0).default(0),
    vatExempt: z.boolean().default(false),
  })
  .refine(
    (data) => data.sellingPrice >= data.costPrice,
    {
      message: "Selling price must be ≥ Cost price",
      path: ["sellingPrice"],
    },
  );

// ─── 2. PRODUCT ATTRIBUTE (variant) — composes pricing + stock + warranty ───

export const productAttributeValidation = z.object({
  sku: z.string().min(1, "SKU is required"),
  attributes: z.record(z.string(), z.any()),
  pricing: z
    .array(attributePricingValidation)
    .min(1, "At least one marketplace pricing is required"),
  stock: attributeStockValidation,
  warranty: attributeWarrantyValidation,
});

// ─── 1. PRODUCT (top-level) — composes everything ───────────────────────────

export const createProductValidation = z.object({
  ...commonSchemaValidation,
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().default(""),
  brand: z.string().default(""),
  manufacturer: z.string().default(""),
  modelNumber: z.string().default(""),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  categoryId: z.string().min(1, "Category is required"),
  categoryPath: z.array(z.string()).min(1, "Category path is required"),

  attributes: z
    .array(productAttributeValidation)
    .min(1, "At least one variant is required"),
});

// ─── INFERRED TYPES (use these on backend route handlers) ───────────────────

export type CreateProductInput = z.infer<typeof createProductValidation>;
export type ProductAttributeInput = z.infer<typeof productAttributeValidation>;
export type AttributePricingInput = z.infer<typeof attributePricingValidation>;
export type AttributeStockInput = z.infer<typeof attributeStockValidation>;
export type AttributeWarrantyInput = z.infer<typeof attributeWarrantyValidation>;