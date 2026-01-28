

import { z } from 'zod';

import  { Schema, SchemaDefinition } from 'mongoose';
import { commonSchema, commonSchemaValidation } from './shared/common.schema';


export const ProductSchema: SchemaDefinition = {
    ...commonSchema,
  productName: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true },
  barcode: { type: String },
  
  // Relational References
  finalCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryPath: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  
  // Pricing
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  retailPrice: { type: Number },
  vatExempt: { type: Boolean, default: false },

  // Inventory
  stockQuantity: { type: Number, default: 0 },
  minStockLevel: { type: Number, default: 0 },
  maxStockLevel: { type: Number, default: 1000 },
  
  // Specifications nested for cleaner DB structure
  dimensions: {
    weight: Number,
    length: Number,
    width: Number,
    height: Number
  },
  
  // Flexible storage for Dynamic Attributes
  dynamicFields: { type: Map, of: Schema.Types.Mixed },
  
  tags: [String],
  images: [String],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'discontinued', 'out-of-stock'], 
    default: 'active' 
  },
  featured: { type: Boolean, default: false }
};
 




export const productValidationSchema = z.object({
    ...commonSchemaValidation,
  productName: z.string().min(3, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  
  // Ensure we receive IDs
  finalCategoryId: z.string().min(1, "Category is required"),
  categoryPath: z.array(z.string()),
  warehouseId: z.string().optional(),
  
  // Logic: Transform string inputs from form to numbers
  costPrice: z.preprocess((val) => Number(val), z.number().nonnegative()),
  sellingPrice: z.preprocess((val) => Number(val), z.number().nonnegative()),
  stockQuantity: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
  
  keywords: z.array(z.string()),
  tags: z.array(z.string()),
  images: z.array(z.string().url()).optional(),
  
  condition: z.enum(['new', 'refurbished', 'used', 'damaged']),
  status: z.enum(['active', 'inactive', 'discontinued', 'out-of-stock']),
  
dynamicFields: z.record(z.string(), z.any()),
// Validates the attribute-based fields
  
  featured: z.boolean().default(false),
  vatExempt: z.boolean().default(false),
});

// Partial schema for Updates
export const updateProductSchema = productValidationSchema.partial();