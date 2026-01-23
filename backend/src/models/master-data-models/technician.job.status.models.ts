
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianJobStatus } from "../../../../common/technician-jobs/ITechnician.activity.status.interface";

import { technicianJobStatusSchema } from "../../schemas/master-data/technician.jobs.status";

export type technicianJobStatusTypeDoc = ITechnicianJobStatus<Types.ObjectId> & Document;

const technicianJobStatusDbSchema = new Schema<technicianJobStatusTypeDoc>({

    ...technicianJobStatusSchema

}, { timestamps: true });


export const TechnicianJobStatus: Model<technicianJobStatusTypeDoc> = model<technicianJobStatusTypeDoc>("TechnicianJobStatus", technicianJobStatusDbSchema);
