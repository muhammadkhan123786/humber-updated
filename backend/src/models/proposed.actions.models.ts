
import { Document, Model, model, Schema, Types } from "mongoose";

import { IProposedActions } from "../../../common/IProposed.actions";

import { proposedActionSchema } from "../schemas/proposed.actions.schema";


export type proposedActionDbDoc = IProposedActions<Types.ObjectId> & Document;
const proposedActionsDbSchema = new Schema<proposedActionDbDoc>({
    ...proposedActionSchema
}, { timestamps: true });


export const ProposedActions: Model<proposedActionDbDoc> = model<proposedActionDbDoc>("ProposedActions", proposedActionsDbSchema);
