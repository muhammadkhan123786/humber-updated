import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { IJobTitles } from '../../../../common/suppliers/IJob.titles';


export const jobTitleSchema: SchemaDefinition<IJobTitles<Types.ObjectId>> = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    jobTitleName: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}

export const jobTitleSchemaValidation = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    jobTitleName: z.string().min(1, "Job Title name is required"),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});


