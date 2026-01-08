
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketReferenceTypes } from "../../../../common/Ticket-management-system/ITicket.reference.types.interface";

import { ticketReferenceTypeSchema } from "../../schemas/ticket-management-system-schemas/ticket.reference.types.schema";

export type ticketReferenceTypeDoc = ITicketReferenceTypes<Types.ObjectId> & Document;
const ticketReferenceTypeDbSchema = new Schema<ticketReferenceTypeDoc>({
    ...ticketReferenceTypeSchema
}, { timestamps: true });


export const TicketReferenceTypes: Model<ticketReferenceTypeDoc> = model<ticketReferenceTypeDoc>("TicketReferenceTypes", ticketReferenceTypeDbSchema);
