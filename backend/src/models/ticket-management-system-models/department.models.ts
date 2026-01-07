
import { Document, Model, model, Schema, Types } from "mongoose";

import { IDepartments } from "../../../../common/Ticket-management-system/IDepartment.interface";

import { departmentSchema } from "../../schemas/ticket-management-system-schemas/department.schema";


export type departmentDoc = IDepartments<Types.ObjectId> & Document;
const departmentDocDbSchema = new Schema<departmentDoc>({
    ...departmentSchema
}, { timestamps: true });


export const Department: Model<departmentDoc> = model<departmentDoc>("Department", departmentDocDbSchema);
