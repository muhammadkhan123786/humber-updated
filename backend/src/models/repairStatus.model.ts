import { Document, Model, model, Schema, Types } from "mongoose";
import { IRepairStatus } from "../../../common/IRepairStatus";

export type RepairStatusDoc = IRepairStatus<Types.ObjectId> & Document;

const repairStatusSchema = new Schema<RepairStatusDoc>({
    userId: { type: Types.ObjectId, required: true },
    repairStatus: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const RepairStatus: Model<RepairStatusDoc> = model<RepairStatusDoc>("RepairStatus", repairStatusSchema);
