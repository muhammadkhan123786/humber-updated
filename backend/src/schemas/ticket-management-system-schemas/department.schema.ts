import { z, ZodObject } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { IDepartments } from '../../../../common/Ticket-management-system/IDepartment.interface'
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const departmentSchema: SchemaDefinition<IDepartments<Types.ObjectId>> = {
    ...commonSchema,
    departmentName: { type: String, required: true }

}

export const departmentSchemaValidation = z.object({
    ...commonSchemaValidation,
    departmentName: z
        .string().min(3, "Please enter valid department name.")

});


