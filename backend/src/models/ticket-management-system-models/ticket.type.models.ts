
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketType } from "../../../../common/Ticket-management-system/ITicketType.interface";

import { ticketTypeSchema } from "../../schemas/ticket-management-system-schemas/ticket.types.schema";

export type ticketTypeDoc = ITicketType<Types.ObjectId, Types.ObjectId> & Document;
const ticketTypeDocDbSchema = new Schema<ticketTypeDoc>({
    ...ticketTypeSchema
}, { timestamps: true });


export const TicketTypes: Model<ticketTypeDoc> = model<ticketTypeDoc>("TicketTypes", ticketTypeDocDbSchema);
