import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianRecordActivity } from "../../../../common/technician-jobs/ITechnicia.activity.interface";

import { TechnicianJobSchema } from "../../schemas/technician-jobs-schemas/technician.jobs.schema";

export type technicianJobsDoc = ITechnicianRecordActivity<
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId
> &
    Document;
const technicianJobsDbSchema = new Schema<technicianJobsDoc>(
    {
        ...TechnicianJobSchema,
    },
    { timestamps: true },
);

export const TechniciansJobs: Model<technicianJobsDoc> = model<technicianJobsDoc>(
    "TechniciansJobs",
    technicianJobsDbSchema,
);
