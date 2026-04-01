import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const callTypeSchema = {
    callTypeName: { type: String },
    ...commonSchema,
};

export const callTypeValidation = z.object({
    callTypeName: z.string().min(1, "Please enter call type name."),
    ...commonSchemaValidation,
});
