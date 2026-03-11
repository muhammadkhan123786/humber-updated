import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Schema, Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

const fieldSchema = new Schema(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },

    type: {
      type: String,
      enum: ["text", "password", "number", "select", "boolean"],
      required: true
    },

    required: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ type: String }]
  },
  { _id: false }
);

export const channelConfigSchema = {
    providerId: { type: Types.ObjectId,ref:"communicationChannelsProvider" },
    fields:{type:[fieldSchema],default:[]},
    ...commonSchema,
};

export const channelConfigFieldValidation = z.object({
  name: z.string(),
  label: z.string(),

  type: z.enum([
    "text",
    "password",
    "number",
    "select",
    "boolean"
  ]),

  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional()
});

export const channelConfigValidation = z.object({
  providerId: objectIdOrStringSchema,
  fields:z.array(channelConfigFieldValidation).default([]),
  ...commonSchemaValidation,
});

