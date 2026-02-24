import { Document, Model, model, Schema, Types } from "mongoose";

import { IAssignedJobs } from "../../../../common/leadning-technician-jobs-assignments/assigned.jobs.interface";

import { TechnicianJobAssignmentSchema } from "../../schemas/job-assignment/job.assignment.schema";

export type technicianJobsAssignmentDoc = IAssignedJobs<
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Date,
    Date    
    > &
    Document;
const technicianJobsAssignmentDbSchema = new Schema<technicianJobsAssignmentDoc>(
    {
        ...TechnicianJobAssignmentSchema,
    },
    { timestamps: true },
);

technicianJobsAssignmentDbSchema.index({ technicianId: 1 });
technicianJobsAssignmentDbSchema.index({ jobStatus: 1 });
technicianJobsAssignmentDbSchema.index({ createdAt: -1 });
technicianJobsAssignmentDbSchema.index({ jobId: 1 });

export const TechniciansJobsAssignment: Model<technicianJobsAssignmentDoc> = model<technicianJobsAssignmentDoc>(
    "TechniciansJobsAssignment",
    technicianJobsAssignmentDbSchema,
);
