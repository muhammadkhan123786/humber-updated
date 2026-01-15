import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { ITicketReferenceTypes } from '../../../../common/Ticket-management-system/ITicket.reference.types.interface'
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const ticketReferenceTypeSchema = {
    ...commonSchema,
    code: { type: String },
    label: { type: String }
}

export const ticketReferenceTypeSchemaValidation = z.object({
    ...commonSchemaValidation,
    code: z
        .string()
        .trim()
        .min(1, "Enter ticker reference code please")
        .transform(v => v.toUpperCase()),
    label: z.string().optional(),

});


