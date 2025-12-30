import { z } from "zod";

export const serviceRequestPrioprityCreateSchema = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    serviceRequestPrioprity: z.string().min(1, "Service Request Prioprity role name is required."),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});