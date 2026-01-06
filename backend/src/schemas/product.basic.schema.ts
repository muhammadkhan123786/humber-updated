import { z } from "zod";
import { Types } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";


export const productBasicSchema = {
    ...commonSchema,

    productName: { type: String, required: true },

    SKU: { type: String, unique: true, sparse: true },

    productDes: { type: String },

    brandId: { type: Types.ObjectId, ref: "VechicleBrand" },

    categoryId: {
        type: Types.ObjectId,
        ref: "Category",
        required: true
    },

    MPN: { type: String },

    upcEan: { type: String },

    taxId: { type: Types.ObjectId, ref: "Tax" },

    currencyId: { type: Types.ObjectId, ref: "Currency" },

    warrantyDuration: { type: Number, min: 0 },

    returnPeriods: { type: Number, min: 0 },

    vendorId: { type: Types.ObjectId, ref: "Vendor" },

    leadTime: { type: Number, min: 0 },

    stock: { type: Number, default: 0, min: 0 },

    channelIds: {
        type: [Types.ObjectId],
        ref: "Channel",
        default: []
    }
};


export const productBasicSchemaValidation = z.object({
    productName: z.string().min(1, "Product name is required"),
    SKU: z.string().optional(),
    productDes: z.string().optional(),

    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

    MPN: z.string().optional(),
    upcEan: z.string().optional(),

    taxId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Tax ID").optional(),
    currencyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid currency ID").optional(),

    warrantyDuration: z.number().int().nonnegative().optional(),
    returnPeriods: z.number().int().nonnegative().optional(),

    vendorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid vendor ID").optional(),

    leadTime: z.number().int().nonnegative().optional(), // days
    stock: z.number().int().nonnegative().optional(),

    channelIds: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid channel ID"))
        .default([]),
    brandId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Brand Id").optional(),
    ...commonSchemaValidation
});

