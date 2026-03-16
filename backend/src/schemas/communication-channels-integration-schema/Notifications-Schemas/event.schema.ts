import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../../shared/common.schema";

export const eventActionSchema = {
  eventKey: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  module: { type: String },

  variables: {
    type: [
      {
        key: { type: String },
        description: { type: String }
      }
    ],
    default: []
  },

  ...commonSchema
};

export const eventActionValidation = z.object({
  eventKey: z.string().min(1, "Please enter event key."),
  name: z.string().min(1, "Please enter event name."),
  description: z.string().min(1, "Please enter description."),
  module: z.string().optional(),

  variables: z
  .array(
    z.object({
      key: z
        .string()
        .min(1)
        .regex(/^[a-zA-Z0-9_]+$/, "Invalid variable key")
        .transform((val) => val.toLowerCase()),

      description: z.string().min(1)
    })
  )
  .optional()
  .default([]),

  ...commonSchemaValidation
});
