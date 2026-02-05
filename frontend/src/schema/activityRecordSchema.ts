import { z } from "zod";

export const serviceSchema = z.object({
  activityId: z.string().min(1, "Activity is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().min(1, "Description is required"),
  additionalNotes: z.string().optional(),
});

export const partSchema = z.object({
  partId: z.string().min(1, "Part is required"),
  oldPartConditionDescription: z.string().optional(),
  newSerialNumber: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitCost: z.number().min(0, "Unit cost cannot be negative"),
  totalCost: z.number().min(0, "Total cost cannot be negative"),
  reasonForChange: z.string().optional(),
});

export const inspectionSchema = z.object({
  inspectionTypeId: z.string().min(1, "Inspection type is required"),
  status: z.enum(["PASS", "FAIL", "N/A"]),
  notes: z.string().optional(),
});

export const activityRecordSchema = z.object({
  ticketId: z.string().min(1, "Ticket is required"),
  technicianId: z.string().min(1, "Technician is required"),
  jobStatusId: z.string().optional(),

  services: z.array(serviceSchema).default([]),
  parts: z.array(partSchema).default([]),
  inspections: z.array(inspectionSchema).default([]),

  generalNotes: z.string().optional(),
  completionSummary: z.string().optional(),

  jobNotesMessages: z.array(z.string()).default([]),
  jobNotesImages: z.array(z.string()).default([]),
  jobNotesVideos: z.array(z.string()).default([]),

  jobNotesImagesFile: z.array(z.instanceof(File)).optional(),
  jobNotesVideosFile: z.array(z.instanceof(File)).optional(),
});

export type ActivityRecordFormData = z.infer<typeof activityRecordSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type PartFormData = z.infer<typeof partSchema>;
export type InspectionFormData = z.infer<typeof inspectionSchema>;
