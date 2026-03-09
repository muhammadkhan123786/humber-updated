import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const labourSchema = {
    name: { type: String },
    value:{type:Number},
    ...commonSchema,
};

export const labourValidation = z.object({
  name: z.string().min(1, "Please enter any name."),
  value: z.coerce.number().nonnegative(),
  ...commonSchemaValidation,
});

