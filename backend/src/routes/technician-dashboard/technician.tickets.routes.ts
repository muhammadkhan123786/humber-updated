import { Router } from "express";
import { technicianTicketsController } from "../../controllers/technician-dashboard-controllers/technician.tickets.controller";


const technicianDashboardRouter = Router();

technicianDashboardRouter.get('/technician-tickets', technicianTicketsController)

export default technicianDashboardRouter;