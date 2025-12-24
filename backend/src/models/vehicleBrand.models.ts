import { Document, Model, model, Schema, Types } from "mongoose";
import { IVehicleBrandInterface } from "../../../common/Vehicle-Brand.Interface";

export type VehicleBrandDoc = IVehicleBrandInterface<Types.ObjectId> & Document;

const vehicleBrandSchema = new Schema<VehicleBrandDoc>({
    userId: { type: Types.ObjectId, required: true },
    brandName: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const VechicleBrand: Model<VehicleBrandDoc> = model<VehicleBrandDoc>("VechicleBrand", vehicleBrandSchema);
