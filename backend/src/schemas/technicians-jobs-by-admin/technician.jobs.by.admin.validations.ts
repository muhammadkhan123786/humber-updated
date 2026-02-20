import z from "zod";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";
import { commonSchemaValidation } from "../shared/common.schema";

export const technicianJobsByAdminValidation = z.object({
    ticketId: objectIdOrStringSchema,
    jobId: z.string().min(4, "Job Id is required."),
    leadingTechnicianId: objectIdOrStringSchema,
    adminNotes: z.string().optional(),
    jobStatusId: z.enum(["PENDING", "START", "ON HOLD", "END"]).default("PENDING"),
    quotationId: objectIdOrStringSchema,
    ...commonSchemaValidation,
});