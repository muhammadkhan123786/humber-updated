import { Types } from "mongoose";


export const baseCustomerSchema = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    personId: { type: Types.ObjectId, ref: "Person" },
    addressId: { type: Types.ObjectId, ref: "Address" },
    contactId: { type: Types.ObjectId, ref: "Contact" },
    sourceId: { type: Types.ObjectId, ref: "CustomerSourceModel" },
    accountId: { type: Types.ObjectId, ref: "User" },
    previousCustomerId: { type: Types.ObjectId, ref: "CustomerBase", default: null },
    convertedToCustomerId: { type: Types.ObjectId, ref: "CustomerBase", default: null },
    customerType: { type: String, required: true, enum: ["domestic", "corporate"] },
    convertedAt: { type: Date },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}

