import { z } from "zod";

export const technicianZoneSchema = z.object({
    zoneId: z.string(),
    day: z.enum([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ]),
    startTime: z.string(),
    endTime: z.string(),
});

export const createTechnicianSchema = z.object({
    userId: z.string(),

    personId: z.string(),
    contactId: z.string(),
    addressId: z.string(),

    skills: z.array(z.string()).optional(),
    zones: z.array(technicianZoneSchema).min(1),

    profilePic: z.string().optional(),
    documents: z.array(z.string()).optional(),
});