import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

export const callLogsSchema = {
  autoCallId: { type: String, required: true, trim: true },

  customerName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },

  address: { type: String, trim: true },
  postCode: { type: String, trim: true },
  city: { type: String, trim: true },

  callTypeId: {
    type: Types.ObjectId,
    ref: "CallTypes",
    required: true,
  },

  priorityLevelId: {
    type: Types.ObjectId,
    ref: "ServiceRequestPriorityModel",
    required: true,
  },

  callStatusId: {
    type: Types.ObjectId,
    ref: "CallStatus",
    required: true,
  },

  agentName: { type: String, trim: true },

  callPurpose: { type: String, trim: true },
  callNotes: { type: String, trim: true },

  followUpDate: { type: Date },
  followUpTime: { type: Date },
  followUpNotes: { type: String },

  callDuration: { type: Number, default: 0 },

  ...commonSchema,
};


export const callLogsValidation = z.object({

  autoCallId: z.string().min(1),

  customerName: z.string().min(2),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/),

  address: z.string().optional(),
  postCode: z.string().optional(),
  city: z.string().optional(),

  callTypeId: objectIdOrStringSchema,
  priorityLevelId: objectIdOrStringSchema,
  callStatusId: objectIdOrStringSchema,

  agentName: z.string().optional(),
  callPurpose: z.string().optional(),
  callNotes: z.string().optional(),

  followUpDate: z.union([z.string(), z.date()]).optional(),
  followUpTime: z.union([z.string(), z.date()]).optional(),
  followUpNotes: z.string().optional(),

  callDuration: z.number().optional(),

  ...commonSchemaValidation,
});