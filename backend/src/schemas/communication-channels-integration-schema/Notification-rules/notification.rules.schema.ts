import { z } from "zod";
import {
  commonSchema,
  commonSchemaValidation,
} from "../../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../../validators/objectId.schema";

export const notificationRulesSchema = {

  autoRuleId: {
    type: String
  },

  notificationRulesName: {
    type: String,
    required: true
  },

  eventKeyId: {
    type: Types.ObjectId,
    ref: "EventActions",
    required: true
  },

  channels: [
    {
      channelId: {
        type: Types.ObjectId,
        ref: "communicationChannels",
        required: true
      },

      templateId: {
        type: Types.ObjectId,
        ref: "NotificationTemplates",
        required: true
      }
    }
  ],

  recipients: [
    {
      type: String
    }
  ],

  conditions: {
    type: String
  },

  priority: {
    type: Number,
    default: 1
  },

  isActive: {
    type: Boolean,
    default: true
  },

  ...commonSchema
};



export const notificationRulesValidation = z.object({

  autoRuleId: z.string().optional(),

  notificationRulesName: z
    .string()
    .min(1, "Please enter notification rule name."),

  eventKeyId: objectIdOrStringSchema,

  channels: z.array(

    z.object({
      channelId: objectIdOrStringSchema,
      templateId: objectIdOrStringSchema
    })

  ).min(1, "Select at least one channel"),

  recipients: z
    .array(z.string())
    .min(1, "Select at least one recipient"),

  conditions: z.string().optional(),

  priority: z.number().optional().default(1),

  isActive: z.boolean().optional().default(true),

  ...commonSchemaValidation
});