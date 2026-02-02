import { Schema, SchemaDefinition, Types } from "mongoose";
import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";

export const GoodsReturnItemSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "all",
        "pending",
        "approved",
        "in-transit",
        "completed",
        "rejected",
      ],
      default: "pending",
    },
    returnQty: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    itemsNotes: String,
  },
  { _id: false },
);

export const GoodsReturnSchema: SchemaDefinition = {
  ...commonSchema,
  grnId: { type: Schema.Types.ObjectId, ref: "grns", required: true },
  returnedBy: { type: String, required: true },
  returnReason: { type: String, required: true },
  items: [GoodsReturnItemSchema],
  notes: String,
};

// schemas/goodsReturn.validation.ts

export const GoodsReturnItemValidation = z.object({
  status: z
    .enum(["all", "pending", "approved", "in-transit", "completed", "rejected"])
    .optional(),
   returnQty: z.number().min(1),
  totalAmount: z.number().min(0),
  itemsNotes: z.string().optional(),
});

export const CreateGoodsReturnValidation = z.object({
  ...commonSchemaValidation,
  grnId: z.string(),
  returnedBy: z.string().min(2),
  returnReason: z.string().min(2),
  items: z.array(GoodsReturnItemValidation).min(1),
  notes: z.string().optional(),
});
