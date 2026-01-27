import { z } from "zod";

export const serviceRequestPrioprityCreateSchema = z
    .array(
        z.object({
            userId: z.string().min(1, "userId is required"),
            serviceRequestPrioprity: z.string().min(1, "Service Request Priority name is required"),
            description: z.string().min(1, "Description is required"),
            backgroundColor: z.string().min(1, "Background color is required"),
            index: z.number().int().positive().optional(),
            isActive: z.boolean().optional(),
            isDeleted: z.boolean().optional(),
            isDefault: z.boolean().optional(),
        })
    )
    .superRefine((items, ctx) => {
        const seen = new Set<number>();

        items.forEach((item, i) => {
            if (item.index !== undefined) {
                if (seen.has(item.index)) {
                    ctx.addIssue({
                        code: "custom",
                        path: [i, "index"],
                        message: `Duplicate index value: ${item.index}`
                    });
                }
                seen.add(item.index);
            }
        });
    });
