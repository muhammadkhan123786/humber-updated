import { Schema, Types } from "mongoose";
import { commonSchema } from "../shared/common.schema";

export const ServiceSchema = new Schema(
  {
    activityId: {
      type: Types.ObjectId,
      required: true,
      ref: "TechnicianServiceType",
    },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    additionalNotes: { type: String },
    ...commonSchema,
  },
  { _id: false },
);

export const PartSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: "ProductBasic", required: true },
    oldPartConditionDescription: { type: String },
    newSerialNumber: { type: String },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    reasonForChange: { type: String },
    ...commonSchema,
  },
  { _id: false },
);

export const InspectionSchema = new Schema(
  {
    inspectionTypeId: { type: Types.ObjectId, ref: "technicianInspectionList" },
    status: {
      type: String,
      enum: ["PASS", "FAIL", "N/A"],
      required: true,
    },
    notes: { type: String },
    ...commonSchema,
  },
  { _id: false },
);

export const JobNotesSchema = new Schema(
  {
    messages: [{ type: String }],
    images: [{ type: String }], // URLs
    videos: [{ type: String }],
    ...commonSchema,
  },
  { _id: false },
);

export const TechnicianJobSchema = {
  jobId: { type: String, required: true },
  ticketId: { type: Types.ObjectId, ref: "customerTicketBase", required: true },
  technicianId: { type: Types.ObjectId, ref: "Technicians", required: true },

  services: { type: [ServiceSchema], default: [] },
  parts: { type: [PartSchema], default: [] },
  inspections: { type: [InspectionSchema], default: [] },
  generalNotes: { type: String },
  jobStatusId: { type: Types.ObjectId, ref: "TechnicianJobStatus" },
  jobNotes: JobNotesSchema,

  completionSummary: { type: String },
  ...commonSchema,
};
