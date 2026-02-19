
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketQuotation } from "../../../../common/ticket-quations-interfaces/quotation.interface";

import { ticketQuotationSchema } from "../../schemas/ticket-quation-schemas/ticket.quotation.schema";

export type ticketQuatationDoc = ITicketQuotation<Types.ObjectId, Types.ObjectId, Types.ObjectId[], Types.ObjectId, Date> & Document;

const ticketQuotationDbSchema = new Schema<ticketQuatationDoc>({

    ...ticketQuotationSchema

}, { timestamps: true });


export const TicketQuations: Model<ticketQuatationDoc> = model<ticketQuatationDoc>("TicketQuations", ticketQuotationDbSchema);
