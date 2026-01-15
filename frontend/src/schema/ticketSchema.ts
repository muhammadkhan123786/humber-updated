import { string, z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ticketFormSchema = z.object({
  ticketSource: z.enum(["Phone", "Online Portal", "Walk-in"]),

  customerId: z.string().regex(objectIdRegex, {
    message: "Valid customer ID is required",
  }),

  vehicleId: z.string().regex(objectIdRegex, {
    message: "Valid vehicle ID is required",
  }),

  issue_Details: z
    .string()
    .min(5, "Issue details must be at least 5 characters")
    .max(1000, "Issue details must be less than 1000 characters"),

  location: z.enum(["Workshop", "On-Site", "Mobile Service"]),

  priorityId: z.string().regex(objectIdRegex, {
    message: "Invalid Priority Selection",
  }),

  ticketStatusId: z
    .string()
    .optional()
    .refine((val) => !val || objectIdRegex.test(val), {
      message: "Valid ticket status ID is required",
    }),

  ticketCode: z.string().optional(),

  address: z.string().optional(),

  vehicleRepairImages: z.union([z.string(), z.array(z.string())]).optional(),

  vehicleRepairVideo: z.array(z.any()).optional(),

  vehicleRepairVideoURL: z.string().optional(),

  assignedTechnicianId: z.string().nullable().optional(),

  userId: z
    .string()
    .regex(objectIdRegex, {
      message: "Valid user ID is required",
    })
    .or(z.literal("")),
});

export type TicketFormData = z.infer<typeof ticketFormSchema>;
