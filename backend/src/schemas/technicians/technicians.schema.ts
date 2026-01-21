import { Schema, Types } from "mongoose";
import { z, } from 'zod';
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { objectIdSchema } from "../../validators/objectId.schema";

export const TECHNICIAN_STATUS = ["Available", "Busy"] as const;

const DutyRosterSchema = new Schema(
    {
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

        isActive: {
            type: Boolean,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },

        endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
    },
    { _id: false }
);


const AdditionalInformationSchema = new Schema(
    {
        emergencyContactName: String,
        emergencyContactNumber: String,
        healthInsuranceDetails: String,
        additionalNotes: String
    },
    { _id: false }
);

export const technicianSchema = {
    personId: { type: Types.ObjectId, ref: "Person", required: true },
    addressId: { type: Types.ObjectId, ref: "Address" },
    contactId: { type: Types.ObjectId, ref: "Contact" },
    accountId: { type: Types.ObjectId, ref: "User", required: true },
    technicianStatus: {
        type: String,
        enum: TECHNICIAN_STATUS,
        default: "Available",
        required: true,
    },
    dateOfBirth: Date,
    employeeId: String,
    dateOfJoining: Date,

    contractTypeId: { type: Types.ObjectId, ref: "ContractType", default: null },
    departmentId: { type: Types.ObjectId, ref: "Department", default: null },

    specializationIds: {
        type: [{
            type: Types.ObjectId,
            ref: "ServiceTypeMaster"
        }],
        default: []
    },

    paymentFrequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly"],
        required: true
    },

    salary: Number,
    bankAccountNumber: String,
    taxId: String,

    dutyRoster: {
        type: [DutyRosterSchema],
        default: []
    },

    technicianDocuments: {
        type: [String],
        default: []
    },

    additionalInformation: {
        type: AdditionalInformationSchema,
        default: {}
    },

    ...commonSchema
};


//zod schema 
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
/** Days of week */
export const DAYS = z.enum([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]);

/** Payment frequency */
export const PAYMENT_FREQUENCY = z.enum([
    "Daily",
    "Weekly",
    "Monthly",
]);

/** Roles */
export const ROLES = z.enum([
    "Admin",
    "Technician",
    "Customer",
]).default("Technician");

export const DUTY_ROSTER_SCHEMA = z.object({
    day: DAYS,
    isActive: z.boolean(),

    startTime: z
        .string()
        .regex(TIME_REGEX, "startTime must be in HH:mm format"),

    endTime: z
        .string()
        .regex(TIME_REGEX, "endTime must be in HH:mm format"),
})
    .refine(
        (data) => data.startTime < data.endTime,
        {
            message: "endTime must be after startTime",
            path: ["endTime"],
        }
    );

export const ADDITIONAL_INFORMATION_SCHEMA = z.object({
    emergencyContactName: z.string().min(2).optional(),
    emergencyContactNumber: z.string().min(7).optional(),
    healthInsuranceDetails: z.string().optional(),
    additionalNotes: z.string().optional(),
}).optional();


export const TECHNICIAN_SCHEMA_Validation = z.object({
    personId: objectIdSchema,
    accountId: objectIdSchema,

    addressId: objectIdSchema.optional(),
    contactId: objectIdSchema.optional(),

    dateOfBirth: z.coerce.date().optional(),
    employeeId: z.string().optional(),
    dateOfJoining: z.coerce.date().optional(),

    contractTypeId: objectIdSchema.nullable().optional(),
    departmentId: objectIdSchema.nullable().optional(),

    specializationIds: z.array(objectIdSchema).default([]),

    paymentFrequency: PAYMENT_FREQUENCY,

    salary: z.number().positive().optional(),
    bankAccountNumber: z.string().optional(),
    taxId: z.string().optional(),

    dutyRoster: z.array(DUTY_ROSTER_SCHEMA).default([]),

    technicianStatus: z
        .enum(TECHNICIAN_STATUS)
        .optional()
        .default("Available"),

    technicianDocuments: z.array(z.string()).default([]),

    additionalInformation: ADDITIONAL_INFORMATION_SCHEMA,

    ...commonSchemaValidation
});
