import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const callStatusSchema = {
    callStatus: { type: String },
    ...commonSchema,
};

export const callStatusValidation = z.object({
    callStatus: z.string().min(1, "Please enter call status name."),
    ...commonSchemaValidation,
});
