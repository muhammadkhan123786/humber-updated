import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const riderAvailabilitiesSchema = {
    name: { type: String },
    fromTime: { type: String },
    toTime:{type:String},
    ...commonSchema,
};


const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const riderAvailabilitiesValidation = z
  .object({
    name: z.string().min(1, "Rider availability name is required"),

    fromTime: z
      .string()
      .regex(timeRegex, "fromTime must be in HH:mm 24-hour format"),

    toTime: z
      .string()
      .regex(timeRegex, "toTime must be in HH:mm 24-hour format"),

    ...commonSchemaValidation,
  })
  .refine(
    (data) => data.fromTime < data.toTime,
    {
      message: "fromTime must be earlier than toTime",
      path: ["toTime"],
    }
  );