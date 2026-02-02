import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const partsSchema = {
    partName: { type: String },
    partNumber: { type: String },
    unitCost: { type: Number },

    ...commonSchema,
};


export const partsSchemaValidation = z.object({
    partName: z.string().min(1, "Part Name is required."),
    partNumber: z.string().optional(),
    unitCost: z.number().int().positive(),
    ...commonSchemaValidation,
});
