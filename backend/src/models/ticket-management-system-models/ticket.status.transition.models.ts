
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketStatusTransitions } from "../../../../common/Ticket-management-system/ITicket.status.transition.interface";

import { ticketStatusTransitionSchema } from "../../schemas/ticket-management-system-schemas/ticket.status.transition.schema";


export type ticketStatusTransitionDoc = ITicketStatusTransitions<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;

const ticketStatusTransitionDbSchema = new Schema<ticketStatusTransitionDoc>({
    ...ticketStatusTransitionSchema
}, { timestamps: true });


ticketStatusTransitionDbSchema.index({ from_status_id: 1, action_id: 1, ticket_type_id: 1 },
    { unique: true });



export const TicketStatusTransition: Model<ticketStatusTransitionDoc> = model<ticketStatusTransitionDoc>("TicketStatusTransition", ticketStatusTransitionDbSchema);
