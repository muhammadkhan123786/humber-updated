import { Document, Model, model, Schema, Types } from "mongoose";
import { IVehicleModelInterface } from "../../../common/Vehicle-Model.Interface";

export type VehicleModelDoc = IVehicleModelInterface<Types.ObjectId, Types.ObjectId> & Document;

const vehicleModelSchema = new Schema<VehicleModelDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    brandId: { type: Types.ObjectId, ref: "VechicleBrand", required: true },
    modelName: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const VechicleModel: Model<VehicleModelDoc> = model<VehicleModelDoc>("VechicleModel", vehicleModelSchema);
