import { z } from "zod";
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
   isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false }
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
   isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isDefault: z.boolean().optional()
});

