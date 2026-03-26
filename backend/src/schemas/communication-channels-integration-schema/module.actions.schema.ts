import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";


export const moduleActionSchema = {
    actionKey: { type: String },
    name:{type:String},
    moduleId:{type:Types.ObjectId,ref:"Modules"},
    ...commonSchema,
};


export const moduleActionValidation = z.object({
  actionKey: z.string().min(1, "Please enter action key name."),
  name:z.string().min(1,'Plase enter action name key.'),
  moduleId:objectIdOrStringSchema,
  ...commonSchemaValidation,
});

