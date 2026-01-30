import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const insuranceCompanySchema = {
    insuranceCompanyName: { type: String },
    ...commonSchema,
};

export const insuranceCompanyValidation = z.object({
    insuranceCompanyName: z.string().min(1, "Please enter insurance company name."),
    ...commonSchemaValidation,
});
