
import { Document, Model, model, Schema, Types } from "mongoose";

import { ILABOURCOST } from "../../../../common/master-interfaces/ILabour.interface";

import { labourSchema } from "../../schemas/master-data/labour.cost.schema";

export type labourDoc = ILABOURCOST<Types.ObjectId> & Document;

const labourdbSchema = new Schema<labourDoc>({

    ...labourSchema

}, { timestamps: true });


export const Labour: Model<labourDoc> = model<labourDoc>("Parts", labourdbSchema);
