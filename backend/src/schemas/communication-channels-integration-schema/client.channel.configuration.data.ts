import { Schema, Types } from "mongoose";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";
import z from "zod";

export const clientChannelConfigDataSchema = {
  providerId: {
    type: Types.ObjectId,
    ref: "communicationChannelsProvider",
    required: true
  },

  configurationData: {
    type: Schema.Types.Mixed,
    default: {}
  },

  ...commonSchema,
};

export const clientChannelConfigDataValidation = z.object({
  providerId: objectIdOrStringSchema,

 configurationData: z.record(z.string(), z.any()).default({}),

  ...commonSchemaValidation,
});

//data validation function 
export const buildDynamicConfigSchema = (fields: any[]) => {
  const shape: Record<string, any> = {};

  fields.forEach((field) => {

    let validator;

    switch (field.type) {
      case "text":
      case "password":
        validator = z.string();
        break;

      case "number":
        validator = z.number();
        break;

      case "boolean":
        validator = z.boolean();
        break;

      default:
        validator = z.any();
    }

    if (!field.required) {
      validator = validator.optional();
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
};