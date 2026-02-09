import { Router } from "express";
import { technicianJobsController, technicianTicketsController } from "../../controllers/technician-dashboard-controllers/technician.tickets.controller";


const technicianDashboardRouter = Router();

technicianDashboardRouter.get('/technician-tickets', technicianTicketsController)
technicianDashboardRouter.get('technician-jobs', technicianJobsController)

export default technicianDashboardRouter;