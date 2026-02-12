import { Request, Response, Router } from "express";
import { assignTicketToTechnicianController, technicianActiveJobsCountController, technicianJobsStatisticsController } from "../../controllers/technician-job-statistics/technician.jobs.statistics.controller";

const technicianJobsStatisticsRouter = Router();

technicianJobsStatisticsRouter.get('/', technicianJobsStatisticsController)
technicianJobsStatisticsRouter.get('/technician-active-jobs', technicianActiveJobsCountController)
technicianJobsStatisticsRouter.put('/:id', assignTicketToTechnicianController)
export default technicianJobsStatisticsRouter