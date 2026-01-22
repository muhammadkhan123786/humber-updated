import { Document, Model, model, Schema, Types } from "mongoose";
import { ICustomerBase } from "../../../common/ICustomerSharedInterface";
import { baseCustomerSchema } from "../schemas/base.customer.schema";

export type CustomerBaseDoc = ICustomerBase<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;

const CustomerBaseSchema = new Schema<CustomerBaseDoc>({
    ...baseCustomerSchema,
}, { timestamps: true });

export const CustomerBase: Model<CustomerBaseDoc> = model<CustomerBaseDoc>("CustomerBase", CustomerBaseSchema);

const domesticCutomer = new Schema({});

const corporateCustomer = new Schema({
    companyName: String,
    registrationNo: String,
    vatNo: String,
    website: String,
});

CustomerBaseSchema.index({
    ticketStatusId: 1,
    assignedTechnicianId: 1,
    isDeleted: 1
});



export const domesticCutomerSchema = CustomerBase.discriminator("domestic", domesticCutomer);
export const corporateCustomerSchema = CustomerBase.discriminator("corporate", corporateCustomer);
