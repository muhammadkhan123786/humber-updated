import { Document, Model, model, Schema, Types } from "mongoose";

import { CustomerTicketStatusManager } from "../../../../common/Ticket-management-system/ICustomer.Ticket.Status.Manager.interface";

import { CustomerTicketStatusManagerSchema } from "../../schemas/ticket-management-system-schemas/customert.ticket.status.managet.schema";

export type CustomerTicketStatusManagerDoc = CustomerTicketStatusManager<Types.ObjectId, Types.ObjectId, Types.ObjectId> &
    Document;

const CustomerTicketStatusManagerDocDbSchema = new Schema<CustomerTicketStatusManagerDoc>(
    {
        ...CustomerTicketStatusManagerSchema,
    },
    { timestamps: true }
);


export const CustomerTicketStatus: Model<CustomerTicketStatusManagerDoc> =
    model<CustomerTicketStatusManagerDoc>(
        "CustomerTicketStatus",
        CustomerTicketStatusManagerDocDbSchema
    );

