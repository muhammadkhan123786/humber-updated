import { z } from "zod";
import { objectIdSchema } from "../../validators/objectId.schema";
import { commonSchemaValidation } from "../shared/common.schema";
// ----------------------------
// Invoice Service Item
// ----------------------------
const invoiceServiceSchema = z.object({
  ...commonSchemaValidation,
  activityId: objectIdSchema,
  duration: z.string().min(1, "Duration is required"),
  description: z.string().min(1, "Description is required"),
  additionalNotes: z.string().optional(),
  source: z
    .enum(["JOB", "INVOICE"] as const)
    .refine((val) => val !== undefined, {
      message: "Source is required",
    }),
});

// ----------------------------
// Invoice Part Item
// ----------------------------
const invoicePartSchema = z.object({
  ...commonSchemaValidation,
  partId: objectIdSchema,
  oldPartConditionDescription: z.string().optional(),
  newSerialNumber: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitCost: z.number().min(0, "Unit cost must be non-negative"),
  totalCost: z.number().min(0, "Total cost must be non-negative"),
  reasonForChange: z.string().optional(),
  source: z
    .enum(["JOB", "INVOICE"] as const)
    .refine((val) => val !== undefined, {
      message: "Source is required",
    }),
});
// ----------------------------
// Main Invoice Schema
// ----------------------------
export const createInvoiceSchemaValidation = z
  .object({
    ...commonSchemaValidation,
    invoiceId: z.string().min(1, "Invoice ID is required"),
    jobId: objectIdSchema,
    customerId: objectIdSchema,
    services: z.array(invoiceServiceSchema).default([]),
    parts: z.array(invoicePartSchema).default([]),
    taxAmount: z.number().default(0),
    completionSummary: z.string().optional(),
    // 🔥 Coerce string to Date
    invoiceDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid invoice date",
    }),
    dueDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid due date",
    }),
    callOutFee: z.number().min(0).default(0),
    generalNotes: z.string().optional(),

    discountType: z.enum(["Percentage", "Fix Amount"]).default("Percentage"),
    isVATEXEMPT: z.boolean().default(false),

    invoiceNotes: z.string().optional(),
    termsAndConditions: z.string().optional(),
    paymentLink: z
      .string()
      .url({ message: "Invalid payment link URL" })
      .optional(),
    paymentStatus: z.enum(["PENDING", "PAID"]).default("PENDING"),
    status: z.enum(["DRAFT", "ISSUED", "CANCELLED", "PAID"]).default("DRAFT"),
  })
  // ----------------------------
  // Extra Validation: dueDate must be after invoiceDate
  // ----------------------------
  .refine((data) => data.dueDate > data.invoiceDate, {
    message: "Due date must be after invoice date",
    path: ["dueDate"],
  });
