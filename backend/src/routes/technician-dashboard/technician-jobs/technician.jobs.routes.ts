
import { Request, Response, NextFunction, Router } from 'express';
import { TechnicianAuthRequest } from '../../../middleware/auth.middleware';
import { technicianDashboardJobsController } from '../../../controllers/technician-dashboard-controllers/technician-dashboard-jobs/technician.dashboard.jobs';

const technicianDashboardJobsRouter = Router();

technicianDashboardJobsRouter.get('/', technicianDashboardJobsController)

export default technicianDashboardJobsRouter;