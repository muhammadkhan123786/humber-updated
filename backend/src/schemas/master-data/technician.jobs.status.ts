import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const technicianJobStatusSchema = {
    technicianJobStatus: { type: String },
    ...commonSchema,
};

export const technicianJobStatusSchemaValidation = z.object({
    technicianJobStatus: z.string().min(1, "Technician job status name is required"),
    ...commonSchemaValidation,
});
