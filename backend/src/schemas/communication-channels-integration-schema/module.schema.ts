import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const moduleSchema = {
    moduleName: { type: String },
    moduleKey:{type:String},
    ...commonSchema,
};


export const modulesValidation = z.object({
  moduleName: z.string().min(1, "Please enter module name."),
  moduleKey:z.string().min(1,'Plase enter module key.'),
  ...commonSchemaValidation,
});

