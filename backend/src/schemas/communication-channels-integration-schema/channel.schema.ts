import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const channelSchema = {
    channelName: { type: String },
    ...commonSchema,
};

export const channelValidation = z.object({
  channelName: z.string().min(1, "Please enter channel name."),
  ...commonSchemaValidation,
});

