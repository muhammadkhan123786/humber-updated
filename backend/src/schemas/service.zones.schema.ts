import { z } from "zod";

export const serviceZoneCreateSchema = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    serviceZone: z.string().min(1, "technician role name is required."),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});