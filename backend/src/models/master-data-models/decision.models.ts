
import { Document, Model, model, Schema, Types } from "mongoose";

import { IDecision } from "../../../../common/master-interfaces/IDecision.interface";

import { ticketDecisionSchema } from "../../schemas/master-data/ticket.decision.schema";

export type decisionDoc = IDecision<Types.ObjectId> & Document;

const decisionSchema = new Schema<decisionDoc>({

    ...ticketDecisionSchema

}, { timestamps: true });


export const TicketDecision: Model<decisionDoc> = model<decisionDoc>("TicketDecision", decisionSchema);
