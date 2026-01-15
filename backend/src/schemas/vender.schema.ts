import { Types } from "mongoose";
import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";

export const venderSchema = {
  // userId: { type: Types.ObjectId, ref: "User", required: true },

  personId: { type: Types.ObjectId, ref: "Person" },
  addressId: { type: Types.ObjectId, ref: "Address" },
  contactId: { type: Types.ObjectId, ref: "Contact" },
  venderType: {
    type: String,
    required: true,
    enum: ["Supplier", "Vendor", "Both"],
  },
  paymentTermId: { type: Types.ObjectId, ref: "paymentTerm" },
  currencyId: { type: Types.ObjectId, ref: "Currency" },
  credit_Limit: { type: Number },
  bank_name: { type: String },
  account_Number: { type: String },
  lead_Time_Days: { type: Number },
  business_name: { type: String },
  website: { type: String },
  ...commonSchema,
};

export const venderSchemaValidation = z.object({
  // userId: z.string().min(1, "userId is required."),

  personId: z.string().min(1, "PersonId is required."),
  addressId: z.string().min(1, "addressId is required."),
  contactId: z.string().min(1, "contactId is required."),
  venderType: z.enum(["Supplier", "Vendor", "Both"]),
  paymentTermId: z.string().min(1, "Payment Id is required."),
  currencyId: z.string().optional(),
  credit_Limit: z.string().optional(),
  bank_name: z.string().optional(),
  account_Number: z.string().optional(),
  lead_Time_Days: z.string().optional(),
  business_name: z.string().optional(),
  website: z.string().optional(),
  ...commonSchemaValidation,
});
