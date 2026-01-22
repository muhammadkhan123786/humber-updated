import { Document, Model, model, Schema, Types } from "mongoose";

import { CustomerTicketBase } from "../../../../common/Ticket-management-system/ITicket.interface";

import { customerTicketBaseSchema } from "../../schemas/ticket-management-system-schemas/ticket.base.schema";

export type customerTicketBaseDoc = CustomerTicketBase<
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId[]
> &
  Document;

const customerTicketBaseDbSchema = new Schema<customerTicketBaseDoc>(
  {
    ...customerTicketBaseSchema,
  },
  { timestamps: true }
);

export const customerTicketBase: Model<customerTicketBaseDoc> =
  model<customerTicketBaseDoc>(
    "customerTicketBase",
    customerTicketBaseDbSchema
  );
