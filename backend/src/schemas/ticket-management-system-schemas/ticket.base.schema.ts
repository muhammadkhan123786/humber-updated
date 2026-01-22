import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { CustomerTicketBase } from "../../../../common/Ticket-management-system/ITicket.interface";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const customerTicketBaseSchema = {
  ...commonSchema,

  ticketCode: { type: String, required: true, unique: true },

  ticketSource: {
    type: String,
    enum: ["Phone", "Online Portal", "Walk-in"],
    required: true,
  },

  ticketStatusId: { type: Types.ObjectId, ref: "TicketStatus", required: true },

  customerId: { type: Types.ObjectId, ref: "CustomerBase", required: true },

  vehicleId: {
    type: Types.ObjectId,
    ref: "CustomerVehicleModel",
    required: true,
  },

  issue_Details: { type: String, required: true },

  location: { type: String, required: true },

  priorityId: {
    type: Types.ObjectId,
    ref: "ServiceRequestPrioprityModel",
    required: true,
  },

  vehicleRepairImages: { type: [String] },

  vehicleRepairVideoURL: { type: String },
  assignedTechnicianId: {
    type: [Types.ObjectId],
    ref: "Technicians",
    default: [],
  },

  address: { type: String },
};

export const customerTicketBaseSchemaValidation = z.object({
  ...commonSchemaValidation,

  ticketCode: z.string().min(1, "ticketCode is required"),

  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Valid user ID is required"),

  ticketSource: z.enum(["Phone", "Online Portal", "Walk-in"]),

  customerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Valid customer ID is required"),

  vehicleId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Valid vehicle ID is required"),

  issue_Details: z.string().min(5),

  location: z.string().min(2),

  priorityId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Valid priority ID is required"),

  ticketStatusId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Valid ticket status ID is required"),

  address: z.string().optional(),
  assignedTechnicianId: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Technician ID")
    )
    .optional()
    .default([]),

  vehicleRepairImages: z.array(z.string()).optional(),

  vehicleRepairVideoURL: z.string().optional(),
});
