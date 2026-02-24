import { Types } from "mongoose";
import { commonSchema } from "../shared/common.schema";

const InspectionItemSchema = {
    inspectionTypeId: {
        type: Types.ObjectId,
        ref: "technicianInspectionList",
        required: true,
    },
    status: {
        type: String,
        enum: ["PASS", "FAIL", "N/A"],
        required: true,
    },
    notes: {
        type: String,
    },
};

export const InspectionSchema = {
    jobId: {
        type: Types.ObjectId,
        ref: "TechnicianJobsByAdmin",
        required: true,
    },
    tecnicianId: { type: Types.ObjectId, ref: "Technicians", required: true },
    inspectionTIME: {
        type: String,
        enum: ["BEFORE SERVICE", "AFTER SERVICE"],
        required: true,
    },

    inspectionSummary: {
        type: String,
    },

    inspections: {
        type: [InspectionItemSchema], // ✅ Array of inspections
        required: true,
    },

    ...commonSchema,
};





