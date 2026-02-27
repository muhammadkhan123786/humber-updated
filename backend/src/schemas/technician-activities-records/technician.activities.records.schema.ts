import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import { Types } from "mongoose";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";

export const technicianActivitiesSchema = {
  JobAssignedId: { type: Types.ObjectId,ref:"TechnicianJobsByAdmin"},
  quotationId:{type:Types.ObjectId,ref:"TicketQuations"},
  activityType:{type:Types.ObjectId,ref:"TechnicianServiceType"},
  technicianId:{type:Types.ObjectId,ref:"Technicians"},
  additionalNotes:{type:String},
  ...commonSchema,
};

export const technicianActivitiesValidation = z.object({
  JobAssignedId:objectIdOrStringSchema,
  quotationId:objectIdOrStringSchema,
  activityType:objectIdOrStringSchema,
  technicianId:objectIdOrStringSchema,
  additionalNotes:z.string().optional(),
  ...commonSchemaValidation,
});
