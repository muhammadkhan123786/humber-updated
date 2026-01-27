import { z } from "zod";

export const serviceRequestPrioprityCreateSchema =
    z.object({
        userId: z.string().min(1, "userId is required"),
        serviceRequestPrioprity: z.string().min(1, "Service Request Priority name is required"),
        description: z.string().min(1, "Description is required"),
        backgroundColor: z.string().min(1, "Background color is required"),
        // FIXED: Removed the empty .refine()
        index: z.number().int().positive().optional(), 
        isActive: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
        isDefault: z.boolean().optional(),
    });