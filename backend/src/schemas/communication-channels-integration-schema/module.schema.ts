import { z } from "zod";

export const moduleSchema = {
    moduleName: { type: String },
    moduleKey:{type:String},
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false }
};

export const modulesValidation = z.object({
  moduleName: z.string().min(1, "Please enter module name."),
  moduleKey:z.string().min(1,'Plase enter module key.'),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isDefault: z.boolean().optional()
});

