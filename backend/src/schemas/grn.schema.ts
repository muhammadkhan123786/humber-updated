
import { string, z } from "zod";
import { Schema, SchemaDefinition } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";


export const GRNItemSchema = new Schema(
  {
    purchaseOrderItemId: { type: String, required: true },

    productName: String,
    sku: String,

    orderedQuantity: Number,

    receivedQuantity: { type: Number, required: true },
    acceptedQuantity: { type: Number, required: true },
    rejectedQuantity: { type: Number, required: true },
    damageQuantity: { type: Number, required: true },

    condition: {
      type: String,
      enum: ['good', 'damaged', 'expired', 'other'],
      required: true
    },

    notes: String
  },
  { _id: false }
);

export const GoodsReceivedSchema = new Schema(
  {
    grnNumber: { type: String, required: true, unique: true },

    purchaseOrderId: { type: String, required: true },
    purchaseOrderNumber: String,

    supplierId: String,
    supplierName: String,

    receivedDate: Date,
    receivedBy: String,

    items: [GRNItemSchema],

    totalOrdered: Number,
    totalReceived: Number,
    totalAccepted: Number,
    totalRejected: Number,

    status: {
      type: String,
      enum: ['draft', 'completed'],
      default: 'draft'
    },

    notes: String,
    signature: String
  },
  { timestamps: true }
);






export const grnItemSchema = z.object({
  purchaseOrderItemId: z.string(),

  receivedQuantity: z.number().min(0),
  acceptedQuantity: z.number().min(0),
  rejectedQuantity: z.number().min(0),
  damageQuantity: z.number().min(0),

  condition: z.enum(['good', 'damaged', 'expired', 'other']),
  notes: z.string().optional()
}).refine(
  (data) =>
    data.acceptedQuantity +
      data.rejectedQuantity +
      data.damageQuantity ===
    data.receivedQuantity,
  {
    message: 'Accepted + Rejected + Damaged must equal Received'
  }
);

export const createGRNValidationsSchema = z.object({
    grnNumber: z.string(),
  purchaseOrderId: z.string(),
  receivedDate: z.coerce.date(),
  receivedBy: z.string().min(2),

  items: z.array(grnItemSchema).min(1),

  notes: z.string().optional(),
  signature: z.string().optional()
});
