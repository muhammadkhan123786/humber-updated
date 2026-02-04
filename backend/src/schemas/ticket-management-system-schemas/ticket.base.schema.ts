import { z } from "zod";
import { Types } from "mongoose";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const InvestigationPartSchema = z.object({
  partId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid partId"),

  quantity: z.number().positive(),
  unitCost: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const customerTicketBaseSchema = {
  ...commonSchema,

  ticketCode: { type: String, required: true, unique: true },

  ticketSource: {
    type: String,
    enum: ["Phone", "Online Portal", "Walk-in"],
    required: true,
  },

  decisionId: {
    type: String,
    enum: ["Covered", "Chargeable", "Mixed"],
    required: false,
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

  productOwnership: {
    type: String,
    enum: ["Customer Product", "Company product"],
    required: true,
  },
  insuranceId: {
    type: Types.ObjectId,
    ref: "InsuranceCompanies",
  },
  insuranceReferenceNumber: {
    type: String
  },
  vehiclePickUp: {
    type: String,
    enum: ["Customer-Drop", "Company-Pickup"],
  },
  pickUpDate: { type: Date },
  pickUpBy: {
    type: String,
    enum: ["External Company", "Company Rider"]
  },
  externalCompanyName: {
    type: String
  },
  riderId: { type: Types.ObjectId }
};

export const customerTicketBaseSchemaValidation = z.object({
  ...commonSchemaValidation,

  insuranceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Valid Insurance Id is required").optional(),

  insuranceReferenceNumber: z.string().optional(),

  vehiclePickUp: z.enum(["Customer-Drop", "Company-Pickup"]).optional(),

  pickUpDate: z.date().optional(),

  pickUpBy: z.enum(["External Company", "Company Rider"]).optional(),

  externalCompanyName: z.string().optional(),

  riderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Valid Rider Id is required").optional(),

  productOwnership: z.enum(["Customer Product", "Company product"]),

  decisionId: z.enum(["Covered", "Chargeable", "Mixed"]),

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
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Technician ID"))
    .optional()
    .default([]),

  vehicleRepairImages: z.array(z.string()).optional(),

  vehicleRepairVideoURL: z.string().optional(),
});
