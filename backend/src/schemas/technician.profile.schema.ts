import { z } from "zod";

/* -----------------------------
 * Reusable Validators
 ------------------------------ */
const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const timeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)");

/* -----------------------------
 * Technician Zone Schema
 ------------------------------ */
export const technicianZoneSchema = z
    .object({
        zoneId: objectIdSchema,
        day: z.enum([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]),
        startTime: timeSchema,
        endTime: timeSchema,
    })
    .refine(
        (data) => data.startTime < data.endTime,
        {
            message: "endTime must be after startTime",
            path: ["endTime"],
        }
    );

/* -----------------------------
 * Create Technician Schema
 ------------------------------ */
export const createTechnicianSchema = z
    .object({
        userId: objectIdSchema,
        personId: objectIdSchema,
        contactId: objectIdSchema,
        addressId: objectIdSchema,
        accountId: objectIdSchema,
        roleId: objectIdSchema,
        employeeId: z.string().min(1, "Employee Id is required."),

        skills: z.array(objectIdSchema).optional(),

        zones: z
            .array(technicianZoneSchema)
            .min(1, "At least one zone is required"),

        profilePhoto: z.string().url().optional(),
        certifications: z.array(z.string().url()).optional(),
    })
    .refine(
        (data) => {
            const unique = new Set<string>();

            for (const zone of data.zones) {
                const key = `${zone.zoneId}-${zone.day}`;
                if (unique.has(key)) return false;
                unique.add(key);
            }

            return true;
        },
        {
            message: "Duplicate zone/day entries are not allowed",
            path: ["zones"],
        }
    );
