import { NextFunction, Request, Router,Response } from "express";
import { updatePartInstallation } from "../../controllers/technician-jobs-assignment-controller/technician.jobs.assignment.controller";

const techncianJobsActivityRouter = Router();

techncianJobsActivityRouter.put('/',updatePartInstallation);

export default techncianJobsActivityRouter;