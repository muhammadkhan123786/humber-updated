import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { CustomerTicketStatusManager } from '../../../../common/Ticket-management-system/ICustomer.Ticket.Status.Manager.interface'
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const CustomerTicketStatusManagerSchema = {
    ...commonSchema,
    customerTicketId: { type: Types.ObjectId, ref: "customerTicketBase" },
    customerTicketStatusId: { type: Types.ObjectId, ref: "TicketStatus" },
}


export const CustomerTicketStatusManagerSchemaValidation = z.object({
    ...commonSchemaValidation,
    customerTicketId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    customerTicketStatusId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});


