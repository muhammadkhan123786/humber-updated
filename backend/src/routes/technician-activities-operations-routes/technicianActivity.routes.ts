import { Router, Request, Response, NextFunction } from "express";
import { string, z } from "zod";
import { objectIdOrStringSchema } from "../../validators/objectId.schema";
import { completeActivity, getAvailablePartsForActivity, installPartsDuringActivity, pauseActivity, resumeActivity, startActivity } from "../../controllers/technician-activities-time-logs/technician.activities.time.logs.controller";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";


const technicianActionsrouter = Router();

// ----------------------
// Zod Schemas
// ----------------------
const activityIdSchema = z.object({
  activityId: objectIdOrStringSchema,
});

const technicianIdSchema = z.object({
  technicianId: objectIdOrStringSchema,
});

//quotation schema Id 
const quotationIdSchema = z.object({
  quotationId: objectIdOrStringSchema,
});

// Schema for each part
const partUserSchema = z.object({
  partId: z.string(),  // can be string or ObjectId
  quantity: z.number().min(1),     // quantity must be >= 1
});

// Full schema
export const partsIdSchema = z.object({
  partsUsed: z.array(partUserSchema).min(1),  // at least 1 part
});



// Middleware for async errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ----------------------
// Routes
// ----------------------



//install parts during activity 
technicianActionsrouter.post(
  "/install-parts",
  asyncHandler(async (req: TechnicianAuthRequest, res: Response) => {
    const { activityId } = req.body;
    const technicianId  = req.technicianId;
    const {partsUsed} = req.body;
    console.log("Installing parts with activityId:", activityId, "technicianId:", technicianId, "partsUsed:", partsUsed);
    const activity = await installPartsDuringActivity(activityId.toString(),technicianId.toString(),partsUsed);
    res.json({ success: true,updatedActivity: activity });
  })
);

//get available parts to changed from quotations 

technicianActionsrouter.get(
  "/get-parts-to-change/:quotationId",
  asyncHandler(async (req: TechnicianAuthRequest, res: Response) => {
    const { quotationId } = quotationIdSchema.parse(req.params);

    const parts = await getAvailablePartsForActivity(quotationId);
    res.json({ success: true,partsAvailableToChange: parts });
  })
);



// Start activity
technicianActionsrouter.post(
  "/:activityId/start",
  asyncHandler(async (req: TechnicianAuthRequest, res: Response) => {
    console.log("Starting activity with params:", req.params, "and technicianId:", req.technicianId);
    const { activityId } = activityIdSchema.parse(req.params);
    const technicianId = req.technicianId; // Already a string from JWT middleware

    const activity = await startActivity(activityId, technicianId);
    res.json({ success: true, activity });
  })
);

// Pause activity
technicianActionsrouter.post(
  "/:activityId/pause",
  asyncHandler(async (req: TechnicianAuthRequest, res: Response) => {
    const { activityId } = activityIdSchema.parse(req.params);
    const technicianId = req.technicianId; // Already a string from JWT middleware

    const activity = await pauseActivity(activityId, technicianId);
    res.json({ success: true, activity });
  })
);

// Resume activity
technicianActionsrouter.post(
  "/:activityId/resume",
  asyncHandler(async (req: TechnicianAuthRequest, res: Response) => {
    const { activityId } = activityIdSchema.parse(req.params);
    const technicianId = req.technicianId; // Already a string from JWT middleware

    const activity = await resumeActivity(activityId, technicianId);
    res.json({ success: true, activity });
  })
);

// Complete activity
technicianActionsrouter.post(
  "/:activityId/complete",
  asyncHandler(async (req: TechnicianAuthRequest, res: Response) => {
    const { activityId } = activityIdSchema.parse(req.params);
    const technicianId = req.technicianId; // Already a string from JWT middleware

    const activity = await completeActivity(activityId, technicianId);
    res.json({ success: true, activity });
  })
);





export default technicianActionsrouter;
