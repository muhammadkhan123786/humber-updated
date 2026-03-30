import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

export const channelProviderSchema = {
    providerName: { type: String },
    channelId:{type:Types.ObjectId,ref:"communicationChannels"},
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false }
};

export const channelProviderValidation = z.object({
  providerName: z.string().min(1, "Please enter provider name."),
  channelId:objectIdOrStringSchema,
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isDefault: z.boolean().optional()
});

