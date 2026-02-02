import { Document, Schema, Types, model } from "mongoose";
import { IDriverCreateDTO } from "../../../../common/mobile-app-interfaces/driver-interfaces/IDriver.register.interface";

export type driverSchemaDoc = IDriverCreateDTO<string[], string[], string[], string[], string[], string[], Types.ObjectId, string> & Document;

const DriverSchema = new Schema<driverSchemaDoc>(
    {
        personalInfo: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true }
        },
        accountId: {
            type: Types.ObjectId,
            ref: "User", required: true
        },

        contactDetails: {
            phoneNumber: { type: String, required: true },
            dateOfBirth: { type: Date, required: true }
        },

        address: {
            address: String,
            city: String,
            state: String,
            zipCode: String
        },

        driverLicenseDetails: {
            licenseNumber: { type: String, required: true },
            expiryDate: { type: Date, required: true },
            experience: { type: Number, default: 0 }
        },

        vehicleDetails: {
            vehicleType: String,
            make: String,
            model: String,
            year: Number,
            licensePlate: String,
            color: String
        },

        emergencyContact: {
            personName: String,
            phoneNumber: String,
            relationship: String
        },
        driverLicense: [String],
        governmentId: [String],
        vehicleRegister: [String],
        insuranceCertificates: [String],
        backgroundChecks: [String],
        otherDocuments: [String]
        ,
        driverPhoto: { type: String },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        isDefault: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const DriverModel = model("Driver", DriverSchema);
