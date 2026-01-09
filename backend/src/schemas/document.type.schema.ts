import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";




export const documentTypeSchema: SchemaDefinition = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    documentTypeName: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}



export const documentTypeSchemaValidation = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    documentTypeName: z.string().min(1, "Document type name is required."),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});



