
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianInspectionList } from "../../../../common/master-interfaces/ITechnician.inspection.list.interface";

import { technicianInspectionListSchema } from "../../schemas/master-data/technician.inspection.list.schema";

export type technicianInspectionListTypeDoc = ITechnicianInspectionList<Types.ObjectId> & Document;

const technicianInspectionListDbSchema = new Schema<technicianInspectionListTypeDoc>({

    ...technicianInspectionListSchema

}, { timestamps: true });


export const technicianInspectionList: Model<technicianInspectionListTypeDoc> = model<technicianInspectionListTypeDoc>("technicianInspectionList", technicianInspectionListDbSchema);
