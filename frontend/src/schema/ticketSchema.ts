import { z } from "zod";

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

  vehicleRepairImages: z
    .union([z.array(z.string()), z.string().transform(() => []), z.undefined()])
    .optional(),

  vehicleRepairImagesFile: z.array(z.any()).optional(),
  vehicleRepairVideo: z.array(z.any()).optional(),
  vehicleRepairVideoURL: z.string().optional(),

  assignedTechnicianId: z
    .array(z.string().regex(objectIdRegex, "Invalid Technician ID"))
    .optional()
    .default([]),

  userId: z
    .string()
    .regex(objectIdRegex, {
      message: "Valid user ID is required",
    })
    .or(z.literal("")),

  productOwnership: z.enum(["Customer Product", "Company product"]),

  productSerialNumber: z.string().optional(),

  purchaseDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  investigationParts: z
    .array(
      z.object({
        partId: z.string().regex(objectIdRegex).optional(),
        partName: z.string().optional(),
        partNumber: z.string().optional(),
        quantity: z.coerce.number().positive().default(1),
        unitCost: z.coerce.number().nonnegative().default(0),
        total: z.coerce.number().nonnegative().default(0),
      }),
    )
    .optional()
    .default([]),
  decisionId: z
    .enum(["Covered", "Chargeable", "Mixed"])
    .optional()
    .or(z.literal("")),

  isEmailSendReport: z.boolean().default(false),
  total: z.coerce.number().nonnegative().optional(),
  manualProductName: z.string().optional(),
  manualMake: z.string().optional(),
  manualModel: z.string().optional(),
  manualYear: z.string().optional(),
  manualColor: z.string().optional(),
  vehicleType: z.string().optional(),

  insuranceId: z
    .string()
    .regex(objectIdRegex, "Invalid Insurance Selection")
    .optional()
    .or(z.literal("")),
  insuranceReferenceNumber: z.string().optional(),

  vehiclePickUp: z.enum(["Customer-Drop", "Company-Pickup"]).optional(),
  pickUpDate: z.string().optional().or(z.date()),
  pickUpBy: z
    .enum(["External Company", "Company Rider"])
    .optional()
    .or(z.literal("")),
  externalCompanyName: z.string().optional(),
  riderId: z
    .string()
    .regex(objectIdRegex, "Invalid Rider Selection")
    .optional()
    .or(z.literal("")),
});
export type TicketFormData = z.infer<typeof ticketFormSchema>;
