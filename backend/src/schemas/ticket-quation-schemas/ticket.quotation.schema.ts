import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdSchema } from "../../validators/objectId.schema";

export const ticketQuotationSchema = {
    ticketId: {
        type: Types.ObjectId,
        ref: "customerTicketBase",
        index: true,
        required: true,
    },

    quotationStatusId: {
        type: Types.ObjectId,
        ref: "TicketQuotationStatus",
        index: true,
        required: true,
    },

    partsList: [
        { type: Types.ObjectId, ref: "Parts" }
    ],

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



export const ticketQuotationValidation = z.object({
    ticketId: objectIdSchema,
    quotationStatusId: objectIdSchema,

    partsList: z.array(objectIdSchema).optional(),

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
