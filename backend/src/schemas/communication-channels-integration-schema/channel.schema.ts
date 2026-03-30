import { z } from "zod";

export const channelSchema = {
    channelName: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
};

export const channelValidation = z.object({
  channelName: z.string().min(1, "Please enter channel name."),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isDefault: z.boolean().optional()
});

