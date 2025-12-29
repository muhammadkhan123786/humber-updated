
import { Document, Model, model, Schema, Types } from "mongoose";

import { ICustomerBase } from "../../../common/ICustomerSharedInterface";


export type CityModelDoc = ICustomerBase<Types.ObjectId, Types.ObjectId> & Document;

const cityModelSchema = new Schema<CityModelDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    customerType: {},

    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });


export const CityModel: Model<CityModelDoc> = model<CityModelDoc>("CityModel", cityModelSchema);
