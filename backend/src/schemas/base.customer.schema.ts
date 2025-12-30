import { Types } from "mongoose";
import { z } from 'zod';

export const baseCustomerSchema = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    personId: { type: Types.ObjectId, ref: "Person" },
    addressId: { type: Types.ObjectId, ref: "Address" },
    contactId: { type: Types.ObjectId, ref: "Contact" },
    sourceId: { type: Types.ObjectId, ref: "CustomerSourceModel" },
    customerType: { type: String, required: true, enum: ["domestic", "corporate"] },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}

