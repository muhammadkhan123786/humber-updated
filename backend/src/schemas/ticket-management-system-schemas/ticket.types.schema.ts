import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { ITicketType } from '../../../../common/Ticket-management-system/ITicketType.interface'
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const ticketTypeSchema: SchemaDefinition<ITicketType<Types.ObjectId, Types.ObjectId>> = {
    ...commonSchema,
    code: { type: String, required: true, unique: true },
    label: { type: String },
}

export const ticketTypeSchemaValidation = z.object({
    ...commonSchemaValidation,
    code: z
        .string()
        .trim()
        .min(1, "Enter code please")
        .transform(v => v.toUpperCase()),
    label: z.string().optional(),
});


