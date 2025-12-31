import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnicianZone, ITechnicianBaseInformation } from "../../../common/ITechnician.interface";

export type technicianZoneDoc = ITechnicianZone<Types.ObjectId> & Document;

export type technicianInformationDoc = ITechnicianBaseInformation<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId[], Types.ObjectId, Types.ObjectId> & Document;


const technicianZonesSchema = new Schema<technicianZoneDoc>({
    zoneId: { type: Types.ObjectId, ref: "ServiceZoneModel", required: true },
    day: {
        type: String,
        enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
},
    { _id: false }
);


const technicianProfileSchema = new Schema<technicianInformationDoc>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    personId: { type: Types.ObjectId, ref: "Person", required: true },
    contactId: { type: Types.ObjectId, ref: "Contact", required: true },
    addressId: { type: Types.ObjectId, ref: "Address", required: true },
    roleId: { type: Types.ObjectId, ref: "TechnicianRoleModel", required: true },
    accountId: { type: Types.ObjectId, ref: "User", required: true },
    skills: [{ type: Types.ObjectId, ref: "ServiceTypeMaster" }],
    zones: [technicianZonesSchema],
    profilePic: { type: String },
    documents: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },

}, { timestamps: true });



export const TechnicianProfileModel: Model<technicianInformationDoc> = model<technicianInformationDoc>("TechnicianProfileModel", technicianProfileSchema);
