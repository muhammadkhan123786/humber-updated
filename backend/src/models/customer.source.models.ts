import { Document, Model, model, Schema, Types } from "mongoose";
import { ICustomerSource } from "../../../common/ICustomerSource";

export type customerSourceDoc = ICustomerSource<Types.ObjectId> & Document;

const customerSourceSchema = new Schema<customerSourceDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
    customerSource: { type: String, required: true }
}, { timestamps: true });

export const CustomerSourceModel: Model<customerSourceDoc> = model<customerSourceDoc>("CustomerSourceModel", customerSourceSchema);
