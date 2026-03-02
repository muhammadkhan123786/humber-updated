
import { Document, Model, model, Schema, Types } from "mongoose";

import { IRiderBasicInformation } from "../../../../common/riders-management-interfaces/rider-basic-information-interface/rider.basic.information.interface";

import { riderSchema } from "../../schemas/rider-schemas/rider.schema";

export type riderDoc = IRiderBasicInformation<
Types.ObjectId,
Types.ObjectId,
Types.ObjectId,
Types.ObjectId,
Types.ObjectId,
Types.ObjectId,
Types.ObjectId,
Types.ObjectId[],
Types.ObjectId[]> & Document;

const riderDbSchema = new Schema<riderDoc>({

    ...riderSchema

}, { timestamps: true });


export const Riders: Model<riderDoc> = model<riderDoc>("Riders", riderDbSchema);
