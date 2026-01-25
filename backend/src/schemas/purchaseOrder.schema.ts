import { string, z } from "zod";
import { Schema, SchemaDefinition } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";


export const purchaseOrderItemSchema: SchemaDefinition = {
  productName: { type: String, required: true },
  sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
};

// Mongoose schema definition for Purchase Order
export const purchaseOrderSchema: SchemaDefinition = {
  ...commonSchema,
    orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  supplier: {
    type: string,
    required: true,

  },
    supplierContact: {
    type: String,
    required: true,
  },
   
    orderDate: {
    type: Date,
    default: Date.now,
  },
    expectedDelivery: {
    type: Date,
    required: true,
        
    },
    status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'],
    default: 'draft',
    },
    items: {
    type: [purchaseOrderItemSchema],
    required: true,
    validate: {
      validator: function(v: any[]) {
        return v.length > 0; // Ensure at least one item
        },
        message: 'Purchase order must have at least one item'
        }
    },
    subtotal: {
    type: Number,
    required: true,
    min: 0
    },
    tax: {  
    type: Number,
    required: true,
    min: 0
    },
    total: {
    type: Number,
    required: true,
    min: 0
    },
    notes: {
    type: String,
    default: "",
    },
};




// Zod validation schema (for request validation)
export const purchaseOrderItemZodSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().positive("Unit price must be positive"),
  totalPrice: z.number().positive("Total price must be positive"),
});

export const purchaseOrderZodSchema = z.object({
    ...commonSchemaValidation,
  orderNumber: z.string().min(1, "Order number is required"),
  supplier: z.string().min(1, "Supplier is required"),
  supplierContact: z.string().min(1, "Supplier contact is required"),  
  orderDate: z.coerce.date().optional().default(() => new Date()),
  expectedDelivery: z.coerce.date(),
  status: z.enum(['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled']).default('draft'),
  items: z.array(purchaseOrderItemZodSchema).min(1, "At least one item is required"),
  subtotal: z.number().nonnegative("Subtotal must be non-negative"),
  tax: z.number().nonnegative("Tax must be non-negative"),
  total: z.number().nonnegative("Total must be non-negative"),
  notes: z.string().optional(),
});

