import { z } from "zod";

export const countryCreateSchema = z.object({
    userId: z.string().optional(),  // will be converted to ObjectId
    countryName: z.string().min(1, "Country name is required"),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});