import { z } from "zod";
import {
  commonSchema,
  commonSchemaValidation,
} from "../../shared/common.schema";

export const eventActionSchema = {
  eventKey: { type: String },
  name: { type: String },
  description: { type: String },
  ...commonSchema,
};

export const eventActionValidation = z.object({
  eventKey: z.string().min(1, "Please enter event key."),
  name: z.string().min(1, "Please enter event name."),
  description: z.string().min(1, "Please enter description."),
  ...commonSchemaValidation,
});
