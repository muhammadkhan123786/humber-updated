import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const riderAvailabilitiesSchema = {
  name: { type: String },
  fromTime: { type: String },
  toTime: { type: String },
  ...commonSchema,
};

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// 1. Define the Raw Object Schema (No refinements here)
// Your Controller will use this for PUT/PATCH updates
export const riderAvailabilitiesBaseSchema = z.object({
  name: z.string().min(1, "Rider availability name is required"),
  fromTime: z
    .string()
    .regex(timeRegex, "fromTime must be in HH:mm 24-hour format"),
  toTime: z.string().regex(timeRegex, "toTime must be in HH:mm 24-hour format"),
  ...commonSchemaValidation,
});

// 2. Define the Validation Schema (With refinements)
// Use this for POST (creation) or manual validation
export const riderAvailabilitiesValidation =
  riderAvailabilitiesBaseSchema.refine(
    (data) => {
      // Only run logic if both times exist (important for partial updates)
      if (data.fromTime && data.toTime) {
        return data.fromTime < data.toTime;
      }
      return true;
    },
    {
      message: "fromTime must be earlier than toTime",
      path: ["toTime"],
    },
  );
