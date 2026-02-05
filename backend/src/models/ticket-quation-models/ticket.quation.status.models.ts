
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITicketQuationStatus } from "../../../../common/ticket-quations-interfaces/quation.status.interface";

import { ticketQuationStatusSchema } from "../../schemas/ticket-quation-schemas/ticket.quation.status.schema";

export type ticketQuatationStatusDoc = ITicketQuationStatus<Types.ObjectId> & Document;

const ticketQuotationDbSchema = new Schema<ticketQuatationStatusDoc>({

    ...ticketQuationStatusSchema

}, { timestamps: true });


export const TicketQuationStatus: Model<ticketQuatationStatusDoc> = model<ticketQuatationStatusDoc>("TicketQuationStatus", ticketQuotationDbSchema);
