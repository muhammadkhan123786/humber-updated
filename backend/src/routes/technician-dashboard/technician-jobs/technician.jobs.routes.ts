
import { Router } from 'express';

import { technicianDashboardJobsController } from '../../../controllers/technician-dashboard-controllers/technician-dashboard-jobs/technician.dashboard.jobs';
import { technicianDashboardJobsStatisticsController } from '../../../controllers/technician-job-statistics/technician.jobs.statistics.controller';

const technicianDashboardJobsRouter = Router();

technicianDashboardJobsRouter.get('/', technicianDashboardJobsController)
technicianDashboardJobsRouter.get('/technician-dashboard-jobs-statistics', technicianDashboardJobsStatisticsController)

export default technicianDashboardJobsRouter;