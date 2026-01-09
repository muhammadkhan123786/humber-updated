import { z } from "zod";
import { Schema, SchemaDefinition } from "mongoose";
import { commonSchema, commonSchemaValidation } from "./shared/common.schema";

export const attributeSchema: SchemaDefinition = {
  ...commonSchema,

  attributeName: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "number", "select", "multi_select", "date"],
    required: true,
  },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null }, // Add this
  isForSubcategories: { type: Boolean, default: false }, // Add this
  unit: { type: String, default: "" }, // Add this for number/decimal types
  
  isRequired: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  options: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
      sort: { type: Number, default: 0 },
    },
  ],
};

export const attributeSchemaValidation = z.object({
  ...commonSchemaValidation,

  attributeName: z.string().min(2, "Attribute name is required"),
  type: z.enum(["text", "number", "select", "multi_select", "date"]),
  categoryId: z.string().optional().nullable(), // Add this
  isForSubcategories: z.boolean().optional(), // Add this
  unit: z.string().optional(), // Add this

  isRequired: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),

  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        sort: z.number().optional(),
      })
    )
    .optional(),
});