import { Document, Model, model, Schema, Types } from "mongoose";
import { ICustomerSharedInterface } from "../../../common/ICustomerSharedInterface";

export type CustomPersonalInfoDoc = ICustomerSharedInterface<Types.ObjectId> & Document;

const CustomPersonalInfoSchema = new Schema<CustomPersonalInfoDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String },
    mobileNumber: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const CustomPersonalInfo: Model<CustomPersonalInfoDoc> = model<CustomPersonalInfoDoc>("CustomPersonalInfo", CustomPersonalInfoSchema);
