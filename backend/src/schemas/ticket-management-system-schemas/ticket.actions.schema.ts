import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { ITicketActions } from '../../../../common/Ticket-management-system/ITicketActions.interface'
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const ticketActionsSchema = {
    ...commonSchema,
    code: { type: String, required: true, unique: true },
    label: { type: String },
}

export const ticketActionsSchemaValidation = z.object({
    ...commonSchemaValidation,
    code: z
        .string()
        .trim()
        .min(1, "Enter ticket actions code please")
        .transform(v => v.toUpperCase()),
    label: z.string().optional(),

});


