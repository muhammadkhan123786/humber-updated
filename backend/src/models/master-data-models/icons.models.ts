
import { Document, Model, model, Schema, Types } from "mongoose";

import { IIcons } from "../../../../common/master-interfaces/IIcons.interface";

import { iconSchema } from "../../schemas/master-data/icons.schema";

export type iconDoc = IIcons<Types.ObjectId> & Document;

const iconDbSchema = new Schema<iconDoc>({

    ...iconSchema

}, { timestamps: true });


export const Icons: Model<iconDoc> = model<iconDoc>("Icons", iconDbSchema);
