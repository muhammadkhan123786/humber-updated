import { z } from "zod";

export const activityRecordSchema = z.object({
  jobId: z.string().min(4, "Job Id is required."),
  ticketId: z.string().min(1, "Ticket is required"),
  leadingTechnicianId: z.string().min(1, "Technician is required"),
  quotationId: z.string().min(1, "Quotation is required"),
  jobStatusId: z
    .enum(["PENDING", "START", "ON HOLD", "END"])
    .default("PENDING"),
  adminNotes: z.string().optional(),
});

export type ActivityRecordFormData = z.infer<typeof activityRecordSchema>;
