import { Schema, Types } from "mongoose";
import { commonSchema } from "../shared/common.schema";
import { JobAssignmentStatus } from "../../../../common/leadning-technician-jobs-assignments/assigned.jobs.interface";

export const TechnicianJobAssignmentSchema = {
  jobId: { type: Types.ObjectId, ref: "TechnicianJobsByAdmin", required: true },
  technicianId: { type: Types.ObjectId, ref: "Technicians", required: true },
  generalNotes: { type: String },
  role: { type: String, enum: ["LEAD", "SHARED"], required: true },
  assignedBy: { type: Types.ObjectId, ref: "Technicians", required: true },
  jobStatus: {
    type: String,
    enum: ["PENDING", "IN_PROGRESS", "ON_HOLD", "COMPLETED"],
    default: "PENDING" as JobAssignmentStatus,
    required: true
  },
  acceptedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  ...commonSchema,
};


// // Indexes for faster lookup
// TechnicianJobAssignmentSchema.index({ technicianId: 1 });
// TechnicianJobAssignmentSchema.index({ jobId: 1 });
// TechnicianJobAssignmentSchema.index({ jobStatus: 1 });