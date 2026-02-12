import { Request, Response, Router } from "express";
import {
  assignTicketToTechnicianController,
  technicianJobsStatisticsController,
} from "../../controllers/technician-job-statistics/technician.jobs.statistics.controller";

const technicianJobsStatisticsRouter = Router();

technicianJobsStatisticsRouter.get("/", technicianJobsStatisticsController);
technicianJobsStatisticsRouter.put("/:id", assignTicketToTechnicianController);
export default technicianJobsStatisticsRouter;
