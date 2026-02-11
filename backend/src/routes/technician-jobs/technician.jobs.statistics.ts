import { Request, Response, Router } from "express";
import { technicianJobsStatisticsController } from "../../controllers/technician-job-statistics/technician.jobs.statistics.controller";

const technicianJobsStatisticsRouter = Router();

technicianJobsStatisticsRouter.get('/', technicianJobsStatisticsController)
export default technicianJobsStatisticsRouter