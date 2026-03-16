import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../../validators/objectId.schema";



export const notificationTemplateSchema = {
  eventKeyId: {
    type: Types.ObjectId,
    ref: "EventActions",
    required: true
  },

  channelId: {
    type: Types.ObjectId,
    ref: "communicationChannelsProvider",
    required: true
  },

  subject: {
    type: String
  },

  templateBody: {
    type: String,
    required: true
  },

  ...commonSchema
};

export const notificationTemplateValidation = z.object({

  eventKeyId: objectIdOrStringSchema,

  channelId: objectIdOrStringSchema,

  subject: z.string().optional(),

  templateBody: z
    .string()
    .min(1, "Template body is required"),

  ...commonSchemaValidation

});

