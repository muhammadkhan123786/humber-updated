import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { ITicketStatus } from "../../../../common/Ticket-management-system/ITicketStatus.interface";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const ticketStatusSchema: SchemaDefinition<
  ITicketStatus<Types.ObjectId>
> = {
  ...commonSchema,
  code: { type: String, required: true, unique: true },
  label: { type: String },
  is_Terminal: { type: Boolean, required: true },
};

export const ticketStatusSchemaValidation = z.object({
  ...commonSchemaValidation,
  code: z
    .string()
    .trim()
    .min(1, "Enter code please")
    .transform((v) => v.toUpperCase()),
  label: z.string().optional(),
  is_Terminal: z.boolean().default(false),
});
