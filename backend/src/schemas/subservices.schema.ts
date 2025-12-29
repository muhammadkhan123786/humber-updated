import { z } from "zod";

export const subServiceCreateSchema = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    masterServiceId: z.string().min(1, "Please select master service."),
    subServiceName: z.string().min(1, "Sub Service is required."),
    cost: z.number().min(0),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});