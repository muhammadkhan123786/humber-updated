
import { Document, Model, model, Schema, Types } from "mongoose";

import { ILABOURCOST } from "../../../../common/master-interfaces/ILabour.interface";

import { labourSchema } from "../../schemas/master-data/labour.cost.schema";

export type partsDoc = ILABOURCOST<Types.ObjectId> & Document;

const partSchema = new Schema<partsDoc>({

    ...labourSchema

}, { timestamps: true });


export const Parts: Model<partsDoc> = model<partsDoc>("Parts", partSchema);
