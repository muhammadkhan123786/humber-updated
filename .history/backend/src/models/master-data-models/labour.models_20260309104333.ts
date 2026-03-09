
import { Document, Model, model, Schema, Types } from "mongoose";

import { ts } from "../../../../common/master-interfaces/ILabour.interface";

import { partsSchema } from "../../schemas/master-data/parts.schema";

export type partsDoc = IParts<Types.ObjectId> & Document;

const partSchema = new Schema<partsDoc>({

    ...partsSchema

}, { timestamps: true });


export const Parts: Model<partsDoc> = model<partsDoc>("Parts", partSchema);
