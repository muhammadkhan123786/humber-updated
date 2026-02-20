import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Schema, Types } from "mongoose";
import { objectIdSchema } from "../../validators/objectId.schema";
export const QUOTATION_STATUS = [
    "SENT TO ADMIN",
    "DRAFTED",
    "SEND TO CUSTOMER",
    "SEND TO INSURANCE",
    "APPROVED",
    "REJECTED"
] as const;

const quotationPartItemSchema = new Schema({
    partId: { type: Types.ObjectId, ref: "Parts", required: true },
    partName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
}, { _id: false }); // set _id: false to avoid creating subdocument _id automatically
//export type QuotationStatuses = typeof QUOTATION_STATUS[number];

export const ticketQuotationSchema = {
    ticketId: {
        type: Types.ObjectId,
        ref: "customerTicketBase",
        index: true,
        required: true,
    },
    quotationStatusId: {
        type: String,
        enum: QUOTATION_STATUS,
        required: true,
        default: QUOTATION_STATUS[0],
    },
    partsList: {
        type: [quotationPartItemSchema],
        default: [],
    },

    labourTime: { type: Number, default: 0 },
    labourRate: { type: Number, default: 0 },

    aditionalNotes: { type: String },

    validityDate: { type: Date, default: Date.now },

    technicianId: {
        type: Types.ObjectId,
        ref: "Technicians",
        index: true,
        required: true,
    },

    partTotalBill: { type: Number, default: 0 },
    labourTotalBill: { type: Number, default: 0 },
    subTotalBill: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    netTotal: { type: Number, default: 0 },

    quotationAutoId: { type: String, unique: true },

    ...commonSchema,
};

const quotationPartItemZod = z.object({
    partId: objectIdSchema,

    partName: z.string().min(1),

    quantity: z.number().min(1),

    unitPrice: z.number().min(0),

    discount: z.number().min(0).optional().default(0),

    total: z.number().min(0),
});
export const ticketQuotationValidation = z.object({
    ticketId: objectIdSchema,
    quotationStatusId: z.enum(["SENT TO ADMIN", "DRAFTED", "SEND TO CUSTOMER", "SEND TO INSURANCE", "APPROVED", "REJECTED"]).default("SENT TO ADMIN"),
    partsList: z.array(quotationPartItemZod).optional(),

    labourTime: z.number().optional(),
    labourRate: z.number().optional(),

    aditionalNotes: z.string().optional(),

    validityDate: z.coerce.date().optional(),

    technicianId: objectIdSchema,

    partTotalBill: z.number().optional(),
    labourTotalBill: z.number().optional(),
    subTotalBill: z.number().optional(),
    taxAmount: z.number().optional(),
    netTotal: z.number().optional(),

    quotationAutoId: z.string().optional(),

    ...commonSchemaValidation,
});
