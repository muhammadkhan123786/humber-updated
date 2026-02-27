
import { Document, Model, model, Schema, Types } from "mongoose";

import { IRiderAvailabilities } from "../../../../common/master-interfaces/IRider.availbility.interface";

import { riderAvailabilitiesSchema } from "../../schemas/master-data/rider.availabilities.schema";

export type riderAvailabilitiesDoc = IRiderAvailabilities<Types.ObjectId> & Document;

const riderAvailabilitiesDbSchema = new Schema<riderAvailabilitiesDoc>({

    ...riderAvailabilitiesSchema

}, { timestamps: true });


export const riderAvailabilities: Model<riderAvailabilitiesDoc> = model<riderAvailabilitiesDoc>("riderAvailabilities", riderAvailabilitiesDbSchema);
