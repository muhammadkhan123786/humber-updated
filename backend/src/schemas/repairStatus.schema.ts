import { z } from "zod";

export const repairStatusCreateSchema = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    repairStatus: z.string().min(1, "Repair Status is required"),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});