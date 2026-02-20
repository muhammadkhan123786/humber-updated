
import { z } from "zod";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";
import { commonSchemaValidation } from "../shared/common.schema";
// 🔹 Inspection Item Schema
export const InspectionItemZodSchema = z.object({
    inspectionTypeId: objectIdOrStringSchema,

    status: z.enum(["PASS", "FAIL", "N/A"]),
    notes: z
        .string()
        .max(500, "Notes too long")
        .optional(),
});

// 🔹 Main Inspection Schema
export const CreateInspectionZodSchemaValidation = z.object({
    jobId: objectIdOrStringSchema,
    tecnicianId: objectIdOrStringSchema,
    inspectionTIME: z.enum(["BEFORE SERVICE", "AFTER SERVICE"]),
    inspectionSummary: z
        .string()
        .max(1000, "Summary too long")
        .optional(),
    inspections: z
        .array(InspectionItemZodSchema)
        .min(1, "At least one inspection item is required"),
    ...commonSchemaValidation
});