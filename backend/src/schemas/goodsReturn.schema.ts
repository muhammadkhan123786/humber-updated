import { Schema, SchemaDefinition } from "mongoose";
import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";


export const GoodsReturnItemSchema = new Schema(
  {
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    receivedQuantity: { type: Number, required: true },
    returnQuantity: { type: Number, required: true },
    returnReason: { type: String, required: true },
    condition: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    notes: String,
  },
  { _id: false }
);

export const GoodsReturnSchema: SchemaDefinition = {
    ...commonSchema,
  grnNumber: { type: String, required: true },
  grnReference: { type: String, required: true },
  returnNumber: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  returnDate: { type: Date, required: true },
  returnedBy: { type: String, required: true },
  status: {
    type: String,
    enum: ["all", "pending", "approved", "in-transit", "completed", "rejected"],
    default: "pending",
  },
  returnReason: { type: String, required: true },
  items: [GoodsReturnItemSchema],
  totalAmount: { type: Number, required: true },
  notes: String,
};


// schemas/goodsReturn.validation.ts


export const GoodsReturnItemValidation = z.object({
  productName: z.string(),
  sku: z.string(),
  receivedQuantity: z.number().min(0),
  returnQuantity: z.number().min(0),
  returnReason: z.string().min(2),
  condition: z.string().min(2),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  notes: z.string().optional(),
}).refine((item) => item.returnQuantity <= item.receivedQuantity, {
  message: "Return quantity cannot exceed received quantity",
});

export const CreateGoodsReturnValidation = z.object({
    ...commonSchemaValidation,
  grnNumber: z.string(),
  grnReference: z.string(),
  returnNumber: z.string(),
  supplier: z.string(),
  returnDate: z.coerce.date(),
  returnedBy: z.string().min(2),
  status: z.enum(["all", "pending", "approved", "in-transit", "completed", "rejected"]).optional(),
  returnReason: z.string().min(2),
  items: z.array(GoodsReturnItemValidation).min(1),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
});
