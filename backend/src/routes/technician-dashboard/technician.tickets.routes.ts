import { Router } from "express";
import { getDefaultTaxPercentageController, technicianJobsController, technicianTicketsController } from "../../controllers/technician-dashboard-controllers/technician.tickets.controller";


const technicianDashboardRouter = Router();

technicianDashboardRouter.get('/technician-tickets', technicianTicketsController)
technicianDashboardRouter.get('/technician-jobs', technicianJobsController)
technicianDashboardRouter.get('/default-tax', getDefaultTaxPercentageController)

export default technicianDashboardRouter;