
import { Document, Model, model, Schema, Types } from "mongoose";

import { ICorporateCustomer } from "../../../common/ICustomerSharedInterface";

import { baseCustomerSchema } from '../schemas/base.customer.schema';

export type CorporateCustomerDoc = ICorporateCustomer<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;

const corporateCustomerSchema = new Schema<CorporateCustomerDoc>({
    ...baseCustomerSchema,
    customerType: { type: String, default: "corporate" }

}, { timestamps: true });


export const CorporateCustomer: Model<CorporateCustomerDoc> = model<CorporateCustomerDoc>("CorporateCustomer", corporateCustomerSchema);
