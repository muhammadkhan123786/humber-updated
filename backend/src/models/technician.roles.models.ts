
import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianRoles } from "../../../common/ITechnicianRoles.interface";

export type technicianRoleDoc = ITechnicianRoles<Types.ObjectId> & Document;

const technicianRoleSchema = new Schema<technicianRoleDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    technicianRole: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const TechnicianRoleModel: Model<technicianRoleDoc> = model<technicianRoleDoc>("TechnicianRoleModel", technicianRoleSchema);
