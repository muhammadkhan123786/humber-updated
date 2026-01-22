import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const contractTypeSchema = {
  contractType: { type: String },
  ...commonSchema,
};

export const contractTypeSchemaValidation = z.object({
  contractType: z.string().min(1, "Contract type name is required"),
  ...commonSchemaValidation,
});
