
import { Document, Model, model, Schema, Types } from "mongoose";

import { IDomesticCustomer } from "../../../common/ICustomerSharedInterface";
import { baseCustomerSchema } from '../schemas/base.customer.schema';


export type DomesticCustomerDoc = IDomesticCustomer<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;

const domesticCustomerSchema = new Schema<DomesticCustomerDoc>({
    ...baseCustomerSchema,
    customerType: { type: String, default: "domestic" }

}, { timestamps: true });


export const DomesticCustomer: Model<DomesticCustomerDoc> = model<DomesticCustomerDoc>("DomesticCustomer", domesticCustomerSchema);
