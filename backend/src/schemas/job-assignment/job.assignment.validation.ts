import z from "zod";
import { objectIdSchema } from "../../validators/objectId.schema";
import { commonSchemaValidation } from "../shared/common.schema";

export const technicianJobSchemaValidation = z.object({
  jobId: objectIdSchema,
  technicianId: objectIdSchema,
  generalNotes: z.string().optional(),
  role: z.enum(["LEAD", "SHARED"]),
  assignedBy: objectIdSchema,
  jobStatus: z.enum(["PENDING", "IN_PROGRESS", "ON_HOLD", "COMPLETED"]).default("PENDING"),
  ...commonSchemaValidation,
});

