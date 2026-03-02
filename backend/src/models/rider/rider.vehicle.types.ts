
import { Document, Model, model, Schema, Types } from "mongoose";

import { IVehicleType } from "../../../../common/master-interfaces/rider.vehicle.type.interface";

import { vehicleTypeSchema } from "../../schemas/rider-schemas/rider.vehicle.type.schema";

export type rideVehicleTypeDoc = IVehicleType<Types.ObjectId> & Document;

const rideVehicleTypeDbSchema = new Schema<rideVehicleTypeDoc>({

    ...vehicleTypeSchema

}, { timestamps: true });


export const RiderVehicleTypes: Model<rideVehicleTypeDoc> = model<rideVehicleTypeDoc>("RiderVehicleTypes", rideVehicleTypeDbSchema);
