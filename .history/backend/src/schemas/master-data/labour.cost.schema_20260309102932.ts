import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const labourSchema = {
    Name: { type: String },
    value:{type:Number},
    ...commonSchema,
};

export const insuranceCompanyValidation = z.object({
    Name: z.string().min(1, "Please enter any name."),
    value:z.number().nonnegative()
    ...commonSchemaValidation,
});
