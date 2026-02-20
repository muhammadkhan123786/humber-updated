import { Types } from "mongoose";
import { commonSchema } from "../shared/common.schema";

export const JOB_STATUS = [
    "PENDING", "START", "ON HOLD", "END"
] as const;

export const TechnicianJobByAdminSchema = {
    jobId: { type: String, required: true },
    ticketId: { type: Types.ObjectId, ref: "customerTicketBase", required: true },
    leadingTechnicianId: { type: Types.ObjectId, ref: "Technicians", required: true },
    adminNotes: { type: String },
    jobStatusId: {
        type: String,
        enum: JOB_STATUS,
        required: true,
        default: JOB_STATUS[0],
    },
    quotationId: { type: Types.ObjectId, ref: "TicketQuations", required: true },
    ...commonSchema,
};
