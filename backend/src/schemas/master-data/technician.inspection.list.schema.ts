import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const technicianInspectionListSchema = {
    technicianInspection: { type: String },
    technicianInspectionDescription: { type: String },
    ...commonSchema,
};

export const technicianInspectionListValidation = z.object({
    technicianInspection: z.string().min(1, "Technician Inspection name is required"),
    technicianInspectionDescription: z.string().min(1, "Inspection description is required."),
    ...commonSchemaValidation,
});
