import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

export const ACTIVITY_STATUS = [
  "pending",
  "in_progress",
  "paused",
  "completed",
] as const;

export type ActivityStatus = typeof ACTIVITY_STATUS[number];

export type PartUsage = {
  partId: string | string[];      // actual Part _id(s)
  quotationPartId?: string;       // optional reference to quotation part
  quantityUsed: number;           // how many units used
};

export type TimeLog = {
  startTime: Date;
  endTime?: Date;
  partsUsed?: PartUsage[],
  totalWorkDurationSeconds?:number,
  totalPauseDurationSeconds?:number,
  pauseCount?:number

};

export const technicianActivitiesSchema = {
  JobAssignedId: { type: Types.ObjectId, ref:"TechnicianJobsByAdmin", required: true },
  quotationId: { type: Types.ObjectId, ref:"TicketQuations", required: true },
  activityType: { type: Types.ObjectId, ref:"TechnicianServiceType", required: true },
  technicianId: { type: Types.ObjectId, ref:"Technicians", required: true },
  additionalNotes: { type:String },

  status: {
    type: String,
    enum: ACTIVITY_STATUS,
    default: ACTIVITY_STATUS[0],
  },

  timeLogs: {
    type: [
      {
        startTime: { type: Date, required: true },
        endTime: { type: Date },
        durationSeconds: { type: Number, default: 0 }, // ✅ Add this
        // Add parts used in this activity session
    partsUsed: [
      {
        partId: { type: Types.ObjectId, ref: "Parts", required: true }, // reference to actual Part
        quotationPartId: { type: Types.ObjectId, ref: "TicketQuations.partsList" }, // optional: reference to part in quotation
        quantityUsed: { type: Number, required: true }, 
      },
    ],
      },
    ],
    default: [],
  },  
  totalTimeInSeconds: { type: Number, default: 0 },
   totalWorkDurationSeconds: { type: Number, default: 0 },

   totalPauseDurationSeconds: { type: Number, default: 0 },

   pauseCount: { type: Number, default: 0 },

  ...commonSchema,
};

export const technicianActivitiesValidation = z.object({
  JobAssignedId: objectIdOrStringSchema,
  quotationId: objectIdOrStringSchema,
  activityType: objectIdOrStringSchema,
  technicianId: objectIdOrStringSchema,
  additionalNotes: z.string().optional(),
  ...commonSchemaValidation,
});