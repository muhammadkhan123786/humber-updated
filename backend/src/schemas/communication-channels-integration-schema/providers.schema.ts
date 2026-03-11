import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

export const channelProviderSchema = {
    providerName: { type: String },
    channelId:{type:Types.ObjectId,ref:"communicationChannels"},
    ...commonSchema,
};

export const channelProviderValidation = z.object({
  providerName: z.string().min(1, "Please enter provider name."),
  channelId:objectIdOrStringSchema,
  ...commonSchemaValidation,
});

