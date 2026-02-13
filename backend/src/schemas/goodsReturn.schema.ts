import { Schema, SchemaDefinition } from "mongoose";
import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";
import { generateNextDocumentNumber } from "../services/documentNumber.service"
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

export const GoodsReturnSchema = new Schema( {
  ...commonSchema,
  grtnNumber: { type: String},
  returnReference: { type: String },
  grnId: { type: Schema.Types.ObjectId, ref: "grn", required: true },
  returnedBy: { type: String, required: true },
  returnReason: { type: String, required: true },
  returnDate: {
    type: Date,
    default: Date.now, 
  },
  items: [GoodsReturnItemSchema],
  notes: String,
});

GoodsReturnSchema.pre("save", async function (this: any) {
  if (this.isNew) {
    if (!this.grtnNumber) {
      this.grtnNumber = await generateNextDocumentNumber("GOODS_RETURN", this.constructor);
    }

    if (!this.returnReference) {
      this.returnReference = await generateNextDocumentNumber("GOODS_RETURN_REFERENCE", this.constructor);
    }
  }
});

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
  grtnNumber: z.string().optional(),
  returnReference: z.string().optional(),
  grnId: z.string(),
  returnedBy: z.string().min(2),
  returnReason: z.string().min(2),
  returnDate: z.coerce.date().optional(),
  items: z.array(GoodsReturnItemValidation).min(1),
  notes: z.string().optional(),
});
