
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianServiceType } from "../../../../common/master-interfaces/IService.type.interface";

import { technicianServiceTypeSchema } from "../../schemas/master-data/technician.service.types";

export type technicianServiceTypeDoc = ITechnicianServiceType<Types.ObjectId> & Document;

const technicianServiceTypeDbSchema = new Schema<technicianServiceTypeDoc>({

    ...technicianServiceTypeSchema

}, { timestamps: true });


export const TechnicianServiceType: Model<technicianServiceTypeDoc> = model<technicianServiceTypeDoc>("TechnicianServiceType", technicianServiceTypeDbSchema);
