import { z } from "zod";

export const callLogFormSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  phoneNumber: z.string().regex(/^\+?[0-9\s]{10,20}$/, "Invalid phone number"),
  address: z.string().optional(),
  postCode: z.string().optional(),
  city: z.string().optional(),
  callTypeId: z.string().min(1, "Please select a call type"),
  priorityLevelId: z.string().min(1, "Please select priority level"),
  agentName: z.string().min(1, "Agent name is required"),
  callPurpose: z.string().min(1, "Call purpose is required"),
  callNotes: z.string().optional(),
  callDuration: z.coerce
    .number()
    .min(0, "Duration cannot be negative")
    .default(0),

  // Follow-up fields
  followUpDate: z.string().optional(),
  followUpTime: z.string().optional(),
  followUpNotes: z.string().optional(),
});

export type CallLogFormValues = z.infer<typeof callLogFormSchema>;
