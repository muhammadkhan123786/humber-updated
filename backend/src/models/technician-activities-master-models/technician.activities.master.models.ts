import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianRecordActivityMaster } from "../../../../common/technician-activity-on-jobs-interface/technician.activity.on.jobs.interface";

import { technicianActivitiesSchema } from "../../schemas/technician-activities-records/technician.activities.records.schema";

export type technicianActivityMasterDoc = ITechnicianRecordActivityMaster<
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId
    > &
    Document;
const technicianActivitiesMasterDbSchema = new Schema<technicianActivityMasterDoc>(
    {
        ...technicianActivitiesSchema,
    },
    { timestamps: true },
);

technicianActivitiesMasterDbSchema.index({ technicianId: 1 });
technicianActivitiesMasterDbSchema.index({ JobAssignedId: 1 });
technicianActivitiesMasterDbSchema.index({ createdAt: -1 });
technicianActivitiesMasterDbSchema.index({ quotationId: 1 });


export const TechniciansActivitiesMaster: Model<technicianActivityMasterDoc> = model<technicianActivityMasterDoc>(
    "TechniciansActivitiesMaster",
    technicianActivitiesMasterDbSchema,
);
