import { z } from "zod";
import {
  commonSchema,
  commonSchemaValidation,
} from "../../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../../validators/objectId.schema";

export const notificationRulesSchema = {
  autoRuleId: { type: String },

  notificationRulesName: { type: String },

  eventKeyId: { type: Types.ObjectId, ref: "EventActions" },

  moduleId: { type: Types.ObjectId, ref: "Modules" },

  templateId: {
    type: Types.ObjectId,
    ref: "NotificationTemplates",
    required: true,
  },

  channelIds: [{ type: Types.ObjectId, ref: "communicationChannels" }],

  conditions: { type: String },

  priority: { type: Number, default: 1 },

  ...commonSchema,
};

export const notificationRulesValidation = z.object({
  autoRuleId: z.string().min(1, "Please enter auto rule id."),

  notificationRulesName: z
    .string()
    .min(1, "Please enter notification rule name."),

  eventKeyId: objectIdOrStringSchema,

  moduleId: objectIdOrStringSchema,

  channelIds: z
    .array(objectIdOrStringSchema)
    .min(1, "Select at least one channel"),

  templateId: objectIdOrStringSchema,

  conditions: z.string().optional(),

  priority: z.number().optional().default(1),

  ...commonSchemaValidation,
});
