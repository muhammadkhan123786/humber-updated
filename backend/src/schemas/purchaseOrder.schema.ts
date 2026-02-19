import { z } from "zod";
import { Schema, SchemaDefinition, Types } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";
import { generateNextDocumentNumber } from "../services/documentNumber.service";

// ✅ Define the item schema as a Schema instance
export const PurchaseOrderItemSchema = new Schema(
  {
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: true } // Set to false if you don't want _id for subdocuments
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
      type: [PurchaseOrderItemSchema], // ✅ Use the Schema instance
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
  { timestamps: true } // ✅ Add timestamps
);

// // ✅ Now you can use .pre() hook on the Schema instance
// PurchaseOrderSchema.pre("save", async function (this: any) {
//   if (this.isNew) {
//     if (!this.orderNumber) {
//       this.orderNumber = await generateNextDocumentNumber("PO", this.constructor);
//     }

//     if (!this.poReference) {
//       this.poReference = await generateNextDocumentNumber("PO_REFERENCE", this.constructor);
//     }
//   }
// });

PurchaseOrderSchema.index(
  { orderNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

// ✅ Zod validation schemas
export const purchaseOrderItemZodSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().positive("Unit price must be positive"),
  totalPrice: z.number().positive("Total price must be positive"),
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