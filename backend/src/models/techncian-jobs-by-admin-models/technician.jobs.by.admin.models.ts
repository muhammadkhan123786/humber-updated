
import { Document, Model, model, Schema, Types } from "mongoose";

import { IAdminCreateActivity } from "../../../../common/technician-jobs-updated/technician.jobs.assignment.interface";

import { TechnicianJobByAdminSchema } from "../../schemas/technicians-jobs-by-admin/techncian.jobs.by.admin.schema";

export type technicianJobsByAdminDoc = IAdminCreateActivity<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;

const technicianJobsByAdminDbSchema = new Schema<technicianJobsByAdminDoc>({

    ...TechnicianJobByAdminSchema

}, { timestamps: true });


export const TechnicianJobsByAdmin: Model<technicianJobsByAdminDoc> = model<technicianJobsByAdminDoc>("TechnicianJobsByAdmin", technicianJobsByAdminDbSchema);
