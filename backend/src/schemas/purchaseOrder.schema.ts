import { z } from "zod";
import { Schema, SchemaDefinition, Types } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";

// ✅ Define the item schema as a Schema instance
export const PurchaseOrderItemSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",   
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);


// ✅ Create the main schema as a Schema instance
export const PurchaseOrderSchema = new Schema(
  {
    ...commonSchema,
    orderNumber: {
      type: String,
      unique: true,
    },
    poReference: {
      type: String,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
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
      enum: ["draft", "pending", "approved", "ordered", "received", "cancelled"],
      default: "draft",
    },
    items: {
      type: [PurchaseOrderItemSchema], 
      required: true,
      validate: {
        validator: function (v: any[]) {
          return v.length > 0;
        },
        message: "Purchase order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } 
);



PurchaseOrderSchema.index(
  { orderNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

// ✅ Zod validation schemas
export const purchaseOrderItemZodSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().nonnegative(),
});


export const purchaseOrderZodSchema = z.object({
  ...commonSchemaValidation,
  orderNumber: z.string().optional(),
  poReference: z.string().optional(),
  supplier: z.union([
    z.string(),
    z.object({ _id: z.string() }).passthrough()
  ]).transform((val) => (typeof val === 'string' ? val : val._id)),
  orderDate: z.coerce
    .date()
    .optional()
    .default(() => new Date()),
  expectedDelivery: z.coerce.date(),
  status: z
    .enum(["draft", "pending", "approved", "ordered", "received", "cancelled"])
    .default("draft"),
  items: z
    .array(purchaseOrderItemZodSchema)
    .min(1, "At least one item is required"),
  subtotal: z.number().nonnegative("Subtotal must be non-negative"),
  tax: z.number().nonnegative("Tax must be non-negative"),
  total: z.number().nonnegative("Total must be non-negative"),
  notes: z.string().optional(),
});