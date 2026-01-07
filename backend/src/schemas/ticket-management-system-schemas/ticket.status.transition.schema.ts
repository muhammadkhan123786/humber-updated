import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { ITicketStatusTransitions } from "../../../../common/Ticket-management-system/ITicket.status.transition.interface";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";



export const ticketStatusTransitionSchema: SchemaDefinition<
    ITicketStatusTransitions<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId>
> = {
    ...commonSchema,
    from_status_id: { type: Types.ObjectId, ref: "TicketStatus", required: true },
    to_status_id: { type: Types.ObjectId, ref: "TicketStatus", required: true },
    action_id: { type: Types.ObjectId, ref: "TicketActions", required: true },
    ticket_type_id: { type: Types.ObjectId, ref: "TicketTypes", required: true },
    description: { type: String }

};


export const ticketStatusTransitionSchemaValidation = z.object({
    ...commonSchemaValidation,
    from_status_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid from status ID"),
    to_status_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid to status ID"),
    action_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid action ID"),
    ticket_type_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ticket type ID"),
    description: z.string().optional()

});
