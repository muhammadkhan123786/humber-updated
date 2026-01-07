
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketStatus } from "../../../../common/Ticket-management-system/ITicketStatus.interface";

import { ticketStatusSchema } from "../../schemas/ticket-management-system-schemas/ticket.status.schema";


export type ticketStatusDoc = ITicketStatus<Types.ObjectId> & Document;
const ticketStatusDocDbSchema = new Schema<ticketStatusDoc>({
    ...ticketStatusSchema
}, { timestamps: true });


export const TicketStatus: Model<ticketStatusDoc> = model<ticketStatusDoc>("TicketStatus", ticketStatusDocDbSchema);
