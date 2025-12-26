import { Document, Model, model, Schema, Types } from "mongoose";
import { ISubServicesInterface } from "../../../common/ISubServices.interface";

export type SubServicesDoc = ISubServicesInterface<Types.ObjectId, Types.ObjectId> & Document;

const SubServicesModelSchema = new Schema<SubServicesDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    masterServiceId: {
        type: Types.ObjectId, ref: "ServiceTypeMaster", required: true
    },
    subServiceName: { type: String, required: true },
    cost: { type: Number },
    notes: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const SubServices: Model<SubServicesDoc> = model<SubServicesDoc>("SubServices", SubServicesModelSchema);
