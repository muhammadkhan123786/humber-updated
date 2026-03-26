import { z } from "zod";

import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

export const moduleActionSchema = {
    actionKey: { type: String },
    name:{type:String},
    moduleId:{type:Types.ObjectId,ref:"Modules"},
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false }
};


export const moduleActionValidation = z.object({
  actionKey: z.string().min(1, "Please enter action key name."),
  name:z.string().min(1,'Plase enter action name key.'),
  moduleId:objectIdOrStringSchema,
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isDefault: z.boolean().optional()   
});

