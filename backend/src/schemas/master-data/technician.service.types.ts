import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const technicianServiceTypeSchema = {
    technicianServiceType: { type: String },
    ...commonSchema,
};

export const technicianServiceTypeSchemaValidation = z.object({
    technicianServiceType: z.string().min(1, "Technician service type name is required"),
    ...commonSchemaValidation,
});
