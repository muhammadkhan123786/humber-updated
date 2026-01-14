import { Document, Model, model, Schema, Types } from "mongoose";
import { ICustomerVehicleRegInterface } from "../../../common/Vehicle-Registeration.Interface";
import { commonSchema } from "../schemas/shared/common.schema";


export type CustomerVehicleDoc = ICustomerVehicleRegInterface<Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;

const CustomerVehicleSchema = new Schema<CustomerVehicleDoc>(
    {
        ...commonSchema,
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        vehicleBrandId: {
            type: Schema.Types.ObjectId,
            ref: "VechicleBrand",
            required: true,
        },

        vehicleModelId: {
            type: Schema.Types.ObjectId,
            ref: "VechicleModel",
            required: true,
        },

        serialNumber: {
            type: String,
            required: true,
            trim: true,
        },

        vehicleType: {
            type: String,
            enum: ["Scooter", "Mobility Vehicle"],
            required: true,
        },

        purchaseDate: {
            type: Date,
            required: true,
        },

        warrantyStartDate: {
            type: Date,
            required: true,
        },

        warrantyEndDate: {
            type: Date,
            required: true,
        },

        vehiclePhoto: {
            type: String,
        },

        note: {
            type: String,
        },
    },
    { timestamps: true }

);

export const CustomerVehicleModel: Model<CustomerVehicleDoc> = model<CustomerVehicleDoc>("CustomerVehicleModel", CustomerVehicleSchema);

