
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketActions } from "../../../../common/Ticket-management-system/ITicketActions.interface";

import { ticketActionsSchema } from "../../schemas/ticket-management-system-schemas/ticket.actions.schema";

export type ticketActionsDoc = ITicketActions<Types.ObjectId> & Document;
const ticketActionsDocDbSchema = new Schema<ticketActionsDoc>({
    ...ticketActionsSchema
}, { timestamps: true });


export const TicketActions: Model<ticketActionsDoc> = model<ticketActionsDoc>("TicketActions", ticketActionsDocDbSchema);
