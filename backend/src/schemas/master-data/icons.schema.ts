import { z } from "zod";
import { Types } from "mongoose";

export const iconSchema = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    iconName: { type: String },
    icon: [{ type: String, required: true }],
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}

export const iconSchemaValidation = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    iconName: z.string().min(1, "Icon name is required"),
    icon: z.array(z.string()).min(1, "Icon is required."),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});


