import { string, z } from "zod";
import { Schema, SchemaDefinition } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";

export const GRNItemSchema = new Schema(
  {
    productName: String,
    sku: String,
    orderedQuantity: Number,
    receivedQuantity: { type: Number, required: true },
    acceptedQuantity: { type: Number, required: true },
    rejectedQuantity: { type: Number, required: true },
    damageQuantity: { type: Number, required: true },
    unitPrice: Number,
    condition: {
      type: String,
      enum: ["good", "damaged", "expired", "other"],
      required: true,
    },

    notes: String,
  },
  { _id: false },
);

export const GoodsReceivedSchema = new Schema(
  {
    ...commonSchema,
    grnNumber: { type: String, required: true, unique: true },  
    receivedDate: Date,
    receivedBy: String,
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
    items: [GRNItemSchema],
    notes: String,   
  },
  { timestamps: true },
);

export const grnItemSchema = z
  .object({
        receivedQuantity: z.number().min(0),
    acceptedQuantity: z.number().min(0),
    rejectedQuantity: z.number().min(0),
    damageQuantity: z.number().min(0),
    unitPrice: z.number().min(0),

    condition: z.enum(["good", "damaged", "expired", "other"]),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.acceptedQuantity + data.rejectedQuantity + data.damageQuantity ===
      data.receivedQuantity,
    {
      message: "Accepted + Rejected + Damaged must equal Received",
    },
  );

export const createGRNValidationsSchema = z.object({
  ...commonSchemaValidation,
  grnNumber: z.string(), 
  purchaseOrderId: z.string().min(1, "Purchase Order ID is required"),
  receivedDate: z.coerce.date().optional(),
  receivedBy: z.string().min(2),
  items: z.array(grnItemSchema).min(1),
  notes: z.string().optional(),
});
